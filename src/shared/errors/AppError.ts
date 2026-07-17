export class AppError extends Error {
  readonly statusCode: number;
  readonly errors?: Record<string, string[]>;
  readonly isOperational = true;

  constructor(
    message: string,
    statusCode = 500,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
