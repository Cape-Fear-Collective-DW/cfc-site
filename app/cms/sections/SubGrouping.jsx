import React, {Component} from "react";
import "./SubGrouping.css";
import Data from "$app/pages/Data";

import stripP from "@datawheel/canon-cms/src/utils/formatters/stripP";
import {Button, Drawer, DrawerSize, Position} from "@blueprintjs/core";

const databaseTags = {
  "poverty": [
    "poverty", "income", "employment", "economy"
  ],
  "unemployment": [
    "unemployment", "employment", "workforce", "income", "economy"
  ],
  "short-term-suspension": [
    "suspensions", "attainment", "attendance", "students", "teachers", "education", "childhood"
  ],
  "incarceration": [
    "incarceration", "justice", "crime", "safety", "justice", "civics"
  ],
  "adverse-childhood-experiences": [
    "ACEs", "education", "enrollment", "childhood", "education"
  ],
  "third-grade-reading-proficiency": [
    "reading", "math", "attainment", "schools", "education", "childhood"
  ],
  "access-to-exercise-opportunities": [
    "exercise", "obesity", "prevention", "chronic disease", "health"
  ],
  "limited-access-to-healthy-foods": [
    "food access", "food desert", "nutrition", "food", "health"
  ],
  "severe-housing-problems": [
    "housing problems", "affordability", "utility", "cost burden", "housing"
  ],
  "drug-overdose-deaths": [
    "overdose deaths", "addiction", "substance abuse", "mortality", "health"
  ],
  "tobacco-use": [
    "tobacco", "addiction", "substance abuse", "alcohol", "mortality", "health"
  ],
  "excessive-drinking": [
    "drinking", "alcohol", "addiction", "smoking", "substance abuse", "health"
  ],
  "sugar-sweetened-beverage-consumption": [
    "nutrition", "obesity", "food access", "food", "life expectancy", "health"
  ],
  "hiv-diagnosis": [
    "hiv", "sexually transmitted", "sexual health", "insurance", "mortality", "health"
  ],
  "teen-birth": [
    "teen birth", "pregnancy", "prenatal care", "sexual health", "care providers", "health"
  ],
  "uninsured": [
    "uninsured", "insurance coverage", "insurance", "unemployment", "preventative medicine", "health"
  ],
  "primary-care-workforce": [
    "primary care", "care providers", "preventative medicine", "health care practitioners", "health"
  ],
  "early-prenatal-care": [
    "prenatal care", "pregnancy", "infant health", "infant mortality", "low birthweight", "health"
  ],
  "suicide-rate": [
    "suicide", "mortality", "mental health", "preventative medicine", "health"
  ],
  "infant-mortality": [
    "infant mortality", "infant health", "prenatal care", "pregnancy", "low birthweight", "health"
  ],
  "life-expectancy": [
    "life expectancy", "mortality", "care providers", "social vulnerability", "preventative medicine", "health"
  ]
};

export default class SubGrouping extends Component {

  constructor(props) {
    super(props);
    this.state = {
      datasetsOpen: false
    };
  }

  onDatasetToggle() {
    const {datasetsOpen} = this.state;
    this.setState({datasetsOpen: !datasetsOpen});
  }

  render() {

    const {datasetsOpen} = this.state;
    const {contents, slug, heading, paragraphs, loading, stats, title} = this.props;

    const keywords = databaseTags[slug];
    const proxyExists = contents.subtitles.length > 0;

    const DataButton = keywords
      ? <Button className="dataset-button" icon="layers" onClick={this.onDatasetToggle.bind(this)}>
        See Related Datasets
      </Button> : null;

    return (
      <div
        className={`cp-section-inner cp-sub-grouping-section-inner cp-${slug}-section-inner ${loading ? "is-loading" : ""}`}
        ref={comp => this.section = comp}
      >
        {/* sidebar */}
        <div className="cp-section-content cp-sub-grouping-section-caption">
          {stats}
          <div className="cp-paragraph-group">
            {paragraphs}
            { !proxyExists ? DataButton : null }
          </div>
          <div className="cp-subtitle-group">
            {heading}
            { proxyExists ? DataButton : null }
          </div>
        </div>
        <Drawer
          isOpen={datasetsOpen}
          onClose={this.onDatasetToggle.bind(this)}
          position={Position.BOTTOM}
          size={DrawerSize.LARGE}
        >
          <Data keywords={keywords} title={`Datasets Related to ${stripP(title)}`} />
          <Button large={true} minimal={true} className="close-button" icon="cross" onClick={this.onDatasetToggle.bind(this)} />
        </Drawer>
      </div>
    );
  }

}
