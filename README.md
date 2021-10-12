# cfc-site

## Initial Repo Setup

### Installing canon-core scaffolding
* `npm init @datawheel/canon`
* `npm i`
* replace `"latest"` in package.json with the currently installed version of `@datawheel/canon-core`

### Installing canon-cms

* `npm i @datawheel/canon-cms`
* set the following env vars:

```sh
# public keys for everything
export CANON_API="http://localhost:3300"
export CANON_LANGUAGE_DEFAULT="en"
export CANON_LANGUAGES="en"

# public keys for develop
export CANON_CMS_ENABLE="true"

# private keys for develop
export CANON_CMS_DB="postgresql://user:password@ip:5432/dbname"
export CANON_CMS_CUBES="https://dev.cfc.ui.datawheel.us/tesseract/"
export FLICKR_API_KEY="check-1password"
```

* hook up CMS db in `canon.js`:

```js
module.exports = {
  db: [
    {
      connection: process.env.CANON_CMS_DB,
      tables: [
        require("@datawheel/canon-cms/models")
      ]
    }
  ]
};
```

* add CMS and Profile routes to `app/routes.jsx`:

```jsx
import React from "react";
import {Route, IndexRoute, browserHistory} from "react-router";
import {Builder, Profile} from "@datawheel/canon-cms";

import App from "./App";
import Home from "./pages/Home";

function createRoute() {
  return (
    <Route path="/" component={App} history={browserHistory}>
      <IndexRoute component={Home} />
      <Route path="/cms" component={Builder} />
      <Route path="/profile/:slug/:id" component={Profile} />
    </Route>
  );
}

export default createRoute;
```

* add CMS reducer to `app/store/index.js`:

```js
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
```

* 💰💰💰 Profit 💰💰💰

### Runing a local docker instance

* Build the image of the app
```
docker build -t cfc-site:dev .
```

* Run a container with the created image

```
docker run \
  --name=hcf-site \
  -e CANON_API="http://localhost:3300" \
  -e CANON_LANGUAGE_DEFAULT="en" \
  -e CANON_LANGUAGES="en" \
  -e CANON_CMS_ENABLE="true" \
  -e CANON_CMS_DB="postgresql://user:password@ip:5432/dbname" \
  -e CANON_CMS_CUBES="https://dev.cfc.ui.datawheel.us/tesseract/" \
  -e FLICKR_API_KEY="check-1password" \
  -p 3300:3300 \
  -d \
  cfc-site:dev
```
