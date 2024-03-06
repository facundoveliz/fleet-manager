import express from 'express'
import {
  getAllVehicles,
  getVehicle,
  createVehicle,
  deleteVehicle,
} from '../controllers/vehicle'
import { tryCatch } from '../utils/tryCatch'

const router = express.Router()

router.get('/', tryCatch(getAllVehicles))
router.get('/:id', tryCatch(getVehicle))
router.post('/create', tryCatch(createVehicle))
router.delete('/:id', tryCatch(deleteVehicle))

export default router
