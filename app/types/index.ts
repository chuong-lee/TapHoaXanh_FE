export type Voucher = {
  id: number;
  code: string;
  max_discount: number;
  min_order_value: number;
  quantity: number;
  start_date: string;
  end_date: string;
  is_used: boolean;
  type?: "PERCENTAGE" | "NORMAL";
  value?: number;
};

export type News = {
  id: string;
  name: string;
  images: string[];
  date: string;
  views: number;
  readTime: string;
  description: string;
  type: string;
  createdAt: string;
};

export type RelatedNews = {
  id: string;
  name: string;
  images: string[];
  date: string;
  views: number;
  readTime: string;
  description: string;
  category: string;
  createdAt: string;
};

export interface OrderItem {
  id: number;
  quantity: number;
  unit_price: number;
  product: Product;
}

export interface Payment {
  id: number;
  createdAt: string; // hoặc Date nếu bạn parse
  updatedAt: string;
  deletedAt?: string | null; // có thể null nếu chưa xoá
  payment_method: string;
  status: string;
  amount: number;
  txn_ref: string;
  order_id: number;
}
export interface Order {
  id: number;
  createdAt: string | null;
  // price: number | null;
  total_price: number;
  order_code: string;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  orderItem: OrderItem[];
  voucher: Voucher[] | null;
  payments: Payment[];
}

// Interface sản phẩm
export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  images: string;
  slug: string;
  barcode: string;
  expiry_date: string;
  origin: string;
  weight_unit: string;
  description: string;
  purchase: number;
  categoryId: number;
  brandId: number;
}

export type CategoryCount = {
  categoryId: number;
  categoryName: string;
  count: string;
};

export interface CartItem {
  id: number;
  quantity: number;
  price: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  total_price: number;
  slug: string;
}

export interface Cart {
  id: number;
  cartItems: CartItem[];
}

export type CartAction = "update" | "increase" | "decrease";

export interface ProductImages {
  id: number;
  product_id: number;
  image_url: string;
}

export interface Rating {
  ratingId: number;
  productName: string;
  rating: number;
  userName: string;
  comment: string;
  createdAt: string;
}
// Address types
export interface Address {
  id: number;
  street: string;
  city: string;
  district: string;
  is_default: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  street: string;
  city: string;
  district: string;
  is_default: boolean;
}

export interface UpdateAddressDto {
  street?: string;
  city?: string;
  district?: string;
  is_default?: boolean;
}
