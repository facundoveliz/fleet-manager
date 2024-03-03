import express from 'express'
import {
  getAllDrivers,
  getDriver,
  registerDriver,
  loginDriver,
  deleteDriver
} from '../controllers/driver'
import { tryCatch } from '../utils/tryCatch'

const router = express.Router()

router.get('/', tryCatch(getAllDrivers))
router.get('/:id', tryCatch(getDriver))
router.post('/register', tryCatch(registerDriver))
router.post('/login', tryCatch(loginDriver))
router.delete('/:id', tryCatch(deleteDriver))

export default router
