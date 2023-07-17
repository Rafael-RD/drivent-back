import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import { badRequestError } from '@/errors';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  const hotels = await hotelsService.getAllHotels(userId);

  return res.send(hotels);
}

export async function getRoomsFromHoteId(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const hotelId = Number(req.params.hotelId);

  if (hotelId < 0 || isNaN(hotelId)) throw badRequestError('hotelId is invalid');

  const rooms = await hotelsService.getRoomsFromHoteId(hotelId, userId);

  return res.send(rooms);
}
