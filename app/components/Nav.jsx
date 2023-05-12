import React, {Component} from "react";
import {Link} from "react-router";
import throttle from "@datawheel/canon-cms/src/utils/throttle";
import stripP from "@datawheel/canon-cms/src/utils/formatters/stripP";
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

  scrollTop = () => {
    window.scroll({top: 0, left: 0, behavior: "smooth"});
  };

  render() {

    const {homePage, profile, profilePage, searchVisible, toggleSearch} = this.props;
    const {scrolled} = this.state;

    let title = null;
    if (profile && profile.sections && profile.sections.length) {
      title = `${stripP(profile.sections[0].title)} ${stripP(profile.sections[0].subtitles[0].subtitle)}`;
    }

    return (
      <nav className={`site-nav ${(!homePage && !profilePage) || scrolled ? "background" : ""}`}>
        <Link className={`logo ${(!homePage || scrolled) ? "visible" : ""}`} to="/">
          <img src="/images/hcnc-logo.svg" />
        </Link>
        { profilePage && title ? <div onClick={this.scrollTop} className={`nav-profile-title ${scrolled ? "visible" : ""}`}>{title}</div> : null}
        <Icon icon={searchVisible ? "cross" : "search"} size={20} onClick={toggleSearch} />
      </nav>
    );
  }

}

export default connect(state => {
  const pathname = state.routing.locationBeforeTransitions ? `/${state.routing.locationBeforeTransitions.pathname}` : state.location.pathname;
  return {
    homePage: pathname === "//" || pathname === "/",
    profile: state.data.profile,
    profilePage: pathname.includes("profile/"),
    searchVisible: state.searchVisible
  };
}, dispatch => ({
  toggleSearch: () => dispatch(toggleSearch())
}))(Nav);
