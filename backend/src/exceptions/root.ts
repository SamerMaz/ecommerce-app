// HttpException.ts
export class HttpException extends Error {
  errorCode: ErrorCode;
  statusCode: number;
  errors: unknown;

  constructor(message: string, errorCode: ErrorCode, statusCode: number, errors: unknown) {
    super(message); // Sets the 'message' property of Error
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Centralized error codes
export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  ADDRESS_NOT_FOUND = 1004,
  UNPROCESSABLE_ENTITY = 2001,
  INTERNAL_EXCEPTION = 3001,
  UNAUTHORIZED_EXCEPTION = 4001,
  INVALID_REFRESH_TOKEN = 5001,
  REFRESH_TOKEN_MISSING = 5002,
  PRODUCT_NOT_FOUND = 6001,
  PRODUCT_ALREADY_EXIST = 6002,
}
