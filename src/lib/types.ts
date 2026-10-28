export interface Outlet {
  id: number;
  code: string;
  name: string;
  address: string;
  phone?: string | null;
}

export interface Product {
  id: number;
  outletId?: number | null;
  name: string;
  category: "Produk" | "Paket" | string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  image?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SaleItem {
  id?: number;
  saleId?: number;
  productId?: number | null;
  productName: string;
  quantity: number;
  price: number;
  costPrice: number;
  subtotal: number;
  profit: number;
}

export interface Sale {
  id: number;
  invoiceNumber: string;
  outletId?: number | null;
  date: string;
  totalAmount: number;
  totalCost: number;
  grossProfit: number;
  paymentMethod: string;
  notes?: string | null;
  items?: SaleItem[];
}

export interface Expense {
  id: number;
  outletId?: number | null;
  category: "Bahan Baku" | "Gaji" | "Listrik/Sewa" | "Operasional" | "Dll" | string;
  date: string;
  amount: number;
  description: string;
  receiptUrl?: string | null;
  createdAt?: string;
}

export interface DashboardMetrics {
  outletName: string;
  outletId: number;
  netProfitToday: number;
  netProfitGrowth: number;
  salesToday: number;
  salesGrowth: number;
  hppToday: number;
  hppGrowth: number;
  operationalExpensesToday: number;
  expensesGrowth: number;
  itemsSoldToday: number;
  itemsSoldGrowth: number;
  dailySales7Days: {
    dayName: string;
    date: string;
    amount: number;
    portions: number;
  }[];
}

export interface ProductProfitReport {
  id: number;
  name: string;
  category: string;
  portionsSold: number;
  omzet: number;
  totalCost: number;
  grossProfit: number;
  marginPercent: number;
}

export interface FinancialReportData {
  timeframe: "Harian" | "Mingguan" | "Bulanan";
  startDate: string;
  endDate: string;
  totalSales: number; // Omzet
  totalHpp: number; // Biaya Bahan
  grossProfit: number; // Omzet - HPP
  operationalExpenses: number; // Beban Operasional
  netProfit: number; // Laba Bersih = Laba Kotor - Beban Operasional
  totalPortions: number;
  productBreakdown: ProductProfitReport[];
  expensesByCategory: { category: string; amount: number; percentage: number }[];
}
