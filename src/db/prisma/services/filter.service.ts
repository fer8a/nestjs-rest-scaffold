import { validate as isValidUuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { FindManyWithParamsDto } from '../dto/find-many-params.dto';

enum DateFields {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  startDate = 'startDate',
  endDate = 'endDate',
}

@Injectable()
export class PrismaFilterService {
  build(data: FindManyWithParamsDto) {
    const { skip, take } = data;
    const where: any = { AND: [] };
    const orderBy: any = [];

    data.sort?.forEach((sort) => {
      orderBy.push({ [sort.field]: sort.value });
    });

    data.filter?.forEach((filter) => {
      const obj = this.buildFieldFilter(filter);
      where['AND'].push(obj);
    });

    return { skip, take, where, orderBy };
  }

  private buildFieldFilter(filter: { field: string; value: string }) {
    const { field, value } = filter;
    const values = value.split(',');

    const andArray: any[] = [];
    const orArray: any[] = [];

    values.forEach((value) => {
      const nFilter = this.getFilterType(field, value.trim());
      const obj = field
        .split('.')
        .reduceRight((o, x) => ({ [x]: o }), { ...nFilter });

      if (Object.keys(nFilter)[0] === 'not') {
        andArray.push(obj);
      } else {
        orArray.push(obj);
      }
    });

    if (andArray.length > 0 && orArray.length > 0) {
      return {
        AND: [...andArray, { OR: [...orArray] }],
      };
    } else if (andArray.length > 0) {
      return {
        AND: [...andArray],
      };
    } else {
      return {
        OR: [...orArray],
      };
    }
  }

  private getFilterType(field: string, value: string) {
    if (field in DateFields) {
      return this.getDateTimeFilterType(field, value);
    }

    const secondChar = value[1];
    const lastChar = value[value.length - 1];
    const obj: any = { not: {}, mode: 'insensitive' };
    let pointer;
    let sanatizedvalue = value;
    let firstChar = value[0];

    if (firstChar === '!') {
      firstChar = secondChar;
      pointer = obj['not'];

      if (lastChar === '*') {
        sanatizedvalue = sanatizedvalue.substring(1, value.length - 1);
      } else {
        sanatizedvalue = sanatizedvalue.substring(1, value.length);
      }
    } else {
      pointer = obj;
    }

    if (firstChar === '*' && lastChar === '*') {
      sanatizedvalue = sanatizedvalue.substring(1, value.length - 1);
      pointer['contains'] = sanatizedvalue;
    } else if (firstChar === '*') {
      sanatizedvalue = sanatizedvalue.substring(1, value.length);
      pointer['startsWith'] = sanatizedvalue;
    } else if (lastChar === '*') {
      sanatizedvalue = sanatizedvalue.substring(0, value.length - 1);
      pointer['endsWith'] = sanatizedvalue;
    } else {
      pointer['equals'] = Number(sanatizedvalue) || sanatizedvalue;
    }

    // remove mode for integers and uuid values
    if (Number(sanatizedvalue) || isValidUuid(sanatizedvalue)) {
      delete obj.mode;
    }

    return obj;
  }

  private getDateTimeFilterType(field: string, value: string) {
    //TODO ADD Timezone logic
    const obj: { lt?: Date; lte?: Date; gt?: Date; gte?: Date } = {};

    if (value.startsWith('..')) {
      obj['lte'] = new Date(value.replace('..', ''));
    } else if (value.endsWith('..')) {
      obj['gte'] = new Date(value.replace('..', ''));
    } else if (value.startsWith('>')) {
      obj['gt'] = new Date(value.replace('>', ''));
    } else if (value.startsWith('<')) {
      obj['lt'] = new Date(value.replace('<', ''));
    } else {
      const d1 = new Date(value);
      obj['gte'] = d1;
      obj['lte'] = new Date(d1.getTime() + 60 * 60 * 24 * 1000);
    }

    return obj;
  }
}
