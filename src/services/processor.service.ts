import { Job } from "bullmq";
import QueueService from "./queue.service";
import { NotificationTypeEnum, QueuesEnum } from "../interfaces";
import { convertHtmlToPdf, logger, sendMail, sendSMS } from "../utils";
import { userNotificationRepository } from "../repositories";

export default class DefaultProcessor {
  static async sendJobEmail(job: Job) {
    const queue = new QueueService().getQueue(QueuesEnum.DEFAULT);
    if (!queue) return;

    await sendMail(job.data);

    await userNotificationRepository.create({
      user_id: job.data.userId,
      notification_type: NotificationTypeEnum.EMAIL,
    });

    logger.info(
      `Process job with id ${job.id} from the ${QueuesEnum.DEFAULT} queue`
    );
    return true;
  }

  static async generatePdf(job: Job) {
    const queue = new QueueService().getQueue(QueuesEnum.DEFAULT);
    if (!queue) return;
    await convertHtmlToPdf(job.data);
    logger.info(
      `Process job with id ${job.id} from the ${QueuesEnum.DEFAULT} queue`
    );
    return true;
  }

  static async sendSMSNotifications(job: Job) {
    const queue = new QueueService().getQueue(QueuesEnum.DEFAULT);
    if (!queue) return;
    await sendSMS(job.data);

    await userNotificationRepository.create({
      user_id: job.data.userId,
      notification_type: NotificationTypeEnum.SMS,
    });

    logger.info(
      `Process job with id ${job.id} from the ${QueuesEnum.DEFAULT} queue`
    );
    return true;
  }
}
