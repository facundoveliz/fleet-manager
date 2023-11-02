import { Router } from 'express'

import employeeRoutes from './employee'
import vehicleRoutes from './vehicle'
import deliveryRoutes from './delivery'
import clientRoutes from './client'

const router: Router = Router()

router.use('/api/employees', employeeRoutes)
router.use('/api/vehicles', vehicleRoutes)
router.use('/api/deliveries', deliveryRoutes)
router.use('/api/clients', clientRoutes)

export default router
