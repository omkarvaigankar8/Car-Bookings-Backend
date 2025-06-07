import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getAllVehicles = async (req: Request, res: Response): Promise<void> => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            where: {
                vehicleTypeId: req.query.vehicleTypeId ? parseInt(req.query.vehicleTypeId as string) : undefined,
                // isAvailable: true
            }
        });

        res.status(200).json({ vehicles });
    }
    catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getAllVehicleTypes = async (req: Request, res: Response): Promise<void> => {
    const { wheels } = req.query;
    try {
        const vehicleTypes = await prisma.vehicleType.findMany({
            where: {
                wheels: wheels ? parseInt(wheels as string) : undefined,
            }
        });

        res.status(200).json({ vehicleTypes });
    } catch (error) {
        console.error('Error fetching vehicle types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const getVehicleWheels = async (req: Request, res: Response): Promise<void> => {
    try {
        const wheels = await prisma.vehicleType.groupBy({
            by: ['wheels'],
        });

        const wheelsList = wheels.map(w => w.wheels); // extract only wheel numbers

        res.status(200).json({ wheels: wheelsList });
    } catch (error) {
        console.error('Error fetching wheels:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};