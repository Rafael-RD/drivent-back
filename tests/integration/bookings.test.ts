import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import {
  createBooking,
  createEnrollmentWithAddress,
  createHotel,
  createHotelRoom,
  createTicket,
  createTicketTypeConfigurable,
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { prisma } from '@/config';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('Should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user doesnt have a booking yet', async () => {
      const token = await generateValidToken();

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 with booking id and room info', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createHotelRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          ...room,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
});

describe('POST /booking', () => {
  it('Should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 when incorrect body', async () => {
      const token = await generateValidToken();

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({
          [faker.lorem.word()]: faker.lorem.word(),
        });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 200 with booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeConfigurable({ hasHotel: true, isRemote: false });
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createHotelRoom(hotel.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(response.status).toBe(httpStatus.OK);
      const booking = await prisma.booking.findUnique({ where: { id: response.body.bookingId } });
      expect(booking).toBeTruthy();
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('Should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/0');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 when incorrect body', async () => {
      const token = await generateValidToken();

      const response = await server
        .put('/booking/0')
        .set('Authorization', `Bearer ${token}`)
        .send({
          [faker.lorem.word()]: faker.lorem.word(),
        });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 200 with booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeConfigurable({ hasHotel: true, isRemote: false });
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel1 = await createHotel();
      const room1 = await createHotelRoom(hotel1.id);
      const bookingOld = await createBooking(user.id, room1.id);
      const hotel2 = await createHotel();
      const room2 = await createHotelRoom(hotel2.id);

      const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`).send({
        roomId: room2.id,
      });

      expect(response.status).toBe(httpStatus.OK);
      const bookingNew = await prisma.booking.findUnique({ where: { id: response.body.bookingId } });
      expect(bookingNew.roomId).toBe(room2.id);
    });
  });
});
