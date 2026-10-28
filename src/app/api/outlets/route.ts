import { NextResponse } from "next/server";
import { db } from "@/db";
import { outlets } from "@/db/schema";
import { ensureDatabaseSeeded } from "@/lib/seed";

export async function GET() {
  try {
    await ensureDatabaseSeeded();
    const result = await db.select().from(outlets).orderBy(outlets.id);
    return NextResponse.json({ success: true, outlets: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
