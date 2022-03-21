import { IsPositive, Min } from 'class-validator';

export class PaginationDto<TData> {
  @IsPositive()
  @Min(0)
  total!: number;

  @IsPositive()
  limit!: number;

  @IsPositive()
  @Min(0)
  offset!: number;

  results!: TData[];
}
