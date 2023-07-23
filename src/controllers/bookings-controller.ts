import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService, { BookingReqBody } from '@/services/bookings-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  const booking = await bookingService.getBooking(userId);

  res.send(booking);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const body = req.body as BookingReqBody;

  const createdBooking = await bookingService.postBooking(userId, body);

  res.send({ bookingId: createdBooking.id });
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const body = req.body as BookingReqBody;

  const updatedbooking = await bookingService.putBooking(userId, body);

  res.send({ bookingId: updatedbooking.id });
}
