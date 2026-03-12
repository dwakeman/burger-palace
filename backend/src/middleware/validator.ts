import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errorMessages,
        });
      }
      next(error);
    }
  };
};

// Validation schemas
export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
});

export const createOrderItemSchema = z.object({
  menuItemId: z.string().uuid('Invalid menu item ID'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  specialInstructions: z.string().optional(),
  burgerOptionIds: z.array(z.string().uuid()).optional(),
});

export const createOrderSchema = z.object({
  customer: createCustomerSchema,
  items: z.array(createOrderItemSchema).min(1, 'Order must contain at least one item'),
});

// Made with Bob
