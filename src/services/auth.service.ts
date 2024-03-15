import {
  CreateUserDto,
  ILoginResponse,
  IMailOptions,
  ISocialLogin,
  JobTypeEnum,
  LoginDto,
  PasswordResetDto,
  QueuesEnum,
  UpdateProfileDto,
  UserSettingDto,
} from "../interfaces";
import { IJwtToken, TokenType, UserType } from "../interfaces/IJwtToken";
import { UserSetting } from "../models";
import { userRepository } from "../repositories";
import {
  ACCONT_NOT_VERIFIED,
  ACCOUNT_CREATED,
  ACCOUNT_NOT_FOUND,
  ACCOUNT_VERIFIED,
  BadRequestError,
  EMAIL_VERIFICATION_BODY,
  EMAIL_VERIFICATION_TITLE,
  ENTITY_SHOULD_BE_UBNIQUE,
  FORGOT_PASSWORD_NOT_ALLOWED_FOR_SOCIAL_LOGIN,
  ForbiddenError,
  INVALID_CREDENTIALS,
  INVALID_TOKEN,
  PASSWORD_FORGOT_EMAIL_BODY,
  PASSWORD_FORGOT_EMAIL_TITLE,
  PASSWORD_RESET_EMAIL_SENT,
  UPDATED_SUCCESSFULLY,
  UnauthorizedError,
  comparePasswords,
  config,
  extractSocialMediaPlatform,
  generateJWT,
  hashPassword,
  sendMail,
  verifyFirebaseSocialLogin,
  verifyJWT,
} from "../utils";
import QueueService from "./queue.service";

class AuthService {
  generateTokenForLogin(userId: number): ILoginResponse {
    const accessTokenPayload: IJwtToken = {
      id: userId,
      user_type: UserType.USER,
      token_type: TokenType.ACCESS,
    };

    const refreshTokenPayload: IJwtToken = {
      id: userId,
      user_type: UserType.USER,
      token_type: TokenType.REFRESH,
    };

    const response: ILoginResponse = {
      accessToken: generateJWT(
        accessTokenPayload,
        config.jwt.accessTokenExpiry
      ),
      refreshToken: generateJWT(
        refreshTokenPayload,
        config.jwt.refreshTokenExpiry
      ),
    };
    return response;
  }

  async signup(dto: CreateUserDto): Promise<string> {
    const isEmailUnique = await userRepository.countByEmail(dto.email);
    if (isEmailUnique > 0) {
      throw new BadRequestError(ENTITY_SHOULD_BE_UBNIQUE("Email"));
    }

    dto.password = await hashPassword(dto.password);

    const user = await userRepository.create(
      { ...dto, user_setting: {} },
      {
        include: [
          {
            model: UserSetting,
          },
        ],
      }
    );
    const payload: IJwtToken = {
      id: user.id,
      token_type: TokenType.EMAIL_VERIFICATION,
      user_type: UserType.USER,
    };

    const token: string = generateJWT(payload);
    const mailOptions: IMailOptions = {
      to: user.email,
      subject: EMAIL_VERIFICATION_TITLE,
      html: EMAIL_VERIFICATION_BODY(token),
    };

    const instance = new QueueService();
    const queue = instance.getQueue(QueuesEnum.DEFAULT);
    queue.add(JobTypeEnum.SEND_EMAIL, { ...mailOptions, userId: user.id });

    return ACCOUNT_CREATED;
  }

  async accountVerification(token: string): Promise<string> {
    const decoded = verifyJWT(token);
    if (
      decoded.user_type !== UserType.USER ||
      decoded.token_type !== TokenType.EMAIL_VERIFICATION
    ) {
      throw new ForbiddenError(INVALID_TOKEN);
    }

    await userRepository.update(
      { id: decoded.id },
      { email_verified_at: new Date() }
    );
    return ACCOUNT_VERIFIED;
  }

