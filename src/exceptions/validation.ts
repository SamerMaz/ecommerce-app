import { ZodError } from 'zod';
import { ErrorCode, HttpException } from './root';

export class UnprocessableEntity extends HttpException {
  constructor(error: unknown, message: string, errorCode: ErrorCode) {
    let formattedError = error;

    // Check if the error is a ZodError and extract the issues
    if (error instanceof ZodError) {
      formattedError = error.issues;
    } else if (error instanceof Error) {
      formattedError = error.message;
    }

    super(message, errorCode, 422, formattedError);
  }
}
