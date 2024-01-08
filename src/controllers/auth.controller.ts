import { Request, Response } from "express";
import { CreateUserDto, LoginDto } from "../interfaces";
import { plainToClass } from "class-transformer";
import { authService } from "../services";
import { sendSuccessResponse } from "../utils";
import { ILoginResponse } from "../interfaces/ILoginResponse";

class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    const userDto: CreateUserDto = plainToClass(CreateUserDto, req.body);
    const message: string = await authService.signup(userDto);
    return sendSuccessResponse(res, 201, { message });
  }

  async accountVerification(req: Request, res: Response): Promise<void> {
    const { token } = req.body;
    const message = await authService.accountVerification(token);
    return sendSuccessResponse(res, 200, { message });
  }

  async signin(req: Request, res: Response): Promise<void> {
    const dto: LoginDto = plainToClass(LoginDto, req.body);
    const data: ILoginResponse = await authService.signin(dto);
    return sendSuccessResponse(res, 200, data);
  }

  async generateAccessToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const accessToken = await authService.generateAccessToken(refreshToken);
    return sendSuccessResponse(res, 200, { accessToken });
  }
}

export default new AuthController();
