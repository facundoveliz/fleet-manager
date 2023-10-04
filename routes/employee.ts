import express from 'express'
import {
  getAllEmployees,
  getEmployee,
  registerEmployee
} from '../controllers/employee'

const router = express.Router()

router.get('/', getAllEmployees)
router.get('/:id', getEmployee)
router.post('/register', registerEmployee)

export default router
