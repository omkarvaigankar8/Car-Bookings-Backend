import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';
import { BookingRequest } from '@/types';
import moment from 'moment';

const prisma = new PrismaClient();
export const createBooking = async (req: Request<BookingRequest>, res: Response): Promise<void> => {
    const { vehicleId, userFirstName, userLastName, startDate, endDate } = req.body;
    try {
        if (!vehicleId || !userFirstName || !userLastName || !startDate || !endDate) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId },
        });
        const overlappingBookings = await prisma.booking.findFirst({
            where: {
                vehicleId: vehicleId,
                OR: [
                    {
                        startDate: {
                            lte: new Date(endDate),
                        },
                        endDate: {
                            gte: new Date(startDate),
                        },
                    },
                    {
                        startDate: {
                            gte: new Date(startDate),
                        },
                        endDate: {
                            lte: new Date(endDate),
                        },
                    },
                ],
            },
        });
        // console.log("overlapping Bookings", overlappingBookings)
        if (overlappingBookings) {
            const bookingStart = new Date(overlappingBookings.startDate);
            const bookingEnd = new Date(overlappingBookings.endDate);
            bookingStart.setHours(0, 0, 0, 0);
            bookingEnd.setHours(0, 0, 0, 0);

            const formattedStart = moment(bookingStart).format('YYYY-MM-DD');
            const formattedEnd = moment(bookingEnd).format('YYYY-MM-DD');

            if (formattedStart === formattedEnd) {
                res.status(400).json({ error: `This vehicle is already booked for ${formattedStart}` });
            } else {
                res.status(400).json({ error: `This vehicle is already booked from ${formattedStart} to ${formattedEnd}` });
            }
            return;
        }
        // const booking = await prisma.booking.create({
        //     data: {
        //         userFirstName,
        //         userLastName,
        //         startDate: new Date(startDate),
        //         endDate: new Date(endDate),
        //         vehicleId: vehicleId,
        //     },
        // });
        const [booking] = await prisma.$transaction([
            prisma.booking.create({
                data: {
                    userFirstName,
                    userLastName,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    vehicleId: vehicleId,
                },
            }),
            prisma.vehicle.update({
                where: { id: vehicleId },
                data: {
                    isAvailable: false, // Mark the vehicle as unavailable
                },
            }),
        ]);


        res.status(201).json({ booking });
    }
    catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';
        const sortBy = (req.query.sortBy as string) || 'createdAt';
        const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc';

        const skip = (page - 1) * limit;

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                where: {
                    OR: [
                        { userFirstName: { contains: search, mode: 'insensitive' } },
                        { userLastName: { contains: search, mode: 'insensitive' } },
                        { vehicle: { model: { contains: search, mode: 'insensitive' } } },
                    ],
                },
                include: {
                    vehicle: {
                        include: { vehicleType: true },
                    },
                },
            }),
            prisma.booking.count({
                where: {
                    OR: [
                        { userFirstName: { contains: search, mode: 'insensitive' } },
                        { userLastName: { contains: search, mode: 'insensitive' } },
                        { vehicle: { model: { contains: search, mode: 'insensitive' } } },
                    ],
                },
            }),
        ]);

        res.status(200).json({ bookings, total });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
