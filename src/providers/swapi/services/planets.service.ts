import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Planet } from '../entities/planet.entity';
import { AxiosResponse } from 'axios';

@Injectable()
export class PlanetsService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Returns an Axios response of Swapi planets
   *
   * @returns Promise<AxiosResponse<Planet[]>>
   */
  findAll(): Promise<AxiosResponse<Planet[]>> {
    return firstValueFrom(this.httpService.get<Planet[]>('/planets'));
  }

  /**
   * Returns an Axios response of a Swapi planet
   *
   * @param id target planet ID
   * @returns Promise<AxiosResponse<Planet>>
   */
  findOne(id: number): Promise<AxiosResponse<Planet>> {
    return firstValueFrom(this.httpService.get<Planet>(`/planets/${id}`));
  }
}
