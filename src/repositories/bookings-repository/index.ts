import { prisma } from '@/config';

async function findBookingWithRoomByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
  });
}

async function updateBookingRoomIdByBookingId(id: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      roomId,
    },
  });
}

const bookingRepository = {
  findBookingWithRoomByUserId,
  createBooking,
  findBookingByUserId,
  updateBookingRoomIdByBookingId,
};
export default bookingRepository;
