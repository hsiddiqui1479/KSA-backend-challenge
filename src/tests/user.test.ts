import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { userSignup, userSignin } from '../controllers/user.controller';
import { authValidation, validate } from '../middleware/validation.middleware';
import { users } from '../data-storage';

const app = express();
app.use(express.json());

const mockHash: any = jest.spyOn(bcrypt, 'hash');
mockHash.mockResolvedValue('hashedPassword');

const mockSign: any = jest.spyOn(jwt, 'sign');
mockSign.mockReturnValue('fakeToken');

app.post('/api/auth/signup', authValidation, validate, userSignup);
app.post('/api/auth/signin', authValidation, validate, userSignin);

describe('User Signup Route', () => {
  afterEach(() => {
    users.splice(0, users.length);
  });

  it('should create a new user', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app).post('/api/auth/signup').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      username: newUser.username,
      token: 'fakeToken',
    });
  });

  it('should return a 409 status if the user already exists', async () => {
    users.push({
      id: 'existingUserId',
      username: 'testuser',
      password: 'hashedPassword',
    });

    const newUser = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app).post('/api/auth/signup').send(newUser);

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      message: 'User with the same username already exists',
    });
  });

  it('should return a 400 if username is not provided', async () => {
    const newUser = {
      password: 'testpassword',
    };

    const response = await request(app).post('/api/auth/signup').send(newUser);
    expect(response.status).toBe(400);
  });
});

describe('User Signin Route', () => {
  afterEach(() => {
    users.splice(0, users.length);
  });

  it('should sign in a user with valid credentials', async () => {
    const username = 'testuser';
    const password = 'testpassword';

    const mockHash: any = jest.spyOn(bcrypt, 'compare');
    mockHash.mockResolvedValue(true);

    await request(app).post('/api/auth/signup').send({
      username: 'testuser',
      password: 'testpassword',
    });

    const response = await request(app)
      .post('/api/auth/signin')
      .send({ username, password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return a 401 status is username doesnt match', async () => {
    const username = 'invalidUsername';
    const password = 'invalidpassword';

    await request(app).post('/api/auth/signup').send({
      username: 'testuser',
      password: 'testpassword',
    });

    const response = await request(app)
      .post('/api/auth/signin')
      .send({ username, password });

    expect(response.status).toBe(401);
  });
});
