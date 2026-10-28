import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const outlets = pgTable("outlets", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id),
  name: text("name").notNull(),
  category: text("category").notNull().default("Produk"), // "Produk" | "Paket"
  price: integer("price").notNull(), // Selling price (Harga Jual)
  costPrice: integer("cost_price").notNull(), // HPP (Biaya Bahan Pokok)
  stock: integer("stock").notNull().default(0),
  minStock: integer("min_stock").notNull().default(10),
  image: text("image"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  outletId: integer("outlet_id").references(() => outlets.id),
  date: timestamp("date").notNull().defaultNow(),
  totalAmount: integer("total_amount").notNull(), // Total Omzet
  totalCost: integer("total_cost").notNull(), // Total HPP
  grossProfit: integer("gross_profit").notNull(), // Omzet - HPP
  paymentMethod: text("payment_method").notNull().default("Tunai"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const saleItems = pgTable("sale_items", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id").references(() => sales.id, { onDelete: "cascade" }).notNull(),
  productId: integer("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  costPrice: integer("cost_price").notNull(),
  subtotal: integer("subtotal").notNull(),
  profit: integer("profit").notNull(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  outletId: integer("outlet_id").references(() => outlets.id),
  category: text("category").notNull(), // "Bahan Baku" | "Gaji" | "Listrik/Sewa" | "Operasional" | "Dll"
  date: timestamp("date").notNull().defaultNow(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  receiptUrl: text("receipt_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("Owner"),
  outletId: integer("outlet_id").references(() => outlets.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
