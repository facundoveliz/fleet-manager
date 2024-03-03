import { Router } from 'express'

import driverRoutes from './driver'
import vehicleRoutes from './vehicle'
import orderRoutes from './order'
import clientRoutes from './client'

const router: Router = Router()

router.use('/api/drivers', driverRoutes)
router.use('/api/vehicles', vehicleRoutes)
router.use('/api/deliveries', orderRoutes)
router.use('/api/clients', clientRoutes)

export default router
