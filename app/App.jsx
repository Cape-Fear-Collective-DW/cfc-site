import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import {connect} from "react-redux";
import Nav from "./components/Nav";
import {ProfileSearch} from "@datawheel/canon-cms";
import profileSearchConfig from "$app/helpers/search";
import "./App.css";

class App extends Component {

  render() {

    const {searchVisible, t} = this.props;

    return (
      <div>
        <Nav />
        { this.props.children }
        { searchVisible
          ? <div
            className={`global-search ${searchVisible ? "is-visible" : "is-hidden"}`}
            aria-hidden={!searchVisible}
            tabIndex={searchVisible ? undefined : -1}>
              <ProfileSearch
                {...profileSearchConfig(t)}
                display="grid"
                showExamples={true} />
          </div>
          : null }
      </div>
    );
  }

}

export default withNamespaces()(connect(state => ({
  searchVisible: state.searchVisible
}))(App));
