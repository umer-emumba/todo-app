import { CreateOptions, WhereOptions } from "sequelize";
import { Model, ModelCtor, Sequelize } from "sequelize-typescript";
import { MakeNullishOptional } from "sequelize/types/utils";
import { OrderEnum, PaginationDto } from "../interfaces";

export abstract class BaseRepository<T extends Model<T>> {
  protected readonly model: ModelCtor<T>;

  constructor(private sequelize: Sequelize, private modelClass: ModelCtor<T>) {
    this.model = modelClass;
  }

  async find(where: WhereOptions<T>, dto: PaginationDto): Promise<T[]> {
    return this.model.findAll({
      where,
      limit: dto.limit,
      offset: dto.offset,
      order: [["id", dto.order || OrderEnum.DESC]],
    });
  }

  async findById(id: number): Promise<T | null> {
    return this.model.findByPk(id);
  }

  async create(
    entity: MakeNullishOptional<T["_creationAttributes"]>,
    options?: CreateOptions<T>
  ): Promise<T> {
    return this.model.create(entity, options);
  }

  async update(where: WhereOptions<T>, entity: Partial<T>): Promise<[number]> {
    return this.model.update(entity, { where });
  }

  async delete(where: WhereOptions<T>): Promise<number> {
    return this.model.destroy({
      where,
    });
  }
}
