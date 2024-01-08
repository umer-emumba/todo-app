import { Request } from "express";
import { ISwaggerValidationError } from "../interfaces";
import { BAD_REQUEST_ERROR } from "./constants";
import { BadRequestError } from "./custom.error";

export const handleValidationErrors = (
  req: Request,
  data: any,
  errors: ISwaggerValidationError[]
) => {
  let errorMessage: string = "";

  if (errors && errors.length > 0) {
    errors.forEach((item: ISwaggerValidationError) => {
      errorMessage += `${item.message}, `;
    });
  } else {
    errorMessage = BAD_REQUEST_ERROR;
  }

  throw new BadRequestError(errorMessage);
};
