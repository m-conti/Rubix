import map from 'lodash/map';
import get from 'lodash/get';
import isString from 'lodash/isString';

import { IPage, INestedRoute, IRoute, tPageMiddleware, IPageMiddlewareList } from 'types/page';
import { ILocalePath } from 'types/types';
import { ComponentType } from 'react';

const composeMiddleware = (
  Component: ComponentType,
  [ middleware, ...middlewares ]: string[]
): ComponentType => {

  if (!middleware) return Component;

  const withMiddleware: tPageMiddleware = get(
    middlewaresHandled,
    middleware,
    (arg: ComponentType): ComponentType => arg
  );

  return composeMiddleware(withMiddleware(Component), middlewares);
};

const routePage = (
  page: IPage,
  locale = 'fr',
  route = '',
  prefix = '',
  middlewares: string[] = []
): IRoute | INestedRoute => {

  const path = route + (isString(page.path) ? page.path : get(page.path, locale));
  const location = `${prefix}${prefix ? '.' : ''}${page.name}`;

  if (page.component)
    return {
      name: location,
      path,
      exact: get(page, 'exact', false),
      component: composeMiddleware(page.component, [
        ...middlewares,
        ...(page.middlewares || []),
      ]),
    };


  return map(page.pages, (child) =>
    routePage(child, locale, path, location, [
      ...middlewares,
      ...(page.middlewares || []),
    ])
  );
};

const middlewaresHandled: IPageMiddlewareList = {};

export default (
  pages: IPage[],
  locale: string,
  path: string | ILocalePath
): IRoute | INestedRoute => (
  routePage({ pages, path, name: locale }, locale)
);
