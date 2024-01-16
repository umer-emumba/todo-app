// CustomError.ts
export class CustomError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(400, message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(404, message);
    this.name = "NotFoundError";
  }
}
