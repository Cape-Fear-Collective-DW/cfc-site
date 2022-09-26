import React from "react";
import {Route, IndexRoute, browserHistory} from "react-router";
import {Builder} from "@datawheel/canon-cms";

import App from "./App";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Data from "./pages/Data";

function createRoute() {
  return (
    <Route path="/" component={App} history={browserHistory}>
      <IndexRoute component={Home} />
      <Route path="/community-data" component={Data} />
      <Route path="/cms" component={Builder} />
      <Route path="/profile/:slug/:id" component={Profile} />
    </Route>
  );
}

export default createRoute;
