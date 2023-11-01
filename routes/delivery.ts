import express from 'express'
import {
  createDelivery,
  deleteDelivery,
  getAllDeliveries,
  getDelivery
} from '../controllers/delivery'

const router = express.Router()

router.get('/', getAllDeliveries)
router.get('/:id', getDelivery)
router.post('/new', createDelivery)
router.delete('/:id', deleteDelivery)

export default router
