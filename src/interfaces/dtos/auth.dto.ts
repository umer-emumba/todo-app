import { IsEmail, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Min(8)
  password!: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class PasswordResetDto {
  @IsNotEmpty()
  @IsString()
  @Min(8)
  password!: string;

  @IsNotEmpty()
  @IsString()
  token!: string;
}
