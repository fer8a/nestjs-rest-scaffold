import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class FindManyDto {
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  skip?: number = 0;

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  take?: number = 10;
}
