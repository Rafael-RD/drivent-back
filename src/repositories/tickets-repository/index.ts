import { prisma } from '@/config';
import { CreateTicket } from '@/services';
import { TicketStatus } from '@prisma/client';

async function findAllTicketsTypes() {
  return prisma.ticketType.findMany();
}

async function findTicketById(id: number) {
  return prisma.ticket.findUnique({
    where: {
      id,
    },
  });
}

async function findTicketTypeById(id: number) {
  return prisma.ticketType.findUnique({
    where: {
      id,
    },
  });
}

async function updatePayTicket(id: number) {
  return prisma.ticket.update({
    where: {
      id,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
}

async function findUserTicket(userId: number) {
  return prisma.ticket.findFirst({
    where: {
      Enrollment: {
        userId,
      },
    },
    include: {
      TicketType: true,
    },
  });
}

async function createTicket({ ticketTypeId }: CreateTicket, enrollmentId: number) {
  return prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId,
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketsRepository = {
  findAllTicketsTypes,
  findTicketById,
  findTicketTypeById,
  updatePayTicket,
  findUserTicket,
  createTicket,
};

export default ticketsRepository;
