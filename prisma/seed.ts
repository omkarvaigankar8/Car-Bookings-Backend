const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // clearing existing data
    await prisma.booking.deleteMany();
    await prisma.user.deleteMany();
    await prisma.vehicleType.deleteMany();

    const hatchback = await prisma.vehicleType.create({
        data: {
            name: 'Hatchback',
            wheels: 4
        },
    });

    const sedan = await prisma.vehicleType.create({
        data: {
            name: 'Sedan',
            wheels: 4
        },
    });
    const suv = await prisma.vehicleType.create({
        data: {
            name: 'SUV',
            wheels: 4
        },
    });
    const cruiser = await prisma.vehicleType.create({
        data: {
            name: 'Cruiser',
            wheels: 2
        },
    });
    const sportsBike = await prisma.vehicleType.create({
        data: {
            name: 'Sports Bike',
            wheels: 2
        },
    });
    // Insert vehicles
    await prisma.vehicle.createMany({
        data: [
            { model: 'Tata Altroz', vehicleTypeId: hatchback.id },
            { model: 'Maruti Suzuki Swift', vehicleTypeId: hatchback.id },
            { model: 'Toyota Glanza', vehicleTypeId: hatchback.id },
            { model: 'Hyundai i20', vehicleTypeId: hatchback.id },
            { model: 'Tata Harrier', vehicleTypeId: suv.id },
            { model: 'Hyundai Creta', vehicleTypeId: suv.id },
            { model: 'Tata Nexon', vehicleTypeId: suv.id },
            { model: 'Maruti Suzuki Brezza', vehicleTypeId: suv.id },
            { model: 'Honda City', vehicleTypeId: sedan.id },
            { model: 'Škoda Slavia', vehicleTypeId: sedan.id },
            { model: 'Tata Tigor', vehicleTypeId: sedan.id },
            { model: 'Royal Enfield Classic 350', vehicleTypeId: cruiser.id },
            { model: 'Harley-Davidson X440', vehicleTypeId: cruiser.id },
            { model: 'Yamaha R15 V4', vehicleTypeId: sportsBike.id },
            { model: 'BMW G310 RR', vehicleTypeId: sportsBike.id },
        ],
    });
    console.log('Database seeded successfully!');
}
main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });