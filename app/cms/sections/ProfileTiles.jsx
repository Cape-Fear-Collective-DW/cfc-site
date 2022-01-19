import React, {Component} from "react";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import {fetchData} from "@datawheel/canon-core";
import {Icon} from "@blueprintjs/core";
import "./ProfileTiles.css";

class ProfileTiles extends Component {

  constructor(props) {
    super(props);
    this.state = {currentTab: 0};
  }

  render() {

    const {tabs} = this.props;
    const {currentTab} = this.state;

    return (
      <div className="profile-tiles cms-profilesearch">
        <ul className="profile-tile-tabs">
          {tabs.map((tab, i) => (
            <li key={i} className={`profile-tile-tab ${i === currentTab ? "selected" : ""}`} onClick={() => this.setState({currentTab: i})}>
              <Icon icon={tab.icon} size={26} />
              <span dangerouslySetInnerHTML={{__html: tab.title}} />
            </li>
          ))}
        </ul>
        <ul className="profile-tile-grid cms-profilesearch-grid">
          {tabs[currentTab].tiles.map((tile, i) => (
            <li key={i} className="cms-profilesearch-tile">
              { tile.url
              ? <a href={tile.url} className="cms-profilesearch-tile-link">
                <div className="cms-profilesearch-tile-link-text">
                  <div className="cms-profilesearch-tile-link-title heading u-font-lg" dangerouslySetInnerHTML={{__html: tile.title}} />
                  <div className="cms-profilesearch-tile-link-sub u-margin-top-xs u-font-xs" dangerouslySetInnerHTML={{__html: tile.subtitle}} />
                </div>
              </a>
                : <a className="cms-profilesearch-tile-link">
                  <div className="cms-profilesearch-tile-link-text">
                    <div className="cms-profilesearch-tile-banner heading u-font-xl">Coming Soon</div>
                    <div className="cms-profilesearch-tile-link-title heading u-font-lg" dangerouslySetInnerHTML={{__html: tile.title}} />
                    <div className="cms-profilesearch-tile-link-sub u-margin-top-xs u-font-xs" dangerouslySetInnerHTML={{__html: tile.subtitle}} />
                  </div>
                </a> }
              <div className="cms-profilesearch-tile-image-container">
                <div className="cms-profilesearch-tile-image" style={{backgroundImage: `url("${tile.image}")`}} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

}

ProfileTiles.need = [
  fetchData("tiles", "/tiles?id=<id>")
];

export default withNamespaces()(connect(state => ({
  tabs: state.data.tiles
}))(ProfileTiles));
