import { Router } from 'express';
import {
  getFullMenu,
  getMenuCategories,
  getMenuItemById,
  getBurgerOptions,
} from '../controllers/menuController';

const router = Router();

router.get('/', getFullMenu);
router.get('/categories', getMenuCategories);
router.get('/items/:id', getMenuItemById);
router.get('/burger-options', getBurgerOptions);

export default router;

// Made with Bob
