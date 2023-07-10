import { Router } from 'express';
import { authenticateToken, validateBody, validateQuery } from '@/middlewares';
import { createPaymentSchema, getPaymentSchema } from '@/schemas';
import { getPaymentById, postCreatePayment } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter
  .get('/', authenticateToken, validateQuery(getPaymentSchema), getPaymentById)
  .post('/process', authenticateToken, validateBody(createPaymentSchema), postCreatePayment);

export { paymentsRouter };
