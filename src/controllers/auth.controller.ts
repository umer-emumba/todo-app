import { Request, Response } from "express";
import { CreateUserDto } from "../interfaces";
import { plainToClass } from "class-transformer";
import { authService } from "../services";
import { sendSuccessResponse } from "../utils";

class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    const userDto: CreateUserDto = plainToClass(CreateUserDto, req.body);
    const message: string = await authService.signup(userDto);
    return sendSuccessResponse(res, 201, { message });
  }

  async accountVerification(req: Request, res: Response): Promise<void> {
    const { token } = req.body;
    const message = await authService.accountVerification(token);
    return sendSuccessResponse(res, 201, { message });
  }
}

export default new AuthController();
