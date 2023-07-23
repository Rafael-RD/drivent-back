import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { createBooking, createUser } from "./";

export async function createHotel() {
    return await prisma.hotel.create({
        data: {
            name: faker.company.companyName(),
            image: faker.image.business(),
        }
    })
}

export async function createHotelRoom(hotelId: number) {
    return await prisma.room.create({
        data: {
            name: `${faker.datatype.number(9)}${faker.datatype.number(29)}`,
            hotelId,
            capacity: faker.datatype.number({ min: 1, max: 5 }),
        }
    })
}

export async function createFullHotelRoom(hotelId: number) {
    const room = await prisma.room.create({
        data: {
            name: `${faker.datatype.number(9)}${faker.datatype.number(29)}`,
            hotelId,
            capacity: 1,
        }
    });

    const user = await createUser();
    const booking = await createBooking(user.id, room.id);

    return room;
}