import { createBooking, getBookings } from '@/controllers/bookingController';
import { Router } from 'express';
const bookingsRouter = Router();

bookingsRouter.post('/create', createBooking)
bookingsRouter.get('/', getBookings)
export default bookingsRouter;