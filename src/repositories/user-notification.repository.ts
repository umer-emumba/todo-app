import { Sequelize } from "sequelize-typescript";
import { UserNotification } from "../models";
import { BaseRepository } from "./base.repository";
import sequelize from "../models/connection";
import { IEmailSMSReport } from "../interfaces";

class NotificationRepository extends BaseRepository<UserNotification> {
  constructor(sequelize: Sequelize) {
    super(sequelize, UserNotification);
  }

  async getEmailSMSCount(userId: number): Promise<IEmailSMSReport> {
    const taskCounts = await UserNotification.findOne({
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.fn(
              "IF",
              Sequelize.literal("notification_type = 'SMS'"),
              1,
              0
            )
          ),
          "sms_count",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.fn(
              "IF",
              Sequelize.literal("notification_type = 'EMAIL'"),
              1,
              0
            )
          ),
          "email_count",
        ],
      ],
      where: {
        user_id: userId,
        deleted_at: null,
      },
    });

    let result: IEmailSMSReport = {
      emailSent: Number(taskCounts?.getDataValue("email_count")),
      smsSent: Number(taskCounts?.getDataValue("sms_count")),
    };
    return result;
  }
}

export default new NotificationRepository(sequelize);
