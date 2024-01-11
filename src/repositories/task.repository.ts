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
        due_at: { [Op.lt]: Sequelize.literal("CURRENT_DATE") },
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
    const [result]: IMaxTaskCompletionDate[] = await sequelize.query(
      `
      SELECT
        DATE(completed_at) AS maxTaskCompletionDate,
        COUNT(*) AS completedTasksCount
      FROM tasks
      WHERE user_id = :userId
        AND is_completed = 1
        AND deleted_at IS NULL
      GROUP BY maxTaskCompletionDate
      ORDER BY completedTasksCount DESC
      LIMIT 1;
      `,
      {
        replacements: { userId: userId },
        type: QueryTypes.SELECT,
      }
    );

    return result;
  }

  async getTasksCreationByDayCount(userId: number): Promise<ITasksPerDay[]> {
    const result: ITasksPerDay[] = await sequelize.query(
      `
      WITH DaysOfWeek AS (
        SELECT 'Sunday' AS dayOfWeek
        UNION SELECT 'Monday' UNION SELECT 'Tuesday' UNION SELECT 'Wednesday'
        UNION SELECT 'Thursday' UNION SELECT 'Friday' UNION SELECT 'Saturday'
      )
      SELECT
        DaysOfWeek.dayOfWeek,
        COUNT(tasks.id) AS taskCount
      FROM DaysOfWeek 
      LEFT JOIN tasks ON DaysOfWeek.dayOfWeek = DAYNAME(tasks.created_at) AND tasks.user_id = :userId AND tasks.deleted_at IS NULL
      GROUP BY DaysOfWeek.dayOfWeek;
      `,
      {
        replacements: { userId: userId },
        type: QueryTypes.SELECT,
      }
    );
    return result;
  }
}

export default new TaskRepository();
