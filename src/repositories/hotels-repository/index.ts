import { prisma } from '@/config';

async function findAllHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsFromHotelId(id: number) {
  return prisma.hotel.findUnique({
    include: {
      Rooms: true,
    },
    where: {
      id,
    },
  });
}

const hotelsRepository = {
  findAllHotels,
  findRoomsFromHotelId,
};

export default hotelsRepository;
