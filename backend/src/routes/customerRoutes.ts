import { Router } from 'express';
import { getCustomerById, getAllCustomers, createCustomer } from '../controllers/customerController';
import { validate, createCustomerSchema } from '../middleware/validator';

const router = Router();

router.get('/', getAllCustomers);
router.post('/', validate(createCustomerSchema), createCustomer);
router.get('/:id', getCustomerById);

export default router;

// Made with Bob
