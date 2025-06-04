import { Router } from 'express';
import vehicleRouter from '@routes/vehicleRoute';
import bookingsRouter from './bookingsRoute';

const router = Router();
router.use('/vehicles', vehicleRouter);
router.use('/bookings', bookingsRouter);
export default router;