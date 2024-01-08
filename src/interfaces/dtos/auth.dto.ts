export class CreateUserDto {
  declare email: string;
  declare password: string;
}

export class LoginDto {
  declare email: string;
  declare password: string;
}

export class PasswordResetDto {
  declare password: string;
  declare token: string;
}
