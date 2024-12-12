import { HttpException } from './root';

export class InternalException extends HttpException {
  constructor(message: string, errors: unknown, errorCode: number) {
    super(message, errorCode, 500, errors);
  }
}
