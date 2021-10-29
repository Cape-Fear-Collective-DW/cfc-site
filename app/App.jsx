import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import {connect} from "react-redux";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import {ProfileSearch} from "@datawheel/canon-cms";
import profileSearchConfig from "$app/helpers/search";
import {Dialog} from "@blueprintjs/core";
import {toggleSearch} from "$app/actions/search";
import "./App.css";

class App extends Component {

  render() {

    const {searchVisible, t, toggleSearch} = this.props;

    return (
      <div>
        <Nav />
        { this.props.children }
        <Footer />
        <Dialog className="cp-hero-search" isOpen={searchVisible} onClose={toggleSearch}>
          <ProfileSearch
            {...profileSearchConfig(t)}
            display="grid"
            showExamples={true} />
        </Dialog>
      </div>
    );
  }

}

export default withNamespaces()(connect(state => ({
  searchVisible: state.searchVisible
}), dispatch => ({
  toggleSearch: () => dispatch(toggleSearch())
}))(App));
