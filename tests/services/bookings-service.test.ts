import { forbiddenError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/bookings-repository";
import { Booking, Room, Ticket, TicketStatus, TicketType } from "@prisma/client";
import bookingService from "@/services/bookings-service";
import ticketsService from "@/services/tickets-service";
import hotelsRepository from "@/repositories/hotels-repository";

beforeEach(() => {
    jest.clearAllMocks();
});

const ticket = {
    id: 1,
    status: TicketStatus.PAID,
    enrollmentId: 2,
    ticketTypeId: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: {
        id: 3,
        name: 'name',
        price: 300,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
} as Ticket & { TicketType: TicketType };

const roomWithBooking = {
    id: 1,
    name: 'name',
    hotelId: 1,
    capacity: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    Booking: [{
        id: 2,
        roomId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    }]
} as Room & { Booking: Booking[] };

const booking = {
    id: 1,
    userId: 1,
    roomId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
} as Booking

describe('getBooking tests', () => {
    it('should return notFoundError when user doesnt have a booking', async () => {

        jest.spyOn(bookingRepository, "findBookingWithRoomByUserId").mockResolvedValueOnce(null);

        const promisse = bookingService.getBooking(1);

        expect(promisse).rejects.toEqual(notFoundError());
    });

    it('should return specific booking', async () => {
        const mockBooking = {
            ...booking,
            Room: {
                id: 2,
                capacity: 2,
                name: 'nome',
                hotelId: 4,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        } as Booking & { Room: Room }

        jest.spyOn(bookingRepository, "findBookingWithRoomByUserId").mockResolvedValueOnce(mockBooking);

        const promisse = bookingService.getBooking(1);

        expect(promisse).resolves.toEqual({
            id: mockBooking.id,
            Room: mockBooking.Room
        });
    });
});

describe('postBooking tests', () => {
    it('should return booking', () => {
        const mockTicket = { ...ticket } as Ticket & { TicketType: TicketType };
        const mockRoom = { ...roomWithBooking } as Room & { Booking: Booking[] };
        const mockBooking = {
            ...booking,
            roomId: mockRoom.id
        } as Booking

        jest.spyOn(ticketsService, 'getUserTicket').mockResolvedValueOnce(mockTicket);
        jest.spyOn(hotelsRepository, 'findRoomWithBookingsById').mockResolvedValueOnce(mockRoom);
        jest.spyOn(bookingRepository, 'createBooking').mockResolvedValueOnce(mockBooking);

        const test = bookingService.postBooking(1, { roomId: 1 });

        expect(test).resolves.toEqual(mockBooking);
    });

    describe('userTicket conditions test', () => {
        it('should return forbiddenError when ticket is not paid', () => {
            const mockTicket = {
                ...ticket,
                status: TicketStatus.RESERVED
            } as Ticket & { TicketType: TicketType };

            jest.spyOn(ticketsService, 'getUserTicket').mockResolvedValueOnce(mockTicket);

            const test = bookingService.postBooking(1, { roomId: 2 });

            expect(test).rejects.toEqual(forbiddenError());
        });

        it('should return forbiddenError when ticket is remote', () => {
            const mockTicket = {
                ...ticket,
                TicketType: {
                    isRemote: true,
                }
            } as Ticket & { TicketType: TicketType };

            jest.spyOn(ticketsService, 'getUserTicket').mockResolvedValueOnce(mockTicket);

            const test = bookingService.postBooking(1, { roomId: 2 });

            expect(test).rejects.toEqual(forbiddenError());
        });

        it('should return forbiddenError when ticket doesnt include hotel', () => {
            const mockTicket = {
                ...ticket,
                TicketType: {
                    includesHotel: false,
                }
            } as Ticket & { TicketType: TicketType };

            jest.spyOn(ticketsService, 'getUserTicket').mockResolvedValueOnce(mockTicket);

            const test = bookingService.postBooking(1, { roomId: 2 });

            expect(test).rejects.toEqual(forbiddenError());
        });
    });

    describe('room conditions tests', () => {
        it('should return notFoundError when room doesnt exist', () => {
            const mockTicket = { ...ticket } as Ticket & { TicketType: TicketType };

            jest.spyOn(ticketsService, 'getUserTicket').mockResolvedValueOnce(mockTicket);
            jest.spyOn(hotelsRepository, 'findRoomWithBookingsById').mockResolvedValueOnce(null);

            const test = bookingService.postBooking(1, { roomId: 2 });

            expect(test).rejects.toEqual(notFoundError());
        });

        it('should return forbiddenError when room is full', () => {
            const mockTicket = { ...ticket } as Ticket & { TicketType: TicketType };
            const mockRoom = { ...roomWithBooking, capacity: 1 } as Room & { Booking: Booking[] };

            jest.spyOn(ticketsService, 'getUserTicket').mockResolvedValueOnce(mockTicket);
            jest.spyOn(hotelsRepository, 'findRoomWithBookingsById').mockResolvedValueOnce(mockRoom);

            const test = bookingService.postBooking(1, { roomId: 1 });

            expect(test).rejects.toEqual(forbiddenError());
        });
    });
});

describe('putBooking tests', () => {
    it('should return booking', () => {
        const mockBooking = { ...booking, roomId: 1 } as Booking;
        const mockRoom = { ...roomWithBooking, id: 2 } as Room & { Booking: Booking[] };
        const mockUpdatedBooking = { ...booking, roomId: 2 } as Booking;

        jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValueOnce(mockBooking)
        jest.spyOn(hotelsRepository, 'findRoomWithBookingsById').mockResolvedValueOnce(mockRoom)
        jest.spyOn(bookingRepository, 'updateBookingRoomIdByBookingId').mockResolvedValueOnce(mockUpdatedBooking)

        const test = bookingService.putBooking(1, { roomId: 2 });

        expect(test).resolves.toEqual(mockUpdatedBooking);
    });

    it('should return forbiddenError when user booking not found', () => {
        jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValueOnce(null);

        const test = bookingService.putBooking(1, { roomId: 2 });

        expect(test).rejects.toEqual(forbiddenError());
    });

    describe('room conditions tests', () => {
        it('should return notFoundError when room not found', () => {
            const mockBooking = { ...booking, roomId: 1 } as Booking;
            jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValueOnce(mockBooking)
            jest.spyOn(hotelsRepository, 'findRoomWithBookingsById').mockResolvedValueOnce(null)

            const test = bookingService.putBooking(1, { roomId: 2 });

            expect(test).rejects.toEqual(notFoundError());
        });
        it('should return forbiddenError when room is full', () => {
            const mockBooking = { ...booking, roomId: 1 } as Booking;
            const mockRoom = { ...roomWithBooking, id: 2, capacity: 1 } as Room & { Booking: Booking[] };
            jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValueOnce(mockBooking)
            jest.spyOn(hotelsRepository, 'findRoomWithBookingsById').mockResolvedValueOnce(mockRoom)

            const test = bookingService.putBooking(1, { roomId: 2 });

            expect(test).rejects.toEqual(forbiddenError());
        })
    })
});