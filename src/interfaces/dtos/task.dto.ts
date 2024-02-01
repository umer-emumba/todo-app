import { Transform } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description!: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  due_at!: Date;

  @IsOptional()
  @ValidateNested()
  task_attachments?: Attachment[];
}

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  due_at!: Date;
}

export enum AttachmentType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  PDF = "PDF",
  DOC = "DOC",
}

export class Attachment {
  @IsNotEmpty()
  @IsString()
  attachment_url!: string;

  @IsEnum(AttachmentType)
  attachment_type!: AttachmentType;
}
