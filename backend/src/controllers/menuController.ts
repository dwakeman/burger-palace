import { Request, Response } from 'express';
import menuService from '../services/menuService';
import { asyncHandler } from '../middleware/errorHandler';

export const getFullMenu = asyncHandler(async (req: Request, res: Response) => {
  const menu = await menuService.getFullMenu();
  res.json({
    status: 'success',
    data: menu,
  });
});

export const getMenuCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await menuService.getMenuCategories();
  res.json({
    status: 'success',
    data: categories,
  });
});

export const getMenuItemById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await menuService.getMenuItemById(id);
  
  if (!item) {
    return res.status(404).json({
      status: 'error',
      message: 'Menu item not found',
    });
  }

  res.json({
    status: 'success',
    data: item,
  });
});

export const getBurgerOptions = asyncHandler(async (req: Request, res: Response) => {
  const options = await menuService.getBurgerOptions();
  res.json({
    status: 'success',
    data: options,
  });
});

// Made with Bob
