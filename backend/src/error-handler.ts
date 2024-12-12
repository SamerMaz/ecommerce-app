import { ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { ErrorCode, HttpException } from './exceptions/root';
import { InternalException } from './exceptions/internal-exception';

export const errorHandler = (
  method: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error) {
      let exception: HttpException;

      // Handle Zod Validation Errors
      if (error instanceof ZodError) {
        const issues = error.issues;
        exception = new HttpException(
          'Validation Error',
          ErrorCode.UNPROCESSABLE_ENTITY,
          422,
          issues
        );
      }
      // Handle Custom HttpException
      else if (error instanceof HttpException) {
        exception = error;
      }
      // Handle Unknown Errors as Internal Exceptions
      else {
        exception = new InternalException(
          'Something went wrong!',
          error,
          ErrorCode.INTERNAL_EXCEPTION
        );
      }

      next(exception);
    }
  };
};