  async signin(dto: LoginDto): Promise<ILoginResponse> {
    const user = await userRepository.findByEmailUnscoped(dto.email);
    if (!user || user.social_media_token) {
      throw new UnauthorizedError(INVALID_CREDENTIALS);
    }

    const isValidPassword = await comparePasswords(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError(INVALID_CREDENTIALS);
    }

    if (!user.email_verified_at) {
      throw new BadRequestError(ACCONT_NOT_VERIFIED);
    }

    const response = this.generateTokenForLogin(user.id);
    return response;
  }

  async generateAccessToken(refreshToken: string): Promise<string> {
    const decoded = verifyJWT(refreshToken);
    if (
      decoded.user_type !== UserType.USER ||
      decoded.token_type !== TokenType.REFRESH
    ) {
      throw new ForbiddenError(INVALID_TOKEN);
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError(INVALID_CREDENTIALS);
    }

    const accessTokenPayload: IJwtToken = {
      id: decoded.id,
      user_type: UserType.USER,
      token_type: TokenType.ACCESS,
    };
    const accessToken = generateJWT(
      accessTokenPayload,
      config.jwt.accessTokenExpiry
    );
    return accessToken;
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await userRepository.findByEmailUnscoped(email);
    if (!user) {
      throw new BadRequestError(ACCOUNT_NOT_FOUND);
    }
    if (!user.email_verified_at) {
      throw new BadRequestError(ACCONT_NOT_VERIFIED);
    }

    if (user.social_media_token) {
      throw new BadRequestError(FORGOT_PASSWORD_NOT_ALLOWED_FOR_SOCIAL_LOGIN);
    }

    const payload: IJwtToken = {
      id: user.id,
      token_type: TokenType.PASSWORD_RESET,
      user_type: UserType.USER,
    };
    const token: string = generateJWT(payload, config.jwt.accessTokenExpiry);

    const mailOptions: IMailOptions = {
      to: user.email,
      subject: PASSWORD_FORGOT_EMAIL_TITLE,
      html: PASSWORD_FORGOT_EMAIL_BODY(token),
    };

    const instance = new QueueService();
    const queue = instance.getQueue(QueuesEnum.DEFAULT);
    queue.add(JobTypeEnum.SEND_EMAIL, { ...mailOptions, userId: user.id });

    return PASSWORD_RESET_EMAIL_SENT;
  }

  async resetPassword(dto: PasswordResetDto): Promise<string> {
    const decoded = verifyJWT(dto.token);
    if (
      decoded.user_type !== UserType.USER ||
      decoded.token_type !== TokenType.PASSWORD_RESET
    ) {
      throw new ForbiddenError(INVALID_TOKEN);
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError(INVALID_CREDENTIALS);
    }

    let password = await hashPassword(dto.password);
    await userRepository.update({ id: user.id }, { password });
    return UPDATED_SUCCESSFULLY("Password");
  }

  async socialLogin(idToken: string): Promise<ILoginResponse> {
    const decoded = await verifyFirebaseSocialLogin(idToken);
    const socialLoginDto: ISocialLogin = {
      email: decoded.email,
      social_media_token: decoded.uid,
      social_media_paltform: extractSocialMediaPlatform(
        decoded.firebase.sign_in_provider
      ),
    };

    const user = await userRepository.socialLogin(socialLoginDto);
    const response = this.generateTokenForLogin(user.id);
    return response;
  }

  async getUserSetting(userId: number): Promise<UserSetting | null> {
    return userRepository.getUserSetting(userId);
  }

  async updateUserSetting(
    userId: number,
    dto: UserSettingDto
  ): Promise<string> {
    await userRepository.updateUserSetting(userId, dto);
    return UPDATED_SUCCESSFULLY("User Setting");
  }

  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<string> {
    await userRepository.update(
      {
        id: userId,
      },
      {
        ...dto,
      }
    );
    return UPDATED_SUCCESSFULLY("Profile");
  }
}

export default new AuthService();
