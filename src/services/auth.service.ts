import {
  CreateUserDto,
  ILoginResponse,
  IMailOptions,
  LoginDto,
} from "../interfaces";
import { IJwtToken, TokenType, UserType } from "../interfaces/IJwtToken";
import { userRepository } from "../repositories";
import {
  ACCONT_NOT_VERIFIED,
  ACCOUNT_CREATED,
  ACCOUNT_VERIFIED,
  BadRequestError,
  EMAIL_VERIFICATION_BODY,
  EMAIL_VERIFICATION_TITLE,
  ForbiddenError,
  INVALID_CREDENTIALS,
  INVALID_TOKEN,
  UnauthorizedError,
  comparePasswords,
  config,
  generateJWT,
  hashPassword,
  sendMail,
  verifyJWT,
} from "../utils";

class AuthService {
  async signup(dto: CreateUserDto): Promise<string> {
    dto.password = await hashPassword(dto.password);

    const user = await userRepository.create(dto);
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
    await sendMail(mailOptions);

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

    await userRepository.markUserVerified(decoded.id);
    return ACCOUNT_VERIFIED;
  }

  async signin(dto: LoginDto): Promise<ILoginResponse> {
    const user = await userRepository.findByEmailUnscoped(dto.email);
    if (!user) {
      throw new UnauthorizedError(INVALID_CREDENTIALS);
    }

    const isValidPassword = await comparePasswords(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError(INVALID_CREDENTIALS);
    }

    if (!user.email_verified_at) {
      throw new BadRequestError(ACCONT_NOT_VERIFIED);
    }

    const accessTokenPayload: IJwtToken = {
      id: user.id,
      user_type: UserType.USER,
      token_type: TokenType.ACCESS,
    };

    const refreshTokenPayload: IJwtToken = {
      id: user.id,
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
}

export default new AuthService();
