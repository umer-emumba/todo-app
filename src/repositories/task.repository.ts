import { WhereOptions } from "sequelize";
import {
  CreateTaskDto,
  IPaginatedResponse,
  OrderEnum,
  PaginationDto,
  UpdateTaskDto,
} from "../interfaces";
import { Task, TaskAttachment } from "../models";
import { Op } from "sequelize";

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
}

export default new TaskRepository();
