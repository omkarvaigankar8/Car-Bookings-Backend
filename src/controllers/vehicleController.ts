import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getAllVehicles = async (req: Request, res: Response): Promise<void> => {
    try {


        const vehicles = await prisma.vehicle.findMany({
        });

        res.status(200).json({ vehicles });
    }
    catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getAllVehicleTypes = async (req: Request, res: Response): Promise<void> => {
    try {
        const vehicleTypes = await prisma.vehicleType.findMany({
            include: {
                vehicles: true,
            },
        });

        res.status(200).json({ vehicleTypes });
    } catch (error) {
        console.error('Error fetching vehicle types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}   