import { Prisma } from '@prisma/client';

export const isPrismaError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return typeof error === 'object' && error !== null && 'code' in error;
};
