
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  material?: string;
  color?: string;
  size?: string;
  brand?: string;
  purchase_price: number;
  selling_price: number;
  quantity: number;
  image_url?: string;
  created_at: string;
}

export interface BillItem {
  id: number;
  bill_id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: Product | null;
}

export interface Bill {
  id: number;
  bill_number: string;
  total_amount: number;
  created_at: string;
  items?: BillItem[];
}

export interface BillWithItems extends Bill {
  items: BillItem[];
}

export interface Report {
  total_bills: number;
  total_revenue: number;
  total_products?: number;
  total_stock?: number;
  low_stock_count?: number;
  top_selling_products: Product[] & { total_quantity: number; total_revenue: number }[];
}

export interface BillItemForm {
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

