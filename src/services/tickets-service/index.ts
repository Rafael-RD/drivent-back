import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getAllTicketsTypesService() {
    const types = await ticketsRepository.findAllTicketsTypes();
    return types;
}

async function getUserTicketService(userId: number) {
    const userTicket = await ticketsRepository.findUserTicket(userId);
    if (!userTicket) throw notFoundError();
    return userTicket;
}

async function postNewTicketService(body: CreateTicket, userId: number) {
    const userEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!userEnrollment) throw notFoundError();
    const createLog = await ticketsRepository.createTicket(body, userEnrollment.id);
    return createLog;
}

export type CreateTicket = {
    ticketTypeId: number;
}

const ticketsService = {
    getAllTicketsTypesService,
    getUserTicketService,
    postNewTicketService
}

export default ticketsService;