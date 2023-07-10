import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService, { CreateTicket } from '@/services/tickets-service';

export async function getAllTicketTypes(req: AuthenticatedRequest, res: Response) {
  return res.send(await ticketsService.getAllTicketsTypesService());
}

export async function getUserTicket(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  return res.send(await ticketsService.getUserTicketService(userId));
}

export async function postNewTicket(req: AuthenticatedRequest, res: Response) {
  const body = req.body as CreateTicket;
  const userId = req.userId;

  return res.status(201).send(await ticketsService.postNewTicketService(body, userId));
}
