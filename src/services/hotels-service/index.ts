import { TicketStatus } from '@prisma/client';
import { paymentRequired } from '@/errors';
import ticketsService from '../tickets-service';
import hotelsRepository from '@/repositories/hotels-repository';

async function getAllHotels(userId: number) {
  await checkUserHasAccommodation(userId);
  const hotels = await hotelsRepository.findAllHotels();
  return hotels;
}

async function checkUserHasAccommodation(userId: number) {
  const ticket = await ticketsService.getUserTicket(userId);
  if (ticket.TicketType.isRemote === true) throw paymentRequired();
  if (ticket.TicketType.includesHotel === false) throw paymentRequired();
  if (ticket.status !== TicketStatus.PAID) throw paymentRequired();
}

async function getRoomsFromHoteId(hotelId: number, userId: number) {
  checkUserHasAccommodation(userId);
  const rooms = await hotelsRepository.findRoomsFromHotelId(hotelId);
  return rooms;
}

const hotelsService = {
  getAllHotels,
  getRoomsFromHoteId,
};

export default hotelsService;
