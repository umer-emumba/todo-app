import {
  Table,
  Column,
  Model,
  DataType,
  Length,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Task from "./task.model";
import { AttachmentType } from "../interfaces";

@Table({
  timestamps: true,
  underscored: true,
  tableName: "task_attachments",
  paranoid: true,
})
export default class TaskAttachment extends Model {
  @Length({ max: 255 })
  @Column(DataType.STRING)
  declare attachment_url: string;

  @Length({ max: 255 })
  @Column(DataType.ENUM("IMAGE", "VIDEO", "PDF", "DOC"))
  declare attachment_type: AttachmentType;

  @ForeignKey(() => Task)
  @Column(DataType.INTEGER)
  declare task_id: number;

  @BelongsTo(() => Task)
  declare task: Task;
}
