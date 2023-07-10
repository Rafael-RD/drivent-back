import { Response } from 'express';
import paymentsService, { CreatePaymentReqBody, GetPaymentQuery } from '@/services/payments-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getPaymentById(req: AuthenticatedRequest, res: Response) {
  const query = req.query as GetPaymentQuery;
  const userId = req.userId;
  const ticketId = Number(query.ticketId);

  const response = await paymentsService.getPaymentById(ticketId, userId);

  return res.status(200).send(response);
}

export async function postCreatePayment(req: AuthenticatedRequest, res: Response) {
  const body = req.body as CreatePaymentReqBody;
  const userId = req.userId;

  const creationLog = await paymentsService.postCreatePayment(body, userId);

  return res.status(200).send(creationLog);
}
