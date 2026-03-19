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

export const getAllCustomers = asyncHandler(async (req: Request, res: Response) => {
  const customers = await customerService.getAllCustomers();
  
  res.json({
    status: 'success',
    data: customers,
  });
});

export const getCustomerByEmail = asyncHandler(async (req: Request, res: Response) => {
  const email = req.query.email as string;
  
  if (!email) {
    return res.status(400).json({
      status: 'error',
      message: 'Email query parameter is required'
    });
  }

  const customer = await customerService.getCustomerByEmail(email);
  
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
