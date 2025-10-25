import axios from '@/api/config/axios';
import type {
  CancelOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  GetOrdersResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from '@/api/types/types';

export const ordersApi = {
  create: async (payload: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const { data } = await axios.post('/orders/', payload);
    return data;
  },
  list: async (): Promise<GetOrdersResponse> => {
    const { data } = await axios.get('/orders/');
    return data;
  },
  getById: async (id: number): Promise<GetOrderResponse> => {
    const { data } = await axios.get(`/orders/${id}`);
    return data;
  },
  cancel: async (id: number): Promise<CancelOrderResponse> => {
    const { data } = await axios.delete(`/orders/${id}`);
    return data;
  },
  updateStatus: async (
    id: number,
    body: UpdateOrderStatusRequest,
  ): Promise<UpdateOrderStatusResponse> => {
    const { data } = await axios.put(`/orders/${id}/status`, body);
    return data;
  },
};
