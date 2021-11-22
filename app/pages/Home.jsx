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

    const {router, t, tabs, tesseract} = this.props;
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
              data: `${tesseract}data.jsonrecords?cube=Regions&drilldowns=County&measures=Counties`,
              groupBy: "County ID",
              label: d => d.County,
              legend: false,
              ocean: "transparent",
              on: {
                click: d => {
                  router.push(`/profile/geo/${d.County.toLowerCase().replace(/\s/g, "-")}`);
                }
              },
              shapeConfig: {
                Path: {
                  fill: "rgba(214, 220, 229, 0.3)",
                  stroke: "#d6dce5",
                  strokeWidth: 1
                }
              },
              tiles: false,
              topojson: "/topojson/capeFearCounties.json",
              topojsonId: d => d.properties.county_id,
              zoom: false
            }} />
          </div>
          <Sponsors />
        </div>
        <div className="home-intro">
          <h2>What is Healthy Cape Fear?</h2>
          <div>
            <p>
              The <b>Healthy NC 2030</b> taskforce, led by NCIOM and NCDHHS, brought together experts and leaders from multiple fields to develop a <b>common set of public health indicators and targets for the state over the next decade</b>. The full report, released in January of 2020, established a north star for localities and organizations to mobilize to accomplish North Carolina’s most pressing goals across housing, education, public health, and economic opportunity.
            </p>
            <p>
              <b>Cape Fear Collective</b> is committed to helping partner organizations set and measure local goals through its expertise in <b>data &amp; analytics</b>. Our <b>Healthy Cape Fear Dashboard</b> enables alignment of community data collection and analysis to the Healthy NC 2030 initiative in order to empower shared hypothesis generation, goal setting, and program measurement.
            </p>
          </div>
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
  tabs: state.data.home,
  tesseract: state.env.TESSERACT
}))(Home));
