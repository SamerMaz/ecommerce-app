import { ErrorCode, HttpException } from './root';

export class UnauthorizedException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors?: unknown) {
    super(message, errorCode, 401, errors);
  }
}
