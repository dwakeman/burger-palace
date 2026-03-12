import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getOrderByOrderNumber,
  getOrdersByCustomerId,
  updateOrderStatus,
} from '../controllers/orderController';
import { validate, createOrderSchema } from '../middleware/validator';

const router = Router();

router.post('/', validate(createOrderSchema), createOrder);
router.get('/:id', getOrderById);
router.get('/number/:orderNumber', getOrderByOrderNumber);
router.get('/customer/:customerId', getOrdersByCustomerId);
router.patch('/:id/status', updateOrderStatus);

export default router;

// Made with Bob
