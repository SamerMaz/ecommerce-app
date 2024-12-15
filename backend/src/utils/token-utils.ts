import { config } from '../config/env';
import { ErrorCode } from '../exceptions/root';
import { UnauthorizedException } from '../exceptions/unauthorized';
import * as jwt from 'jsonwebtoken';

/**
 * Extract the token from the Authorization header and validate its format.
 */
export const extractToken = (authorizationHeader: string | undefined): string => {
  if (!authorizationHeader) {
    throw new UnauthorizedException('Missing Authorization Header', ErrorCode.UNAUTHORIZED_EXCEPTION);
  }

  const parts = authorizationHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedException('Invalid Authorization Header Format', ErrorCode.UNAUTHORIZED_EXCEPTION);
  }

  return parts[1];
};

/**
 * Verify the token and return its payload.
 */
export const verifyToken = (token: string): { userId: string } => {
  try {
    const payload = jwt.verify(token, config.JWT_SECRET_KEY) as { userId: string };
    if (!payload.userId) {
      throw new UnauthorizedException('Invalid token payload', ErrorCode.UNAUTHORIZED_EXCEPTION);
    }
    return payload;
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token', ErrorCode.UNAUTHORIZED_EXCEPTION, error);
  }
};
