import { prisma } from '@/config';
import { CreatePaymentRepo } from '@/services';

async function getPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createPayment(data: CreatePaymentRepo) {
  return prisma.payment.create({
    data,
  });
}

const paymentsRepository = {
  getPaymentByTicketId,
  createPayment,
};

export default paymentsRepository;
