import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FindManyDto } from './find-many.dto';

enum SortValue {
  asc = 'asc',
  desc = 'desc',
}

export class ParamTuple {
  @IsString()
  field!: string;

  @IsString()
  value!: string;
}

class SortTuple extends ParamTuple {
  @IsEnum(SortValue)
  value!: SortValue;
}

export class FindManyWithParamsDto extends FindManyDto {
  @ApiProperty({
    type: [ParamTuple],
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParamTuple)
  @IsOptional()
  filter?: ParamTuple[];

  @ApiProperty({
    type: [SortTuple],
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortTuple)
  @IsOptional()
  sort?: SortTuple[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value?.toLowerCase() === 'true')
  // Use this parameter to explicitly request for soft-deleted records
  deleted?: boolean;
}
