import express from 'express'
import { getAllEmployees } from '../controllers/employee'

const router = express.Router()

router.get('/', getAllEmployees)

export default router
