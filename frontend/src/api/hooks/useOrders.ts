import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ordersApi } from '@/api/services/orders.api';
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '@/api/types/types';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.list,
  });
};

export const useOrder = (id: number | undefined) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderRequest) => ordersApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      if (res.order?.id) {
        queryClient.setQueryData(['orders', res.order.id], res.order);
      }
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ordersApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateOrderStatusRequest }) =>
      ordersApi.updateStatus(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
    },
  });
};
