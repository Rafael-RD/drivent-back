import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  const hotels = await hotelsService.getAllHotels(userId);

  return res.send(hotels);
}

export async function getRoomsFromHoteId(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const hotelId = Number(req.params.hotelId);

  const hotelInfo = await hotelsService.getRoomsFromHoteId(hotelId, userId);

  return res.send(hotelInfo);
}
