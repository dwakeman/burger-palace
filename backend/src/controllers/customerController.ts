import { Request, Response } from 'express';
import customerService from '../services/customerService';
import { asyncHandler } from '../middleware/errorHandler';

export const getCustomerById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await customerService.getCustomerById(id);
  
  res.json({
    status: 'success',
    data: customer,
  });
});

export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.createCustomer(req.body);
  
  res.status(201).json({
    status: 'success',
    data: customer,
  });
});

// Made with Bob
