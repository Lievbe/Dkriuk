import { NextResponse } from "next/server";
import { ensureDatabaseSeeded } from "@/lib/seed";
import { db } from "@/db";
import { outlets, products, sales, saleItems, expenses, users } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseSeeded();
    const allOutlets = await db.select().from(outlets);
    return NextResponse.json({ success: true, outlets: allOutlets });
  } catch (error) {
    console.error("Init error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { action } = await req.json().catch(() => ({ action: "seed" }));
    if (action === "reset") {
      // Clear data and re-seed
      await db.delete(saleItems);
      await db.delete(sales);
      await db.delete(expenses);
      await db.delete(products);
      await db.delete(users);
      await db.delete(outlets);
      await ensureDatabaseSeeded();
      return NextResponse.json({ success: true, message: "Database reset to initial demo state" });
    }

    await ensureDatabaseSeeded();
    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
