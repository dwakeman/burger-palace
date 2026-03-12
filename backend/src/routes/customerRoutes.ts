import { Router } from 'express';
import { getCustomerById, createCustomer } from '../controllers/customerController';
import { validate, createCustomerSchema } from '../middleware/validator';

const router = Router();

router.post('/', validate(createCustomerSchema), createCustomer);
router.get('/:id', getCustomerById);

export default router;

// Made with Bob
