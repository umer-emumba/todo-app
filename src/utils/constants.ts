import path from "path";
import config from "./config";

export const INTERNAL_SERVER_ERROR: string = "Internal Server Error";
export const BAD_REQUEST_ERROR: string = "Bad Request";
export const DATABASE_CONNECTED: string = "Database connected";
export const DATABASE_CONNECTION_FAILED: string =
  "Unable to connect to the database";
export const SWAGGER_SPECS_PATH: string = path.join(
  __dirname,
  "./../swagger/bundle.yaml"
);
export const CREATED_SUCCESSFULLY = (item: string) =>
  `${item} created successfully`;
export const UPDATED_SUCCESSFULLY = (item: string) =>
  `${item} updated successfully`;
export const ENTITY_SHOULD_BE_UBNIQUE = (item: string) =>
  `${item} should be unique`;
export const EMAIL_VERIFICATION_TITLE: string = `Account verification email`;
export const EMAIL_VERIFICATION_BODY = (token: string) => `
<h1>Account verification</h1>
<p>please click on given link to activate your account <a href="${config.frontendUrl}/verify_account?token=${token}">Activate Account</a></p>

`;
export const ACCOUNT_CREATED: string = `Your account is created successfully, account verification link has been sent to your email address`;
export const INVALID_TOKEN: string = `Invalid token provided`;
export const TOKEN_MISSING: string = `Unauthorized, Token is not provided`;
export const ACCOUNT_VERIFIED: string = `Your account is verified, now you can login with your credentials`;
export const INVALID_CREDENTIALS: string = `Invalid Credentials`;
export const ACCONT_NOT_VERIFIED: string = `Please verify your account first to use this app`;
export const ACCOUNT_NOT_FOUND: string = `No Account found aginst given info`;
export const FORGOT_PASSWORD_NOT_ALLOWED_FOR_SOCIAL_LOGIN: string = `Forgot password is not allowed for social logins`;

export const PASSWORD_FORGOT_EMAIL_TITLE: string = `Password Reset Request`;
export const PASSWORD_FORGOT_EMAIL_BODY = (token: string) => `
<h1>Password Reset Request</h1>
<p>please click on given link to reset your account password <a href="${config.frontendUrl}/forgot_password?token=${token}">Reset Password</a></p>

`;
export const PASSWORD_RESET_EMAIL_SENT: string = `Password reset email has been sent to your email`;
export const ACCOUNT_ALREAD_EXIST_WITH_THIS_EMAIL: string = `Account already exist with this email`;
export const TASK_LIMIT_EXCEEDED: string = `Your max task limit exceeded`;
