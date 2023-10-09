import express from 'express'
import {
  getAllEmployees,
  getEmployee,
  registerEmployee,
  loginEmployee
} from '../controllers/employee'

const router = express.Router()

router.get('/', getAllEmployees)
router.get('/:id', getEmployee)
router.post('/register', registerEmployee)
router.post('/login', loginEmployee)

export default router
