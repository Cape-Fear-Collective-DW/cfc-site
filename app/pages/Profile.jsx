import React, {Component, Fragment} from "react";

import PropTypes from "prop-types";
import {Helmet} from "react-helmet-async";

import {fetchData} from "@datawheel/canon-core";
import stripP from "@datawheel/canon-cms/src/utils/formatters/stripP";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";

import libs from "@datawheel/canon-cms/src/utils/libs";
import {Profile as CMSProfile} from "@datawheel/canon-cms";

import profileSearchConfig from "$app/helpers/search";
import "./Profile.css";

class Profile extends Component {

  getChildContext() {
    const {formatters, locale, profile, router} = this.props;
    const {variables} = profile;

    return {
      formatters: formatters.reduce((acc, d) => {
        const f = Function("n", "libs", "formatters", d.logic);
        const fName = d.name.replace(/^\w/g, chr => chr.toLowerCase());
        acc[fName] = n => f(n, libs, acc);
        return acc;
      }, {}),
      router,
      variables,
      locale
    };
  }


  render() {

    const {profile, t} = this.props;
    let title = null;

    if (profile.sections && profile.sections.length) {
      title = `${stripP(profile.sections[0].title)} ${stripP(profile.sections[0].subtitles[0].subtitle)}`;
    }

    return (
      <Fragment>
        <Helmet title={title} />
        <CMSProfile searchProps={{...profileSearchConfig(t)}} {...this.props} />
      </Fragment>
    );
  }
}


Profile.need = [
  fetchData("profile", "/api/profile/?slug=<slug>&id=<id>&locale=<i18n.locale>"),
  fetchData("formatters", "/api/formatters")
];

Profile.childContextTypes = {
  formatters: PropTypes.object,
  locale: PropTypes.string,
  router: PropTypes.object,
  variables: PropTypes.object
};

export default withNamespaces()(
  connect(state => ({
    formatters: state.data.formatters,
    locale: state.i18n.locale,
    profile: state.data.profile
  }))(Profile)
);
