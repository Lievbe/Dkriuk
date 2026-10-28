import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { ensureDatabaseSeeded } from "@/lib/seed";
import { eq, desc, gte, lte, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    await ensureDatabaseSeeded();
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe") || "Harian"; // Harian | Mingguan | Bulanan | Semua
    const category = searchParams.get("category");
    const dateStr = searchParams.get("date"); // YYYY-MM-DD

    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    if (dateStr) {
      const selected = new Date(dateStr);
      startDate = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 0, 0, 0);
      endDate = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 23, 59, 59);
    } else if (timeframe === "Harian") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    } else if (timeframe === "Mingguan") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === "Bulanan") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    } else {
      startDate = new Date(2020, 0, 1);
    }

    const conditions = [
      gte(expenses.date, startDate),
      lte(expenses.date, endDate),
    ];

    if (category && category !== "Semua") {
      conditions.push(eq(expenses.category, category));
    }

    const list = await db
      .select()
      .from(expenses)
      .where(and(...conditions))
      .orderBy(desc(expenses.date));

    const totalAmount = list.reduce((acc, curr) => acc + curr.amount, 0);

    return NextResponse.json({
      success: true,
      expenses: list,
      totalAmount,
      count: list.length,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, date, amount, description, outletId = 1 } = body;

    if (!category || !amount || !description) {
      return NextResponse.json(
        { success: false, error: "Kategori, jumlah nominal, dan keterangan wajib diisi" },
        { status: 400 }
      );
    }

    const expenseDate = date ? new Date(date) : new Date();

    const [newExpense] = await db
      .insert(expenses)
      .values({
        outletId: parseInt(outletId, 10),
        category,
        date: expenseDate,
        amount: parseInt(amount, 10),
        description: description.trim(),
      })
      .returning();

    return NextResponse.json({ success: true, expense: newExpense });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID pengeluaran diperlukan" }, { status: 400 });
    }

    await db.delete(expenses).where(eq(expenses.id, parseInt(id, 10)));
    return NextResponse.json({ success: true, message: "Pengeluaran berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
