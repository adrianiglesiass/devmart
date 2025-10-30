import api from '@/api/config/axios';
import type {
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetCategoriesResponse,
  GetCategoryBySlugResponse,
  GetCategoryProductsResponse,
  GetCategoryResponse,
  Product,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from '@/api/types/types';

export const categoriesApi = {
  async getCategories(): Promise<GetCategoriesResponse> {
    const { data } = await api.get<GetCategoriesResponse>('/categories/');
    return data;
  },

  async getCategoryById(id: number): Promise<GetCategoryResponse> {
    const { data } = await api.get<GetCategoryResponse>(`/categories/${id}`);
    return data;
  },

  async getCategoryBySlug(slug: string): Promise<GetCategoryBySlugResponse> {
    const { data } = await api.get<GetCategoryBySlugResponse>(`/categories/slug/${slug}`);
    return data;
  },

  async getProductsForCategory(id: number): Promise<Product[]> {
    const { data } = await api.get<GetCategoryProductsResponse>(`/categories/${id}/products`);
    return data;
  },

  async createCategory(categoryData: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    const { data } = await api.post<CreateCategoryResponse>('/categories/', categoryData);
    return data;
  },

  async updateCategory(
    id: number,
    categoryData: UpdateCategoryRequest,
  ): Promise<UpdateCategoryResponse> {
    const { data } = await api.put<UpdateCategoryResponse>(`/categories/${id}`, categoryData);
    return data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

export const getCategoryBySlug = categoriesApi.getCategoryBySlug;
export const getProductsForCategory = categoriesApi.getProductsForCategory;
