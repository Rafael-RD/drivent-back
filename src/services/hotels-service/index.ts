import { TicketStatus } from "@prisma/client";
import { notFoundError, paymentRequired } from "../../errors";
import ticketsService from "../tickets-service";
import hotelsRepository from "../../repositories/hotels-repository";

async function getAllHotels(userId: number){
    checkUserHasAccommodation(userId);
    const hotels= await hotelsRepository.findAllHotels();
    return hotels;
}

async function checkUserHasAccommodation(userId: number){
    const ticket= await ticketsService.getUserTicket(userId);
    if(ticket.TicketType.includesHotel === false) throw paymentRequired();
    if(ticket.status !== TicketStatus.PAID) throw paymentRequired();
}

const hotelsService={
    getAllHotels,
}

export default hotelsService;