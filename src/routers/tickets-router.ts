import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getAllTicketTypes, getUserTicket, postNewTicket } from '@/controllers';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .get('/types', authenticateToken, getAllTicketTypes)
  .get('/', authenticateToken, getUserTicket)
  .post('/', authenticateToken, validateBody(createTicketSchema), postNewTicket);

export { ticketsRouter };
