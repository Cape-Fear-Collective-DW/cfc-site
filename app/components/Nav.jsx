import React, {Component} from "react";
import {Link} from "react-router";
import throttle from "@datawheel/canon-cms/src/utils/throttle";
import {connect} from "react-redux";
import {Icon} from "@blueprintjs/core";
import {toggleSearch} from "$app/actions/search";
import "./Nav.css";

class Nav extends Component {

  constructor(props) {
    super(props);
    this.state = {scrolled: false};
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    throttle(() => {
      const screenTop = window.pageYOffset;
      const newScrolled = screenTop > 100;
      if (newScrolled !== this.state.scrolled) {
        this.setState({scrolled: newScrolled});
      }
    }, 50);
  };

  render() {

    const {homePage, searchVisible, toggleSearch} = this.props;
    const {scrolled} = this.state;

    return (
      <nav className={`site-nav ${scrolled ? "background" : ""}`}>
        <Link className={`logo ${(!homePage || scrolled) ? "visible" : ""}`} to="/">
          <img src="/images/hfc-logo.svg" />
        </Link>
        <Icon icon={searchVisible ? "cross" : "search"} size={20} onClick={toggleSearch} />
      </nav>
    );
  }

}

export default connect(state => {
  const pathname = state.routing.locationBeforeTransitions ? `/${state.routing.locationBeforeTransitions.pathname}` : state.location.pathname;
  console.log(state.routing, state.location, pathname);
  return {
    homePage: pathname === "//",
    searchVisible: state.searchVisible
  };
}, dispatch => ({
  toggleSearch: () => dispatch(toggleSearch())
}))(Nav);
