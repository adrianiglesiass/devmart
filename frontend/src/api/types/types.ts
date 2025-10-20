import type { paths } from './api.types';

// Helper types
export type ArrayElement<T> = T extends (infer U)[] ? U : T extends readonly (infer U)[] ? U : T;

// Auth
export type LoginRequest =
  paths['/auth/login']['post']['requestBody']['content']['application/json'];
export type LoginResponse =
  paths['/auth/login']['post']['responses']['200']['content']['application/json'];

export type RegisterRequest =
  paths['/auth/register']['post']['requestBody']['content']['application/json'];
export type RegisterResponse =
  paths['/auth/register']['post']['responses']['201']['content']['application/json'];

export type AuthResponse = LoginResponse;
export type User = LoginResponse['user'];

export type GetCurrentUserResponse =
  paths['/auth/me']['get']['responses']['200']['content']['application/json'];

// Products
export type Product = GetProductResponse;

export type GetProductsResponse =
  paths['/products/']['get']['responses']['200']['content']['application/json'];

export type GetProductResponse =
  paths['/products/{id}']['get']['responses']['200']['content']['application/json'];

export type CreateProductRequest =
  paths['/products/']['post']['requestBody']['content']['application/json'];
export type CreateProductResponse =
  paths['/products/']['post']['responses']['201']['content']['application/json'];

export type UpdateProductRequest =
  paths['/products/{id}']['put']['requestBody']['content']['application/json'];
export type UpdateProductResponse =
  paths['/products/{id}']['put']['responses']['200']['content']['application/json'];

export type DeleteProductResponse =
  paths['/products/{id}']['delete']['responses']['200']['content']['application/json'];

// Categories
export type Category = GetCategoryResponse;
export type CategoryProduct = ArrayElement<Category['products']>;

export type GetCategoriesResponse =
  paths['/categories/']['get']['responses']['200']['content']['application/json'];

export type GetCategoryResponse =
  paths['/categories/{id}']['get']['responses']['200']['content']['application/json'];

export type CreateCategoryRequest =
  paths['/categories/']['post']['requestBody']['content']['application/json'];
export type CreateCategoryResponse =
  paths['/categories/']['post']['responses']['201']['content']['application/json'];

export type UpdateCategoryRequest =
  paths['/categories/{id}']['put']['requestBody']['content']['application/json'];
export type UpdateCategoryResponse =
  paths['/categories/{id}']['put']['responses']['200']['content']['application/json'];

export type GetCategoryProductsResponse =
  paths['/categories/{id}/products']['get']['responses']['200']['content']['application/json'];

// Orders
export type Order = GetOrderResponse;

export type OrderItem = ArrayElement<Order['items']>;

export type GetOrdersResponse =
  paths['/orders/']['get']['responses']['200']['content']['application/json'];

export type GetOrderResponse =
  paths['/orders/{id}']['get']['responses']['200']['content']['application/json'];

export type CreateOrderRequest =
  paths['/orders/']['post']['requestBody']['content']['application/json'];
export type CreateOrderResponse =
  paths['/orders/']['post']['responses']['201']['content']['application/json'];

export type UpdateOrderStatusRequest =
  paths['/orders/{id}/status']['put']['requestBody']['content']['application/json'];
export type UpdateOrderStatusResponse =
  paths['/orders/{id}/status']['put']['responses']['200']['content']['application/json'];

export type CancelOrderResponse =
  paths['/orders/{id}']['delete']['responses']['200']['content']['application/json'];

export type ApiError =
  | paths['/auth/login']['post']['responses']['400']['content']['application/json']
  | paths['/auth/login']['post']['responses']['401']['content']['application/json'];

export type { paths } from './api.types';
