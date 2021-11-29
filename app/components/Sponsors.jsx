import React from "react";
import sponsors from "$app/helpers/sponsors";
import "./Sponsors.css";

const Sponsors = () => (
  <div className="sponsors">
    <div className="sponsor-block">
      Sponsored by {sponsors.map(s => (
        <a href={s.url} target="_blank">
          <img src={`/images/sponsors/${s.image}`} />
        </a>
      ))}
    </div>
    <div className="sponsor-block">
      Built by <a href="https://www.datawheel.us/" target="_blank">
        <img src="/images/sponsors/datawheel.svg" />
      </a>
    </div>
    <div className="sponsor-block">
      Powered by <a href="https://capefearcollective.org/" target="_blank">
        <img src="/images/cfc-logo.png" />
      </a>
    </div>
  </div>
);

export default Sponsors;
