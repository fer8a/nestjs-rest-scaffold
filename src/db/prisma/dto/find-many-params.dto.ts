import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
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

class ParamTuple {
  @IsString()
  field!: string;

  @IsString()
  value!: string;
}

class SortTuple {
  @IsString()
  field!: string;

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
}
