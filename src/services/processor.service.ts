import { Job } from "bullmq";
import QueueService from "./queue.service";
import { QueuesEnum } from "../interfaces";
import { logger, sendMail } from "../utils";

export default class DefaultProcessor {
  static async sendJobEmail(job: Job) {
    const queue = new QueueService().getQueue(QueuesEnum.DEFAULT);
    if (!queue) return;
    await sendMail(job.data);
    logger.info(
      `Process job with id ${job.id} from the ${QueuesEnum.DEFAULT} queue`
    );
    return true;
  }
}
