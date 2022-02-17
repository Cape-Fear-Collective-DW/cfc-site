import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import {connect} from "react-redux";
import {Helmet} from "react-helmet-async";

import {ProfileSearch} from "@datawheel/canon-cms";
import {Dialog} from "@blueprintjs/core";

import Nav from "./components/Nav";
import Footer from "./components/Footer";
import profileSearchConfig from "$app/helpers/search";
import {toggleSearch} from "$app/actions/search";
import "./App.css";

class App extends Component {

  render() {

    const {barePage, origin, searchVisible, t, toggleSearch} = this.props;

    return (
      <div>
        <Helmet>
          <meta property="og:image" content={ `${origin}/images/share.png` } />
        </Helmet>
        { !barePage && <Nav /> }
        { this.props.children }
        { !barePage && <Footer /> }
        { !barePage && <Dialog className="cp-hero-search" isOpen={searchVisible} onClose={toggleSearch}>
          <ProfileSearch
            {...profileSearchConfig(t)}
            display="grid"
            showExamples={true} />
        </Dialog> }
      </div>
    );
  }

}

export default withNamespaces()(connect(state => {
  const pathname = state.routing.locationBeforeTransitions ? `/${state.routing.locationBeforeTransitions.pathname}` : state.location.pathname;
  return {
    barePage: pathname.includes("/cms"),
    origin: state.location.origin,
    searchVisible: state.searchVisible
  };
}, dispatch => ({
  toggleSearch: () => dispatch(toggleSearch())
}))(App));
