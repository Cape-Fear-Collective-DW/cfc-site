import React, {Component} from "react";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import {Geomap} from "d3plus-react";
import {fetchData} from "@datawheel/canon-core";
import {ProfileSearch} from "@datawheel/canon-cms";
import {Icon} from "@blueprintjs/core";
import profileSearchConfig from "$app/helpers/search";
import Sponsors from "$app/components/Sponsors";
import "./Home.css";

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {currentTab: 0};
  }

  render() {

    const {t, tabs} = this.props;
    const {currentTab} = this.state;

    return (
      <div id="Home">
        <div className="home-splash">
          <div className="home-splash-image"></div>
          <div className="home-splash-content">
            <img className="home-splash-logo" src="/images/hfc-logo.svg" />
            <ProfileSearch
              {...profileSearchConfig(t)}
              display="list"
              inputFontSize="lg"
              placeholder={t("CMS.Search.Search profiles")}
              position="absolute"
              showExamples={true} />
          </div>
          <div className="home-splash-map">
            <Geomap config={{
              ocean: "transparent",
              shapeConfig: {
                Path: {
                  fill: "rgba(214, 220, 229, 0.3)",
                  stroke: "#d6dce5",
                  strokeWidth: 1
                }
              },
              tiles: false,
              topojson: "/topojson/capeFearCounties.json",
              zoom: false
            }} />
          </div>
          <Sponsors />
        </div>
        <div className="home-intro">
          <h2>What is Healthy Cape Fear?</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae auctor justo, eget viverra risus. Proin et mattis nisi, tincidunt tristique felis. Ut a massa lacus. Fusce a lacus vitae mauris tempus euismod in eget tellus. Proin scelerisque faucibus nulla, vel mollis arcu tincidunt sed. Morbi at massa ut mauris tincidunt tempor at sit amet lectus.
          </p>
        </div>
        <div className="home-tiles cms-profilesearch">
          <ul className="home-tile-tabs">
            {tabs.map((tab, i) => (
              <li key={i} className={`home-tile-tab ${i === currentTab ? "selected" : ""}`} onClick={() => this.setState({currentTab: i})}>
                <Icon icon={tab.icon} size={26} />
                <span dangerouslySetInnerHTML={{__html: tab.title}} />
              </li>
            ))}
          </ul>
          <ul className="home-tile-grid cms-profilesearch-grid">
            {tabs[currentTab].tiles.map((tile, i) => (
              <li key={i} className="cms-profilesearch-tile">
                <a href={tile.url} className="cms-profilesearch-tile-link">
                  <div className="cms-profilesearch-tile-link-text">
                    <div className="cms-profilesearch-tile-link-title heading u-font-lg" dangerouslySetInnerHTML={{__html: tile.title}} />
                    <div className="cms-profilesearch-tile-link-sub u-margin-top-xs u-font-xs" dangerouslySetInnerHTML={{__html: tile.subtitle}} />
                  </div>
                </a>
                <div className="cms-profilesearch-tile-image-container">
                  <div className="cms-profilesearch-tile-image" style={{backgroundImage: `url("${tile.image}")`}} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

}

Home.need = [
  fetchData("home", "/home")
];

export default withNamespaces()(connect(state => ({
  tabs: state.data.home
}))(Home));
