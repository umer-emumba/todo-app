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
