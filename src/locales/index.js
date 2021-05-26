import mapValues from 'lodash/mapValues';
import get from 'lodash/get';

import * as btn from './btn';
import * as cube from './cube';
import * as input from './input';

const selectLangage = (locale) => mapValues({
  btn,
  cube,
  input,
}, (trads) => get(trads, locale));

export const fr = selectLangage('fr');
export const en = selectLangage('en');
