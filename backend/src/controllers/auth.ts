import { Response, Request } from 'express';
import prismaClient from '../config/prisma';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { BadRequestsException } from '../exceptions/bad-requests';
import { ErrorCode } from '../exceptions/root';
import { LoginSchema, SignUpSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/not-found';

export const signup = async (req: Request, res: Response) => {
  SignUpSchema.parse(req.body);
  const { email, password, name } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    throw new BadRequestsException('User already exists!', ErrorCode.USER_ALREADY_EXISTS);
  }

  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
    },
  });

  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  LoginSchema.parse(req.body);
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new NotFoundException('user not found', ErrorCode.USER_NOT_FOUND);
  }

  //compared hashed passpwrd frot the input and the one in the database
  if (!compareSync(password, user.password)) {
    throw new BadRequestsException('Incorrect passowrd', ErrorCode.INCORRECT_PASSWORD);
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    config.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.status(200).json({ user, token });
};

//me

export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};
