import { IsEnum, IsOptional } from 'class-validator';

export enum SortType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SortDto {
  @IsEnum({ enum: SortType })
  @IsOptional()
  type: SortType;
}
