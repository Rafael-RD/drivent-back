import { prisma } from "@/config";
import { CreateTicket } from "@/services";

async function findAllTicketsTypes() {
    return prisma.ticketType.findMany();
}

async function findUserTicket(userId: number) {
    return prisma.ticket.findFirst({
        where: {
            Enrollment: {
                userId
            }
        },
        include: {
            TicketType: true
        }
    })
}

async function createTicket({ ticketTypeId }: CreateTicket, enrollmentId: number) {
    return prisma.ticket.create({
        data: {
            status: "RESERVED",
            ticketTypeId,
            enrollmentId
        },
        include:{
            TicketType: true
        }
    })
}

const ticketsRepository = {
    findAllTicketsTypes,
    findUserTicket,
    createTicket
}

export default ticketsRepository;