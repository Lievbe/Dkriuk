import { NextResponse } from "next/server";
import { db } from "@/db";
import { sales, saleItems, products } from "@/db/schema";
import { ensureDatabaseSeeded } from "@/lib/seed";
import { eq, desc, sql } from "drizzle-orm";
import { calculateGrossProfit } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    await ensureDatabaseSeeded();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const allSales = await db
      .select()
      .from(sales)
      .orderBy(desc(sales.date))
      .limit(limit);

    // Fetch items for each sale
    const result = await Promise.all(
      allSales.map(async (sale) => {
        const items = await db
          .select()
          .from(saleItems)
          .where(eq(saleItems.saleId, sale.id));
        return {
          ...sale,
          items,
        };
      })
    );

    return NextResponse.json({ success: true, sales: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, paymentMethod = "Tunai", notes = "", outletId = 1 } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Keranjang penjualan masih kosong" }, { status: 400 });
    }

    // Calculate totals
    let totalAmount = 0;
    let totalCost = 0;

    const formattedItems = items.map((item: any) => {
      const qty = parseInt(item.quantity, 10);
      const price = parseInt(item.price, 10);
      const costPrice = parseInt(item.costPrice, 10);
      const subtotal = qty * price;
      const profit = qty * (price - costPrice);

      totalAmount += subtotal;
      totalCost += qty * costPrice;

      return {
        productId: item.productId ? parseInt(item.productId, 10) : null,
        productName: item.productName || item.name,
        quantity: qty,
        price,
        costPrice,
        subtotal,
        profit,
      };
    });

    const grossProfit = calculateGrossProfit(totalAmount, totalCost);

    // Generate Invoice Number TRX-YYYYMMDD-NNNN
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `TRX-${dateStr}-${randomSuffix}`;

    // Insert sale
    const [savedSale] = await db
      .insert(sales)
      .values({
        invoiceNumber,
        outletId: parseInt(outletId, 10),
        date: now,
        totalAmount,
        totalCost,
        grossProfit,
        paymentMethod,
        notes,
      })
      .returning();

    // Insert sale items and deduct stock
    for (const item of formattedItems) {
      await db.insert(saleItems).values({
        saleId: savedSale.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        costPrice: item.costPrice,
        subtotal: item.subtotal,
        profit: item.profit,
      });

      // Deduct stock if productId exists
      if (item.productId) {
        await db
          .update(products)
          .set({
            stock: sql`GREATEST(0, ${products.stock} - ${item.quantity})`,
          })
          .where(eq(products.id, item.productId));
      }
    }

    return NextResponse.json({
      success: true,
      sale: {
        ...savedSale,
        items: formattedItems,
      },
    });
  } catch (error) {
    console.error("Sale error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
