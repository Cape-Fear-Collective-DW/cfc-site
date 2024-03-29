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
export CANON_CMS_GENERATOR_TIMEOUT=90000
export CANON_CMS_REQUESTS_PER_SECOND=60
export CANON_LANGUAGES="en"
export CANON_LANGUAGE_DEFAULT="en"

# public keys for develop
export CANON_CMS_ENABLE="true"
export CANON_CMS_LOGGING="false"

# private keys for develop
export CANON_API="http://localhost:3300"
export CANON_CMS_CUBES="https://dev.cfc.api.datawheel.us/"
export CANON_CMS_DB="postgresql://user:password@ip:5432/dbname"
export CANON_CONST_TESSERACT="https://dev.cfc.datawheel.us/proxy/"

# private keys for images
export CANON_CONST_STORAGE_BUCKET="check-1password"
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

* Build the Docker Image of the app
```
docker build -t datawheel/cfc-site:<IMAGE_TAGNAME> .
```

* Deploy the Docker Image on a local container
```
docker run \
  --name=cfc-site \
  -e CANON_CMS_GENERATOR_TIMEOUT=90000 \
  -e CANON_CMS_REQUESTS_PER_SECOND=60 \
  -e CANON_LANGUAGES="en" \
  -e CANON_LANGUAGE_DEFAULT="en" \
  -e CANON_CMS_ENABLE="true" \
  -e CANON_CMS_LOGGING="false" \
  -e CANON_API="http://localhost:3300" \
  -e CANON_CMS_CUBES="https://dev.cfc.api.datawheel.us/" \
  -e CANON_CMS_DB="postgresql://user:password@ip:5432/dbname" \
  -e CANON_CONST_TESSERACT="https://dev.cfc.datawheel.us/proxy/" \
  -e CANON_CONST_STORAGE_BUCKET="check-1password" \
  -e FLICKR_API_KEY="check-1password" \
  -p 3300:3300 \
  -d \
  datawheel/cfc-site:<IMAGE_TAGNAME>
```

* Push the Docker Image to Docker Hub
```
docker push datawheel/cfc-tesseract:<IMAGE_TAGNAME>
```

** Login in to the respective user before pushing the image to Docker Hub
```
docker login -u <DOCKER_USER>
```

### Set-up secrets for github actions workflow

| Secret Name | Value |
| ----------- | ----- |
| CANON_API | https://dev.cfc.datawheel.us |
| CANON_CMS_CUBES | https://dev.cfc.api.datawheel.us/ |
| CANON_CMS_DB | postgresql://user:password@ip:5432/dbname |
| CANON_CONST_TESSERACT | https://dev.cfc.datawheel.us/proxy/ |
| CANON_CONST_STORAGE_BUCKET | check-1password |
| FLICKR_API_KEY | check-1password |
| GCP_ARTIFACT_REGISTRY_REPO_NAME | <GCP_ARTIFACT_REGISTRY_REPO_NAME> |
| GCP_PROJECT_ID | <GCP_PROJECT_ID> |
| GCP_SA_KEY | <GPA_SA_KEY_BASE_64> |
