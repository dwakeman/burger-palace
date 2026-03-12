export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItemOptionDto {
  id: string;
  orderItemId: string;
  burgerOptionId: string;
  burgerOption?: {
    id: string;
    optionType: string;
    name: string;
    priceModifier: number;
  };
}

export interface OrderItemDto {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
  menuItem?: {
    id: string;
    name: string;
    description: string;
  };
  options?: OrderItemOptionDto[];
}

export interface OrderDto {
  id: string;
  customerId: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  items?: OrderItemDto[];
}

export interface CreateOrderItemDto {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
  burgerOptionIds?: string[];
}

export interface CreateOrderDto {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: CreateOrderItemDto[];
}

export interface OrderSummaryDto {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
}

// Made with Bob
