import { Router } from "express";
import { authenticateToken } from "../middlewares";
import { getAllTicketTypes, getUserTicket } from "../controllers";

const ticketsRouter = Router();

ticketsRouter
    .get('/types', authenticateToken, getAllTicketTypes)
    .get('/', authenticateToken, getUserTicket)

export { ticketsRouter };