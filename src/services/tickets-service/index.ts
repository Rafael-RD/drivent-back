import { notFoundError } from "../../errors";
import { findAllTicketsTypes, findUserTicket } from "../../repositories/tickets-repository";

export async function getAllTicketsTypesService() {
    const types = await findAllTicketsTypes();
    return types;
}

export async function getUserTicketService(userId: number) {
    const userTicket = await findUserTicket(userId);
    if (!userTicket) throw notFoundError();
    return userTicket;
}