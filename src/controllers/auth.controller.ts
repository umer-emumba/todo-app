import { Request, Response } from "express";
import {
  CreateUserDto,
  LoginDto,
  PasswordResetDto,
  UserSettingDto,
} from "../interfaces";
import { authService } from "../services";
import { createAndValidateDto, sendSuccessResponse } from "../utils";
import { ILoginResponse } from "../interfaces/ILoginResponse";

class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    const userDto: CreateUserDto = await createAndValidateDto(
      CreateUserDto,
      req.body
    );
    const message: string = await authService.signup(userDto);
    return sendSuccessResponse(res, 201, { message });
  }

  async accountVerification(req: Request, res: Response): Promise<void> {
    const { token } = req.body;
    const message = await authService.accountVerification(token);
    return sendSuccessResponse(res, 200, { message });
  }

  async signin(req: Request, res: Response): Promise<void> {
    const dto: LoginDto = await createAndValidateDto(LoginDto, req.body);
    const data: ILoginResponse = await authService.signin(dto);
    return sendSuccessResponse(res, 200, data);
  }

  async generateAccessToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const accessToken = await authService.generateAccessToken(refreshToken);
    return sendSuccessResponse(res, 200, { accessToken });
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const message = await authService.forgotPassword(email);
    return sendSuccessResponse(res, 200, { message });
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const dto: PasswordResetDto = await createAndValidateDto(
      PasswordResetDto,
      req.body
    );
    const message = await authService.resetPassword(dto);
    return sendSuccessResponse(res, 200, { message });
  }

  async socialLogin(req: Request, res: Response): Promise<void> {
    const { idToken } = req.body;
    const data: ILoginResponse = await authService.socialLogin(idToken);
    return sendSuccessResponse(res, 200, data);
  }

  async getUserSetting(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const setting = await authService.getUserSetting(user.id);
    return sendSuccessResponse(res, 200, setting);
  }

  async updateUserSetting(req: Request, res: Response): Promise<void> {
    const dto: UserSettingDto = await createAndValidateDto(
      UserSettingDto,
      req.body
    );
    const user = req.user;
    const message = await authService.updateUserSetting(user.id, dto);
    return sendSuccessResponse(res, 200, { message });
  }
}

export default new AuthController();
