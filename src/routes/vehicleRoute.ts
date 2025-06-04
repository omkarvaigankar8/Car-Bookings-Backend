import { Router } from 'express';
import { getAllVehicles, getAllVehicleTypes } from '@/controllers/vehicleController';
const vehicleRouter = Router();
vehicleRouter.get('/', getAllVehicles);
vehicleRouter.get('/types', getAllVehicleTypes);
export default vehicleRouter;  