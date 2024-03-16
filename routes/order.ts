import express from 'express';
import { createOrder, deleteOrder, getAllOrders, getOrder } from '../controllers/order';
import { tryCatch } from '../utils/tryCatch';

const router = express.Router();

router.get('/', tryCatch(getAllOrders));
router.get('/:id', tryCatch(getOrder));
router.post('/new', tryCatch(createOrder));
router.delete('/:id', tryCatch(deleteOrder));

export default router;
