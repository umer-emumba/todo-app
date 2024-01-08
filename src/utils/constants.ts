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
export const ENTITY_SHOULD_BE_UBNIQUE = (item: string) =>
  `${item} should be unique`;
export const EMAIL_VERIFICATION_TITLE = `Account verification email`;
export const EMAIL_VERIFICATION_BODY = (token: string) => `
<h1>Account verification</h1>
<p>please click on given link to activate your account <a href="${config.frontendUrl}/verify_account?token=${token}">Activate Account</a></p>

`;
export const ACCOUNT_CREATED: string = `Your account is created successfully, account verification link has been sent to your email address`;
export const INVALID_TOKEN: string = `Invalid token provided`;
export const ACCOUNT_VERIFIED: string = `Your account is verified, now you can login with your credentials`;
