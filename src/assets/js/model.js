import { clone } from 'lodash';
import { objectify } from '@/utils/model';

export default model => (data = {}) => clone(Object.entries(model)
  .map(([key, value]) => [
    key,
    data[key] !== undefined ? data[key] : value,
  ])
  .reduce(objectify, {}));
