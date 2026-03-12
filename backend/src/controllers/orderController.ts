import { Request, Response } from 'express';
import orderService from '../services/orderService';
import { asyncHandler } from '../middleware/errorHandler';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.createOrder(req.body);
  
  res.status(201).json({
    status: 'success',
    data: order,
  });
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await orderService.getOrderById(id);
  
  res.json({
    status: 'success',
    data: order,
  });
});

export const getOrderByOrderNumber = asyncHandler(async (req: Request, res: Response) => {
  const { orderNumber } = req.params;
  const order = await orderService.getOrderByOrderNumber(orderNumber);
  
  res.json({
    status: 'success',
    data: order,
  });
});

export const getOrdersByCustomerId = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const orders = await orderService.getOrdersByCustomerId(customerId);
  
  res.json({
    status: 'success',
    data: orders,
  });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(id, status);
  
  res.json({
    status: 'success',
    data: order,
  });
});

// Made with Bob
