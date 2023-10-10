import express from 'express'
import {
  getAllVehicles,
  getVehicle,
  createVehicle,
  deleteVehicle
} from '../controllers/vehicle'

const router = express.Router()

router.get('/', getAllVehicles)
router.get('/:id', getVehicle)
router.post('/new', createVehicle)
router.delete('/:id', deleteVehicle)

export default router
