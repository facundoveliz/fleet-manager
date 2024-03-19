import express from 'express';
import { getAllClients, getClient, newClient, deleteClient } from '../controllers/client';
import { tryCatch } from '../utils/tryCatch';

const router = express.Router();

router.get('/', tryCatch(getAllClients));
router.get('/:id', tryCatch(getClient));
router.post('/new', tryCatch(newClient));
router.delete('/:id', tryCatch(deleteClient));

export default router;
