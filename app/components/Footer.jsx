import React from "react";
import {Link} from "react-router";
import Sponsors from "$app/components/Sponsors";
import "./Footer.css";

const Footer = props =>
  <footer>
    <Sponsors />
    <Link className="footer-logo" to="/">
      <img src="/images/cfc-logo.png" />
    </Link>
    <div className="footer-links">
      <Link className="footer-link" to="/">home</Link>
      <Link className="footer-link" to="/community-data">data</Link>
      <a className="footer-link" href="https://capefearcollective.org/about/" target="_blank">about</a>
      <a className="footer-link" href="https://capefearcollective.org/contact/" target="_blank">contact us</a>
    </div>
  </footer>;

export default Footer;
