import React, {Component} from "react";
import "./SubGrouping.css";

export default class SubGrouping extends Component {
  render() {
    const {slug, heading, paragraphs, loading, stats} = this.props;

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
          </div>
          <div className="cp-subtitle-group">
            {heading}
          </div>
        </div>

      </div>
    );
  }
}
