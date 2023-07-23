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

async function findRoomWithBookingsById(id: number) {
  return prisma.room.findUnique({
    where: {
      id,
    },
    include: {
      Booking: true,
    },
  });
}

const hotelsRepository = {
  findAllHotels,
  findRoomsFromHotelId,
  findRoomWithBookingsById,
};

export default hotelsRepository;
