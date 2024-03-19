import { Router } from 'express';

import driverRoutes from './driver';
import vehicleRoutes from './vehicle';
import clientRoutes from './client';
import orderRoutes from './order';

const router: Router = Router();

router.use('/api/drivers', driverRoutes);
router.use('/api/vehicles', vehicleRoutes);
router.use('/api/deliveries', orderRoutes);
router.use('/api/clients', clientRoutes);
router.use('/api/orders', orderRoutes);

export default router;
