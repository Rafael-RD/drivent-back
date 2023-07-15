import { prisma } from "../../config";

async function findAllHotels() {
    return await prisma.hotel.findMany();
}



const hotelsRepository = {
    findAllHotels,
}

export default hotelsRepository;