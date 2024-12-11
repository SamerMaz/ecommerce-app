/* eslint-disable prettier/prettier */
import { Response, Request, NextFunction } from 'express';
import prismaClient from '../config/prisma';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { BadRequestsException } from '../exceptions/bad-requests';
import { ErrorCode } from '../exceptions/root';
import { UnprocessableEntity } from '../exceptions/validation';
import { SignUpSchema } from '../schema/users';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    SignUpSchema.parse(req.body);
    const { email, password, name } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      next(
        new BadRequestsException(
          'User already exists!',
          ErrorCode.USER_ALREADY_EXISTS
        )
      );
    }

    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });

    res.json(user);
  } catch (error) {
    next(new UnprocessableEntity(error, 'Unprocessable entity', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw Error('user does not exists');
  }

  //compared hashed passpwrd frot the input and the one in the database
  if (!compareSync(password, user.password)) {
    throw Error('Incorrect Password');
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    config.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.json({ user, token });
};
