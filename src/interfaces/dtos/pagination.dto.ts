import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsString, Max, Min } from "class-validator";
import { BaseDto } from "./base.dto";

export enum OrderEnum {
  ASC = "asc",
  DESC = "desc",
}

export class PaginationDto extends BaseDto {
  @IsInt()
  @Max(40)
  @Transform(({ value }) => Number(value))
  limit?: number = 10;

  @IsInt()
  @Min(0)
  @Transform(({ value }) => Number(value))
  offset?: number = 0;

  @IsString()
  text?: string = "";

  @IsEnum(OrderEnum)
  order?: OrderEnum = OrderEnum.DESC;
}
