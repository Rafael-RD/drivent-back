import { Response } from "express";
import { getAllTicketsTypesService, getUserTicketService } from "../services";
import { AuthenticatedRequest } from "../middlewares";

export async function getAllTicketTypes(req: AuthenticatedRequest, res: Response) {
    return res.send(await getAllTicketsTypesService());
}

export async function getUserTicket(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    return res.send(await getUserTicketService(userId))
}