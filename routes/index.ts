import { Router } from 'express'

import employeeRoutes from './employee'

const router: Router = Router()

router.use('/api/employees', employeeRoutes)

export default router
