export const initialState = {};

export const middleware = [];

if (__DEV__ && !__SERVER__) {
  const {createLogger} = require("redux-logger");

  // You can apply any of these recipes freely
  // https://www.npmjs.com/package/redux-logger#recipes
  const loggerMiddleware = createLogger({
    collapsed: (getState, action, logEntry) => !logEntry || !logEntry.error
  });
  middleware.push(loggerMiddleware);
}

import {cmsReducer} from "@datawheel/canon-cms";
export const reducers = {cms: cmsReducer};
