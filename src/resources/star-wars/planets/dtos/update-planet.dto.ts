import { PartialType } from '@nestjs/swagger';
import { CreatePlanetDto } from './create-planet.dto';

export class UpdatePlanetDto extends PartialType(CreatePlanetDto) {}
