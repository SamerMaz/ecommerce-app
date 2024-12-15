import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../exceptions/unauthorized';
import { ErrorCode } from '../exceptions/root';

import prismaClient from '../config/prisma';
import { User } from '@prisma/client';
import { extractToken, verifyToken } from '../utils/token-utils';

declare module 'express' {
  interface Request {
    user?: User | null;
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract and verify the token
    const token = extractToken(req.headers.authorization);
    const payload = verifyToken(token);

    // get the user from the payload
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED_EXCEPTION));
    }
    //5. attach the user to the current request object
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED_EXCEPTION, error));
  }
};

export default authMiddleware;
