import express from 'express';
import { getAllDrivers, getDriver, newDriver, deleteDriver } from '../controllers/driver';
import { tryCatch } from '../utils/tryCatch';

const router = express.Router();

router.get('/', tryCatch(getAllDrivers));
router.get('/:id', tryCatch(getDriver));
router.post('/new', tryCatch(newDriver));
router.delete('/:id', tryCatch(deleteDriver));

export default router;
