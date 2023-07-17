import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotels, getRoomsFromHoteId } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter
    .all('/*', authenticateToken)
    .get('/', getAllHotels)
    .get('/:hotelId', getRoomsFromHoteId);

export { hotelsRouter };
