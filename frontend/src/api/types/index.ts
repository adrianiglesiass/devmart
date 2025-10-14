export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  category_id?: number;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items: OrderItem[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image_url?: string;
  category_id?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface CreateOrderRequest {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface UpdateOrderStatusRequest {
  status: Order['status'];
}

export interface ApiError {
  error?: string;
  message?: string;
  msg?: string;
}
