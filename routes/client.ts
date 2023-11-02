import express from 'express'
import {
  getAllClients,
  getClient,
  registerClient,
  deleteClient
} from '../controllers/client'

const router = express.Router()

router.get('/', getAllClients)
router.get('/:id', getClient)
router.post('/register', registerClient)
router.delete('/:id', deleteClient)

export default router
