import { Transform } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from "class-validator";

export enum AttachmentType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  PDF = "PDF",
  DOC = "DOC",
}

export enum TaskType {
  TEXT = "TEXT",
  HTML = "HTML",
}

export class CreateTaskDto {
  @ValidateIf((object, value) => object.task_type === TaskType.TEXT)
  @IsString()
  @MaxLength(50)
  title!: string;

  @ValidateIf((object, value) => object.task_type === TaskType.HTML)
  @IsString()
  html!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description!: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  due_at!: Date;

  @IsEnum(TaskType)
  task_type!: TaskType;

  @IsOptional()
  @ValidateNested()
  task_attachments?: Attachment[];
}

export class UpdateTaskDto {
  @ValidateIf((object, value) => object.task_type === TaskType.TEXT)
  @IsString()
  @MaxLength(50)
  title!: string;

  @ValidateIf((object, value) => object.task_type === TaskType.HTML)
  @IsString()
  html!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsEnum(TaskType)
  task_type!: TaskType;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  due_at!: Date;
}

export class Attachment {
  @IsNotEmpty()
  @IsString()
  attachment_url!: string;

  @IsEnum(AttachmentType)
  attachment_type!: AttachmentType;
}
