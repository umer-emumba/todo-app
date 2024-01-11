import { QueryTypes, WhereOptions } from "sequelize";
import {
  CreateTaskDto,
  IAverageTaskCompleted,
  IMaxTaskCompletionDate,
  IOverDueTaskCount,
  ITaskCount,
  ITasksPerDay,
  OrderEnum,
  PaginationDto,
  UpdateTaskDto,
} from "../interfaces";
import { Task, TaskAttachment, User } from "../models";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import sequelize from "../models/connection";
import dayjs from "dayjs";

class TaskRepository {
  async countById(userId: number): Promise<number> {
    return Task.count({
      where: {
        user_id: userId,
      },
    });
  }

  async create(userId: number, dto: CreateTaskDto): Promise<Task> {
    return await Task.create(
      {
        user_id: userId,
        ...dto,
      },
      {
        include: [
          {
            model: TaskAttachment,
          },
        ],
      }
    );
  }

  async findById(id: number): Promise<Task | null> {
    return await Task.findByPk(id);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<[number]> {
    return await Task.update(
      {
        ...dto,
      },
      {
        where: {
          id,
        },
      }
    );
  }

  async markCompleted(id: number): Promise<[number]> {
    return await Task.update(
      {
        is_completed: 1,
        completed_at: new Date(),
      },
      {
        where: {
          id,
        },
      }
    );
  }

  async count(userId: number, dto: PaginationDto): Promise<number> {
    let where: any = {
      user_id: userId,
    };
    if (dto.text) {
      where[Op.or] = [
        {
          title: {
            [Op.like]: `%${dto.text}%`,
          },
        },
      ];
    }

    return await Task.count({
      where,
    });
  }

  async findAll(userId: number, dto: PaginationDto): Promise<Task[]> {
    let where: any = {
      user_id: userId,
    };
    if (dto.text) {
      where[Op.or] = [
        {
          title: {
            [Op.like]: `%${dto.text}%`,
          },
        },
      ];
    }

    return await Task.findAll({
      where,
      limit: dto.limit,
      offset: dto.offset,
      order: [["id", dto.order || OrderEnum.DESC]],
    });
  }

  async destroy(id: number): Promise<number> {
    return await Task.destroy({
      where: {
        id: id,
      },
    });
  }

  async getTaskDetails(id: number): Promise<Task | null> {
    return Task.findOne({
      where: {
        id,
      },
      include: [
        {
          model: TaskAttachment,
        },
      ],
    });
  }

  async findSimilarTasks(task: Task): Promise<Task[]> {
    const similarTasks = await Task.findAll({
      where: {
        [Op.or]: [
          Sequelize.literal(
            `MATCH(title) AGAINST('${task.title}' IN BOOLEAN MODE)`
          ),
          Sequelize.literal(
            `MATCH(title) AGAINST('${task.title}' IN BOOLEAN MODE)`
          ),
        ],
        id: {
          [Op.not]: task.id, // Exclude the same task
        },
        user_id: task.user_id,
      },
      limit: 5,
      order: [["id", "desc"]],
    });

    return similarTasks;
  }

  async getTodayTasks(): Promise<Task[]> {
    return Task.findAll({
      attributes: ["id", "title"],
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("DATE", Sequelize.col("due_at")),
            "=",
            Sequelize.fn("CURDATE")
          ),
        ],
      },
      include: [
        {
          model: User,
          attributes: ["id", "email"],
        },
      ],
    });
  }

  async getTasksCount(userId: number): Promise<ITaskCount> {
    const taskCounts = await Task.findOne({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("*")), "totalTasks"],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.fn("IF", Sequelize.literal("is_completed = 1"), 1, 0)
          ),
          "completedTasks",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.fn("IF", Sequelize.literal("is_completed = 0"), 1, 0)
          ),
          "remainingTasks",
        ],
      ],
      where: {
        user_id: userId,
        deleted_at: null,
      },
    });
    let result: ITaskCount = {
      totalTasks: Number(taskCounts?.getDataValue("totalTasks")),
      completedTasks: Number(taskCounts?.getDataValue("completedTasks")),
      remainingTasks: Number(taskCounts?.getDataValue("remainingTasks")),
    };
    return result;
  }

  async averageCompletedTasksPerDay(
    userId: number
  ): Promise<IAverageTaskCompleted> {
    const result = await Task.findOne({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
        [Sequelize.fn("MAX", sequelize.col("created_at")), "max_date"],
        [Sequelize.fn("MIN", sequelize.col("created_at")), "min_date"],
      ],
      where: {
        user_id: userId,
        is_completed: 1,
        deleted_at: null,
      },
    });
    let totalRows = result?.getDataValue("total");
    let maxDate = dayjs(result?.getDataValue("max_date"));
    let minDate = dayjs(result?.getDataValue("min_date"));
    let average: IAverageTaskCompleted = {
      averageCompletedTasksPerDay: totalRows / maxDate.diff(minDate, "d"),
    };

    return average;
  }

  async getOverDueTasksCount(userId: number): Promise<IOverDueTaskCount> {
    const overdueTaskCount = await Task.count({
      where: {
        user_id: userId,
        is_completed: 0,
        due_at: { [Op.lt]: new Date() },
      },
    });

    let response: IOverDueTaskCount = {
      overdueTaskCount,
    };

    return response;
  }

  async getMaxTaskCompletionDate(
    userId: number
  ): Promise<IMaxTaskCompletionDate> {
    const query = await Task.findOne({
      attributes: [
        [
          Sequelize.fn("DATE", Sequelize.col("created_at")),
          "maxTaskCompletionDate",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "completedTasksCount"],
      ],
      where: {
        user_id: userId,
        is_completed: 1,
      },
      group: [Sequelize.fn("DATE", Sequelize.col("created_at"))],
      order: [[Sequelize.fn("COUNT", Sequelize.col("id")), "DESC"]],
      limit: 1,
    });
    let result: IMaxTaskCompletionDate = {
      completedTasksCount: query?.getDataValue("completedTasksCount"),
      maxTaskCompletionDate: query?.getDataValue("maxTaskCompletionDate"),
    };
    return result;
  }

  async getTasksCreationByDayCount(userId: number): Promise<ITasksPerDay[]> {
    const tasksByDayOfWeek = await Task.findAll({
      attributes: [
        [Sequelize.fn("DAYNAME", Sequelize.col("created_at")), "dayOfWeek"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "taskCount"],
      ],
      where: {
        user_id: userId,
      },
      group: [Sequelize.fn("DAYNAME", Sequelize.col("created_at"))],
    });

    let result: ITasksPerDay[] = tasksByDayOfWeek.map((item) => {
      let taskPerDay: ITasksPerDay = {
        dayOfWeek: item.getDataValue("dayOfWeek"),
        taskCount: item.getDataValue("taskCount"),
      };
      return taskPerDay;
    });

    return result;
  }
}

export default new TaskRepository();
