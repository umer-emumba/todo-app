import { Job, Queue, Worker } from "bullmq";
import { BullQueueOptions, logger } from "../utils";
import { JobTypeEnum, QueuesEnum } from "../interfaces";
import DefaultProcessor from "./processor.service";

export default class QueueService {
  private declare queues: Record<string, Queue>;
  private declare defaultQueue: Queue;
  private declare defaultQueueWorker: Worker;

  private static instance: QueueService;

  constructor() {
    if (QueueService.instance instanceof QueueService) {
      return QueueService.instance;
    }

    this.queues = {};
    QueueService.instance = this;

    this.instantiateQueues();
    this.instantiateWorkers();
  }

  async instantiateQueues() {
    this.defaultQueue = new Queue(QueuesEnum.DEFAULT, BullQueueOptions);

    this.queues[QueuesEnum.DEFAULT] = this.defaultQueue;
  }

  getQueue(name: QueuesEnum) {
    return this.queues[name];
  }

  async instantiateWorkers() {
    this.defaultQueueWorker = new Worker(
      QueuesEnum.DEFAULT,
      async (job: Job) => {
        switch (job.name) {
          case JobTypeEnum.SEND_EMAIL:
            await DefaultProcessor.sendJobEmail(job);
            break;
        }
        logger.info("[DEFAULT QUEUE] Worker for default queue");
      },
      { connection: BullQueueOptions.connection }
    );

    this.defaultQueueWorker.on("completed", (job: Job, value) => {
      logger.info(
        `[DEFAULT QUEUE] Completed job with data\n
          Data: ${job.asJSON().data}\n
          ID: ${job.id}\n
          Value: ${value}
        `
      );
    });

    this.defaultQueueWorker.on("failed", (job?: Job) => {
      logger.error(
        `[DEFAULT QUEUE] Failed job with data\n
          Data: ${job?.asJSON().data}\n
          ID: ${job?.id}
        `
      );
    });
  }
}
