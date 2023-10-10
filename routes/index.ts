import { Router } from 'express'

import employeeRoutes from './employee'
import vehicleRoutes from './vehicle'

const router: Router = Router()

router.use('/api/employees', employeeRoutes)
router.use('/api/vehicles', vehicleRoutes)

export default router
