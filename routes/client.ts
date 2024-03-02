import express from 'express'
import {
  getAllClients,
  getClient,
  registerClient,
  deleteClient
} from '../controllers/client'
import { tryCatch } from '../utils/tryCatch'

const router = express.Router()

router.get('/', tryCatch(getAllClients))
router.get('/:id', tryCatch(getClient))
router.post('/register', tryCatch(registerClient))
router.delete('/:id', tryCatch(deleteClient))

export default router
