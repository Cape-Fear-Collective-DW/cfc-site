import React, {Component} from "react";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import {Geomap} from "d3plus-react";
import {ProfileSearch} from "@datawheel/canon-cms";
import profileSearchConfig from "$app/helpers/search";
import Sponsors from "$app/components/Sponsors";
import ProfileTiles from "$app/cms/sections/ProfileTiles";
import "./Home.css";

class Home extends Component {

  render() {

    const {router, t, tesseract} = this.props;

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
                  fill: d => `rgba(214, 220, 229, ${d.properties ? 0.3 : 0.75})`,
                  stroke: "#d6dce5",
                  strokeWidth: 1
                }
              },
              tiles: false,
              topojson: "/topojson/ncCounties.json",
              topojsonId: d => d.properties.GEOID,
              zoom: false
            }} />
          </div>
          <Sponsors />
        </div>
        <div className="home-intro">
          <h2>What is Healthy Communities NC?</h2>
          <div>
            <p>
              The <b>Healthy NC 2030</b> taskforce, led by NCIOM and NCDHHS, brought together experts and leaders from multiple fields to develop a <b>common set of public health indicators and targets for the state over the next decade</b>. The full report, released in January of 2020, established a north star for localities and organizations to mobilize to accomplish North Carolina’s most pressing goals across housing, education, public health, and economic opportunity.
            </p>
            <p>
              <b>Cape Fear Collective</b> is committed to helping partner organizations set and measure local goals through its expertise in <b>data &amp; analytics</b>. Our <b>Healthy Communities NC Dashboard</b> enables alignment of community data collection and analysis to the Healthy NC 2030 initiative in order to empower shared hypothesis generation, goal setting, and program measurement.
            </p>
          </div>
        </div>
        <ProfileTiles />
      </div>
    );
  }

}

Home.need = [
  ProfileTiles
];

export default withNamespaces()(connect(state => ({
  tesseract: state.env.TESSERACT
}))(Home));
