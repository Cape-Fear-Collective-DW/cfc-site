import React from "react";
import {Link} from "react-router";
import "./Footer.css";

const Footer = props =>
  <footer>
    <Link className="footer-logo" to="/">
      <img src="/images/cfc-logo.png" />
    </Link>
    <div className="footer-links">
      <Link className="footer-link" to="/">home</Link>
      <a className="footer-link" href="https://capefearcollective.org/about/" target="_blank">about</a>
      <a className="footer-link" href="https://capefearcollective.org/contact/" target="_blank">contact us</a>
    </div>
  </footer>;

export default Footer;
