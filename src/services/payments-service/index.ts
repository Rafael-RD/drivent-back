import ticketsService from '../tickets-service';
import enrollmentsService from '../enrollments-service';
import paymentsRepository from '@/repositories/payments-repository';
import { notFoundError, unauthorizedError } from '@/errors';

async function getPaymentById(ticketId: number, userId: number) {
  const ticket = await ticketsService.getTicketById(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentsService.getEnrollmentById(ticket.enrollmentId);
  if (enrollment.userId !== userId) throw unauthorizedError();

  const payment = await paymentsRepository.getPaymentByTicketId(ticketId);
  if (!payment) throw notFoundError();

  return payment;
}

async function postCreatePayment(body: CreatePaymentReqBody, userId: number) {
  const { ticketId, cardData } = body;
  const { issuer, number } = cardData;

  const ticket = await ticketsService.getTicketById(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentsService.getEnrollmentById(ticket.enrollmentId);
  if (enrollment.userId !== userId) throw unauthorizedError();

  const ticketType = await ticketsService.getTicketTypeById(ticket.ticketTypeId);

  const data: CreatePaymentRepo = {
    ticketId,
    value: ticketType.price,
    cardIssuer: issuer,
    cardLastDigits: number.toString().slice(-4),
  };

  const creationLog = await paymentsRepository.createPayment(data);

  await ticketsService.updatePayTicket(ticketId);

  return creationLog;
}

export type GetPaymentQuery = {
  ticketId: string;
};

export type CreatePaymentReqBody = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

export type CreatePaymentRepo = {
  ticketId: number;
  value: number;
  cardIssuer: string;
  cardLastDigits: string;
};

const paymentsService = {
  getPaymentById,
  postCreatePayment,
};

export default paymentsService;
