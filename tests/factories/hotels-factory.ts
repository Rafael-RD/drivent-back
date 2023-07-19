import { prisma } from "@/config";
import faker from "@faker-js/faker";

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