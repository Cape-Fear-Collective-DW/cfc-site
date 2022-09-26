import React from "react";
import sponsors from "$app/helpers/sponsors";
import "./Sponsors.css";

const Sponsors = () => (
  <div className="site-logos">
    <div className="site-logo-block">
      Sponsored by {sponsors.map(s => (
        <a href={s.url} target="_blank">
          <img src={`/images/sponsors/${s.image}`} alt={s.name} />
        </a>
      ))}
    </div>
    <div className="site-logo-block">
      Built by <a href="https://www.datawheel.us/" target="_blank">
        <img src="/images/sponsors/datawheel.svg" />
      </a>
    </div>
    <div className="site-logo-block">
      Powered by <a href="https://capefearcollective.org/" target="_blank">
        <img src="/images/cfc-logo.png" />
      </a>
    </div>
  </div>
);

export default Sponsors;
