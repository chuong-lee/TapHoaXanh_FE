export type Voucher = {
  id: number;
  code: string;
  max_discount: number;
  min_order_value: number;
  quantity: number;
  is_used: number;
  start_date: string;
  end_date: string;
  description?: string;
  image?: string; // Thêm trường image
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

export interface Order {
  id: number;
  createdAt: string | null;
  price: number | null;
  status: "chờ xử lý" | "đã xác nhận" | "đang giao" | "đã giao" | "đã hủy";
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
}

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
