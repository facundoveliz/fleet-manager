import express from 'express'
import {
  getAllEmployees,
  getEmployee,
  registerEmployee,
  loginEmployee,
  deleteEmployee
} from '../controllers/employee'

const router = express.Router()

router.get('/', getAllEmployees)
router.get('/:id', getEmployee)
router.post('/register', registerEmployee)
router.post('/login', loginEmployee)
router.delete('/:id', deleteEmployee)

export default router
