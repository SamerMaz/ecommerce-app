import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../exceptions/unauthorized';
import { ErrorCode } from '../exceptions/root';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/env';
import prismaClient from '../config/prisma';
import { User } from '@prisma/client';

declare module 'express' {
  interface Request {
    user?: User | null;
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  //1. extract the token from header
  const token = req.headers.authorization;

  //2. if token is not present, throw an error of unauthorized
  if (!token) {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED_EXCEPTION));
    return;
  }

  try {
    //3. if the token is present, verify that token and extract the payload
    const payload = jwt.verify(token, config.JWT_SECRET_KEY) as { userId: number };

    //4. to get the user from the payload
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED_EXCEPTION));
    }
    //5. to attach the user to the current request object
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED_EXCEPTION, error));
  }
};

export default authMiddleware;
