import api from './api';
import { OrderDto, CreateOrderDto, OrderSummaryDto } from '@burger-palace/shared';

export const orderService = {
  async createOrder(orderData: CreateOrderDto): Promise<OrderDto> {
    const response = await api.post<{ status: string; data: OrderDto }>('/orders', orderData);
    return response.data.data;
  },

  async getOrderById(orderId: string): Promise<OrderDto> {
    const response = await api.get<{ status: string; data: OrderDto }>(`/orders/${orderId}`);
    return response.data.data;
  },

  async getOrderByOrderNumber(orderNumber: string): Promise<OrderDto> {
    const response = await api.get<{ status: string; data: OrderDto }>(`/orders/number/${orderNumber}`);
    return response.data.data;
  },

  async getOrdersByCustomerId(customerId: string): Promise<OrderSummaryDto[]> {
    const response = await api.get<{ status: string; data: OrderSummaryDto[] }>(`/orders/customer/${customerId}`);
    return response.data.data;
  },
};

// Made with Bob
