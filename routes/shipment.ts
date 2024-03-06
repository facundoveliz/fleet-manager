import express from 'express'
import {
  getAllShipments,
  getShipment,
  createShipment,
  deleteShipment,
} from '../controllers/shipment'
import { tryCatch } from '../utils/tryCatch'

const router = express.Router()

router.get('/', tryCatch(getAllShipments))
router.get('/:id', tryCatch(getShipment))
router.post('/', tryCatch(createShipment))
router.delete('/:id', tryCatch(deleteShipment))

export default router
