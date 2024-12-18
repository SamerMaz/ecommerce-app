import { Response, Request } from 'express';
import db from '../config/prisma';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { BadRequestsException } from '../exceptions/bad-requests';
import { ErrorCode } from '../exceptions/root';
import { LoginSchema, SignUpSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/not-found';
import { randomBytes } from 'crypto';

export const signup = async (req: Request, res: Response) => {
  SignUpSchema.parse(req.body);
  const { email, password, name } = req.body;

  let user = await db.user.findFirst({ where: { email } });
  if (user) {
    throw new BadRequestsException('User already exists!', ErrorCode.USER_ALREADY_EXISTS);
  }

  user = await db.user.create({
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
  let user = await db.user.findFirst({ where: { email } });
  if (!user) {
    throw new NotFoundException('user not found', ErrorCode.USER_NOT_FOUND);
  }

  //compared hashed passpwrd frot the input and the one in the database
  if (!compareSync(password, user.password)) {
    throw new BadRequestsException('Incorrect passowrd', ErrorCode.INCORRECT_PASSWORD);
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    config.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );

  const rawRefreshToken = randomBytes(32).toString('hex'); // Create a random token
  const hashedRefreshToken = hashSync(rawRefreshToken, 10); // Hash the token before storing

  // Store the hashed refresh token in the database
  await db.refreshToken.create({
    data: {
      hashedToken: hashedRefreshToken,
      userId: user.id,
      expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration to 7 days
    },
  });

  res.cookie('refreshToken', rawRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  });

  // Send tokens to the client
  res.status(200).json({
    user,
    token: `${accessToken}`,
  });

  // res.status(200).json({ user, token: `Bearer ${accessToken}` });
};

//refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new BadRequestsException('Refresh token is required', ErrorCode.REFRESH_TOKEN_MISSING);
  }

  // // Find the refresh token in the database
  // const storedToken = await db.refreshToken.findFirst({
  //   where: {
  //     hashedToken: refreshToken, // Match hashed token
  //     revoked: false,
  //     expireAt: { gt: new Date() }, // Token must not be expired
  //   },
  // });

  const storedTokens = await db.refreshToken.findMany({
    where: {
      revoked: false,
      expireAt: { gt: new Date() },
    },
  });

  //Compare the provided refreshToken with the stored hashed tokens
  const validToken = storedTokens.find((storedToken) => compareSync(refreshToken, storedToken.hashedToken));

  if (!validToken) {
    throw new BadRequestsException('Invalid or expired refresh token', ErrorCode.INVALID_REFRESH_TOKEN);
  }

  // Generate a new access token
  const newAccessToken = jwt.sign({ userId: validToken.userId }, config.JWT_SECRET_KEY, { expiresIn: '1h' });

  res.status(200).json({ token: `${newAccessToken}` });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new BadRequestsException('Refresh token is missing', ErrorCode.REFRESH_TOKEN_MISSING);
  }

  // Revoke the refresh token
  await db.refreshToken.updateMany({
    where: { hashedToken: refreshToken },
    data: { revoked: true },
  });

  // clear the cookie
  res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

  res.status(200).json({ message: 'Logged out successfully' });
};

//me
export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};
