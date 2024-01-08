export enum TokenType {
  EMAIL_VERIFICATION = "email_verification",
  REFRESH = "refresh",
  AUTH = "auth",
  PASSWORD_RESET = "password_reset",
}

export enum UserType {
  USER = "user",
}

export interface IJwtToken {
  id: number;
  token_type: TokenType;
  user_type: UserType;
}
