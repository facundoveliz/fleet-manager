import express from 'express'
import {
  getAllEmployees,
  getEmployee,
  registerEmployee,
  loginEmployee,
  deleteEmployee
} from '../controllers/employee'
import { tryCatch } from '../utils/tryCatch'

const router = express.Router()

router.get('/', tryCatch(getAllEmployees))
router.get('/:id', tryCatch(getEmployee))
router.post('/register', tryCatch(registerEmployee))
router.post('/login', tryCatch(loginEmployee))
router.delete('/:id', tryCatch(deleteEmployee))

export default router
