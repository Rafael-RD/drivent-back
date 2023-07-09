import { prisma } from "@/config";

export async function findAllTicketsTypes() {
    return prisma.ticketType.findMany();
}

export async function findUserTicket(userId: number) {
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