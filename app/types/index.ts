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
    id: string
    title: string
    image: string
    date: string
    views: number
    readTime: string
    description: string
    category: string
    createdAt: string
  }