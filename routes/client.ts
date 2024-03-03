import express from 'express'
import {
  getAllClients,
  getClient,
  createClient,
  deleteClient
} from '../controllers/client'
import { tryCatch } from '../utils/tryCatch'

const router = express.Router()

router.get('/', tryCatch(getAllClients))
router.get('/:id', tryCatch(getClient))
router.post('/register', tryCatch(createClient))
router.delete('/:id', tryCatch(deleteClient))

export default router
