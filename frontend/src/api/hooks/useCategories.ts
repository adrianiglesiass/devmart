import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { categoriesApi } from '@/api/services/categories.api';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/api/types/types';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
  });
};

export const useCategoryById = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesApi.getCategoryById(id),
    enabled: !!id,
  });
};

export const useCategoryBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['category', 'slug', slug],
    queryFn: () => categoriesApi.getCategoryBySlug(slug!),
    enabled: !!slug,
  });
};

export const useCategoryProducts = (categoryId: number | undefined) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => categoriesApi.getProductsForCategory(categoryId!),
    enabled: !!categoryId,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoriesApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) =>
      categoriesApi.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
