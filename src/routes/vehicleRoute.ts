import { Router } from 'express';
import { getAllVehicles, getAllVehicleTypes, getVehicleWheels } from '@/controllers/vehicleController';
const vehicleRouter = Router();
vehicleRouter.get('/', getAllVehicles);
vehicleRouter.get('/types', getAllVehicleTypes);
vehicleRouter.get('/wheels', getVehicleWheels);
export default vehicleRouter;  