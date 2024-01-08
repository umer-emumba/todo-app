import { CreateUserDto, IMailOptions } from "../interfaces";
import { IJwtToken, TokenType, UserType } from "../interfaces/IJwtToken";
import { userRepository } from "../repositories";
import {
  ACCOUNT_CREATED,
  ACCOUNT_VERIFIED,
  BadRequestError,
  CREATED_SUCCESSFULLY,
  EMAIL_VERIFICATION_BODY,
  EMAIL_VERIFICATION_TITLE,
  INVALID_TOKEN,
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
      decoded.user_type !== UserType.USER &&
      decoded.token_type !== TokenType.EMAIL_VERIFICATION
    ) {
      throw new BadRequestError(INVALID_TOKEN);
    }

    await userRepository.markUserVerified(decoded.id);
    return ACCOUNT_VERIFIED;
  }
}

export default new AuthService();
