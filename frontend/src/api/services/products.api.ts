import api from '@/api/config/axios';
import type {
  CreateProductRequest,
  CreateProductResponse,
  DeleteProductResponse,
  GetProductResponse,
  GetProductsResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from '@/api/types/types';

export const productsApi = {
  async getProducts(): Promise<GetProductsResponse> {
    const { data } = await api.get<GetProductsResponse>('/products/');
    return data;
  },

  async getProduct(id: number): Promise<GetProductResponse> {
    const { data } = await api.get<GetProductResponse>(`/products/${id}`);
    return data;
  },

  async createProduct(productData: CreateProductRequest): Promise<CreateProductResponse> {
    const { data } = await api.post<CreateProductResponse>('/products/', productData);
    return data;
  },

  async updateProduct(
    id: number,
    productData: UpdateProductRequest,
  ): Promise<UpdateProductResponse> {
    const { data } = await api.put<UpdateProductResponse>(`/products/${id}`, productData);
    return data;
  },

  async deleteProduct(id: number): Promise<DeleteProductResponse> {
    const { data } = await api.delete<DeleteProductResponse>(`/products/${id}`);
    return data;
  },
};
