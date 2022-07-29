import * as qs from 'qs';

export const httpOptions = {
  querystringParser: (str: string) => qs.parse(str),
};
