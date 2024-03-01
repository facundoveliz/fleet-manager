import express from 'express'
import {
  createDelivery,
  deleteDelivery,
  getAllDeliveries,
  getDelivery
} from '../controllers/delivery'
import { tryCatch } from '../utils/tryCatch'

const router = express.Router()

router.get('/', tryCatch(getAllDeliveries))
router.get('/:id', tryCatch(getDelivery))
router.post('/new', tryCatch(createDelivery))
router.delete('/:id', tryCatch(deleteDelivery))

export default router
