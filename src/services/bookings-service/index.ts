import bookingRepository from "@/repositories/bookings-repository";
import { forbiddenError, notFoundError, paymentRequired } from "@/errors";
import { Booking, Room, TicketStatus } from "@prisma/client";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketsService from "../tickets-service";

async function getBooking(userId: number) {
    const booking = await bookingRepository.findBookingWithRoomByUserId(userId);
    if (!booking) throw notFoundError();
    return ({
        id: booking.id,
        Room: booking.Room
    } as GetBookingReturn);
}

export type GetBookingReturn = Omit<Booking, 'userId' | 'roomId' | 'createdAt' | 'updatedAt'> & { Room: Room }

async function postBooking(userId: number, body: BookingReqBody) {
    const roomId = body.roomId;

    const userTicket = await ticketsService.getUserTicket(userId);
    if (!userTicket ||
        userTicket.status !== TicketStatus.PAID ||
        userTicket.TicketType.isRemote === true ||
        userTicket.TicketType.includesHotel === false
    ) throw forbiddenError();

    const room = await hotelsRepository.findRoomWithBookingsById(roomId);
    if (!room) throw notFoundError();
    if (room.Booking.length >= room.capacity) throw forbiddenError();

    const booking = await bookingRepository.createBooking(userId, roomId)

    return booking;
}

export type BookingReqBody = { roomId: number }

async function putBooking(userId: number, body: BookingReqBody) {
    const roomId = body.roomId;

    const booking = await bookingRepository.findBookingByUserId(userId);
    if (!booking) throw forbiddenError();

    const room = await hotelsRepository.findRoomWithBookingsById(roomId);
    if (!room) throw notFoundError();
    if (room.Booking.length >= room.capacity) throw forbiddenError();

    const updatedbooking = await bookingRepository.updateBookingRoomIdByBookingId(booking.id, roomId);

    return updatedbooking;
}


const bookingService = {
    getBooking,
    postBooking,
    putBooking,
}
export default bookingService;