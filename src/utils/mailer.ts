import nodemailer from "nodemailer";
import config from "./config";

const transporter = nodemailer.createTransport({
  host: config.mailer.host,
  port: config.mailer.port,
  auth: {
    user: config.mailer.username,
    pass: config.mailer.password,
  },
  logger: true,
});

export default transporter;
