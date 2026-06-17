
export interface Product {
  id: number
  name: string
  category: string
  material?: string
  color?: string
  size?: string
  brand?: string
  purchase_price: number
  selling_price: number
  quantity: number
  created_at: string
  image_url?: string
}

export interface BillItem {
  id: number
  bill_id: number
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
  product: Product
}

export interface BillWithItems {
  id: number
  bill_number: string
  total_amount: number
  created_at: string
  items: BillItem[]
}

export interface BillItemForm {
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
}
