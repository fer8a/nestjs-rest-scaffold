import { IsUUID } from 'class-validator';

export class DeleteManyDto {
  @IsUUID('all', { each: true })
  ids!: string[];
}
