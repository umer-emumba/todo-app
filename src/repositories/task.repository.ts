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
import { Task, TaskAttachment } from "../models";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import sequelize from "../models/connection";

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

  async getTasksCount(userId: number): Promise<ITaskCount> {
    const [result]: ITaskCount[] = await sequelize.query(
      `
        SELECT
          COUNT(*) AS totalTasks,
          CAST(SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) AS SIGNED) AS completedTasks,
          CAST(SUM(CASE WHEN is_completed = 0 THEN 1 ELSE 0 END) AS SIGNED) AS remainingTasks
        FROM tasks
        WHERE user_id = :userId AND deletedAt IS NULL
      `,
      {
        replacements: { userId: userId },
        type: QueryTypes.SELECT,
      }
    );
    return result;
  }

  async averageCompletedTasksPerDay(
    userId: number
  ): Promise<IAverageTaskCompleted> {
    const [result]: IAverageTaskCompleted[] = await sequelize.query(
      `
      SELECT
        CAST(
          ROUND( 
            COUNT(*) / (DATEDIFF(MAX(created_at), MIN(created_at)) + 1)
          ) AS SIGNED
        ) AS averageCompletedTasksPerDay
        FROM tasks
        WHERE user_id = :userId
          AND is_completed = 1 AND deletedAt IS NULL
      `,
      {
        replacements: { userId: userId },
        type: QueryTypes.SELECT,
      }
    );

    return result;
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
        AND deletedAt IS NULL
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
      LEFT JOIN tasks ON DaysOfWeek.dayOfWeek = DAYNAME(tasks.created_at) AND tasks.user_id = :userId AND tasks.deletedAt IS NULL
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
