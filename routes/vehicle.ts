import express from 'express';
import { getAllVehicles, getVehicle, newVehicle, deleteVehicle } from '../controllers/vehicle';
import { tryCatch } from '../utils/tryCatch';

const router = express.Router();

router.get('/', tryCatch(getAllVehicles));
router.get('/:id', tryCatch(getVehicle));
router.post('/new', tryCatch(newVehicle));
router.delete('/:id', tryCatch(deleteVehicle));

export default router;
