import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ensureDatabaseSeeded } from "@/lib/seed";
import { eq, desc, and, like, or } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    await ensureDatabaseSeeded();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("query");
    const lowStock = searchParams.get("lowStock");

    let conditions = [];
    if (category && category !== "Semua") {
      conditions.push(eq(products.category, category));
    }
    if (query) {
      conditions.push(like(products.name, `%${query}%`));
    }

    const allProducts = await db
      .select()
      .from(products)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(products.id);

    // Filter low stock if specified
    const filtered = lowStock === "true" 
      ? allProducts.filter((p) => p.stock <= p.minStock)
      : allProducts;

    return NextResponse.json({ success: true, products: filtered });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, price, costPrice, stock, minStock, image, outletId } = body;

    if (!name || price === undefined || costPrice === undefined) {
      return NextResponse.json({ success: false, error: "Nama, harga jual, dan HPP wajib diisi" }, { status: 400 });
    }

    const [newProduct] = await db
      .insert(products)
      .values({
        outletId: outletId ? parseInt(outletId, 10) : 1,
        name: name.trim(),
        category: category || "Produk",
        price: parseInt(price, 10),
        costPrice: parseInt(costPrice, 10),
        stock: parseInt(stock || "0", 10),
        minStock: parseInt(minStock || "10", 10),
        image: image || "/images/ayam-original.png",
        isActive: true,
      })
      .returning();

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, category, price, costPrice, stock, minStock, image, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID produk diperlukan" }, { status: 400 });
    }

    const [updated] = await db
      .update(products)
      .set({
        name: name !== undefined ? name : undefined,
        category: category !== undefined ? category : undefined,
        price: price !== undefined ? parseInt(price, 10) : undefined,
        costPrice: costPrice !== undefined ? parseInt(costPrice, 10) : undefined,
        stock: stock !== undefined ? parseInt(stock, 10) : undefined,
        minStock: minStock !== undefined ? parseInt(minStock, 10) : undefined,
        image: image !== undefined ? image : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      })
      .where(eq(products.id, parseInt(id, 10)))
      .returning();

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID produk diperlukan" }, { status: 400 });
    }

    await db.delete(products).where(eq(products.id, parseInt(id, 10)));
    return NextResponse.json({ success: true, message: "Produk berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
