import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import {NonIdealState, Spinner} from "@blueprintjs/core";
import "./Loading.css";

/**
  This component is displayed when the needs of another component are being
  loaded into the redux store.
*/
class Loading extends Component {
  render() {
    const {t} = this.props;
    return <NonIdealState
      className="loading"
      title={t("Loading.title")}
      description={t("Loading.description")}
      action={<Spinner />} />;
  }
}

export default withNamespaces()(Loading);
