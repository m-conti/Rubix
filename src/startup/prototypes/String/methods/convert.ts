import i18next from 'startup/i18n/i18n';
import { TOptions } from 'i18next';
import moment from 'moment-timezone';
import { tFunctionalMap } from 'typings/types';
// import path from 'routes/helpers/path';

const cases: tFunctionalMap = {
  date: moment,
  translate: i18next.t.bind(i18next),
  // path: path,
};

export default function(
  this: string,
  select: 'date'|'translate'|'path',
  params?: string | TOptions<object>
): string {
  return (cases[select] || (() => this))(this, params);
}
