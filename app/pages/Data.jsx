import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {Helmet} from "react-helmet-async";
import { io } from "socket.io-client";
import {uuid} from "d3plus-common";
import axios from "axios";

import {AnchorButton, Button, Card, Spinner, Tag} from "@blueprintjs/core";
import {merge} from "d3-array";
import styles from "style.yml";
const navHeight = parseFloat(styles["nav-height"]);
import "./Data.css";

const categories = [
  {
    title: "Economy",
    tags: ["Business & Industry", "Employment", "Income", "Poverty"]
  },
  {
    title: "Education & Childhood",
    tags: ["Attainment", "Schools", "Students", "Teachers"]
  },
  {
    title: "Demographics & Geography",
    tags: ["Clusters", "Geography", "Population"]
  },
  {
    title: "Transportation",
    tags: ["Mobility", "Public Transit"]
  },
  {
    title: "Housing",
    tags: ["Affordability", "Housing Problems", "Inventory", "Rent & Ownership"]
  },
  {
    title: "Justice & Civics",
    tags: ["Crime & Safety", "Elections", "Incarceration", "Justice", "Participation"]
  },
  {
    title: "Environment",
    tags: ["Air", "Climate", "Land & Parks", "Water"]
  },
  {
    title: "Social Support",
    tags: ["Food Stamps", "Foster Care", "Single Parent", "Social Vulnerability"]
  },
  {
    title: "Health",
    tags: ["Addiction & Substance Abuse", "COVID & Vaccinations", "Chronic Disease", "Disability", "Health Care Practitioners", "Insurance", "Life Expectancy & Mortality", "Nutrition", "Pregnancy & Prenatal Care"]
  }
];

const stickies = ["year", "state", "state_fips", "county", "county_fips", "gender", "race"];
const sorter = (a, b) => {
  const sA = stickies.indexOf(a);
  const sB = stickies.indexOf(b);
  return sA < 0 && sB < 0 ? a.localeCompare(b) : sA < 0 ? 1 : sB < 0 ? -1 : sA - sB;
};

class Data extends Component {

  constructor(props) {
    super(props);
    this.state = {
      csvProgress: false,
      fields: props.tables.length ? Object.keys(props.tables[0]) : [],
      filters: [],
      keywords: props.keywords,
      openFilters: [],
      openTables: [],
      preview: false,
      previewTable: false,
      query: "",
      results: props.tables,
      title: props.title || "Community Data Platform"
    }
  }

  componentDidMount() {
    const {keywords} = this.state;
    if (keywords) this.setState({filters: keywords}, this.onFilter.bind(this, false));
  }

  onFilter(e) {

    const query = e ? e.target.value.toLowerCase() : this.state.query;
    let results = this.props.tables.slice();
    const {fields, filters} = this.state;

    if (query.length) {

      results = results.filter(t => {
        return fields.some(k => t[k] instanceof Array
          ? t[k].some(s => s.toLowerCase().includes(query))
          : t[k].toLowerCase().includes(query));
      });

    }

    if (filters.length) {
      const tags = merge(filters.map(f => f.split(" & ").map(d => d.toLowerCase())));
      results = results
        .filter(r => r.tags.some(t => tags.includes(t)))
        .sort((a, b) => {
          const aIndex = tags.findIndex(t => a.tags.includes(t));
          const bIndex = tags.findIndex(t => b.tags.includes(t));
          return aIndex - bIndex;
        });
    }

    const container = document.getElementById("data-container");
    const top = container.getBoundingClientRect().top;
    if (top < navHeight) window.scrollTo(0, container.offsetTop - navHeight);

    this.setState({results, query});

  }

  onPreview(tablename) {

    if (tablename === this.state.previewTable) {
      this.setState({preview: false, previewTable: false});
    }
    else {
      this.setState({preview: false, previewTable: tablename});
      axios.post(`/data/${tablename}/json`)
        .then(resp => this.setState({preview: resp.data}));
    }
  }

  onCSV(tablename) {

    const socket = io();
    const sessionId = uuid();
    this.setState({csvProgress: false});
    socket.emit('init', sessionId);
    socket.on('progress', data => {
      this.setState({csvProgress: data});
    });
    socket.on('init', () => {
      axios.post(`/data/${tablename}/csv`, {sessionId: sessionId}, {responseType: "blob"})
        .then(resp => {

          const href = URL.createObjectURL(resp.data);

          const a = document.createElement("a");
          a.href = href;
          a.download = `${tablename}.csv`;
          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
          URL.revokeObjectURL(href);

          this.setState({csvProgress: false});
          socket.disconnect();

        });
    });

  }

  toggleFilters(filter) {

    const filters = this.state.filters.slice();
    const i = filters.indexOf(filter);

    if (i >= 0) filters.splice(i, 1);
    else filters.push(filter);

    this.setState({filters}, this.onFilter.bind(this, false));

  }

  toggleOpenFilters(tablename) {

    const openFilters = this.state.openFilters.slice();
    const i = openFilters.indexOf(tablename);

    if (i >= 0) openFilters.splice(i, 1);
    else openFilters.push(tablename);

    this.setState({openFilters});

  }

  toggleOpenTables(tablename) {

    const openTables = this.state.openTables.slice();
    const i = openTables.indexOf(tablename);

    if (i >= 0) openTables.splice(i, 1);
    else openTables.push(tablename);

    this.setState({openTables});

  }

  render() {

    const {csvProgress, filters, keywords, openFilters, openTables, preview, previewTable, results, title} = this.state;
    const {tables} = this.props;

    return (
      <div id="data">
        { !keywords ? <Helmet title={title} /> : null }
        <h1 className="data-title">{title}</h1>
        { keywords
          ? <AnchorButton className="data-page-link" href="/community-data" rightIcon="chevron-right">
              Explore All Datasets
            </AnchorButton>
          : <p className="data-intro">
              Our Community Data Platform (CDP) is a cloud-based AWS MySQL database containing over 1,000 up-to-date and localized metrics from publicly available sources, regional anchor institutions, and our partner organizations through data usage agreements. This platform is a core component of our commitment and mission to democratize data, enabling data-driven goals, shared measurement, and alignment of community resources.
            </p> }
        <div id="data-container">
          { !keywords ? <div id="data-filters">
            <div className="bp3-input-group bp3-large">
              <span className="bp3-icon bp3-icon-search"></span>
              <input type="text" className="bp3-input" onChange={this.onFilter.bind(this)} />
            </div>
            <div className="data-filters-list">
              <h2 className="data-filters-list-title">Filter by Category</h2>
              { categories.map(({title, tags}, i) => <ul key={i}>
                <div className="data-filters-list-category" onClick={filters.some(f => tags.includes(f)) ? null : this.toggleOpenFilters.bind(this, i)}>
                  { title }
                  { filters.some(f => tags.includes(f)) ? null : <Button small icon={openFilters.includes(i) ? "minus" : "plus"} />}
                </div>
                { openFilters.includes(i) || filters.some(f => tags.includes(f)) ? tags.map(t =>
                  <li key={t} onClick={this.toggleFilters.bind(this, t)} className={filters.includes(t) ? "active" : ""}>{t}</li>
                ) : false }
              </ul>)}
            </div>
          </div> : null }
          <div id="data-results">
            { keywords
              ? <div className="data-results-count">Showing {results.length} Tables containing the following tags: {keywords.map(k => <Tag key={k}>{k}</Tag>)}</div>
              : <div className="data-results-count">Showing {results.length === tables.length ? tables.length : `${results.length} of ${tables.length}`} Tables</div>
            }
            { results.map(table => {
              return <Card>
                <div className="data-result-header">
                  <div className="data-result-header-text">
                    <h2 id={table.tablename} className="data-result-title">
                      <a href={`#${table.tablename}`}>{table.tablename}</a>
                    </h2>
                    <p>{table.table_description}</p>
                  </div>
                  <div className="data-result-header-button">
                    <Button icon={openTables.includes(table.tablename) ? "minus" : "plus"} onClick={this.toggleOpenTables.bind(this, table.tablename)} />
                  </div>
                </div>
                { openTables.includes(table.tablename)
                  ? <Fragment>
                      <table className="bp3-html-table bp3-html-table-condensed meta-table">
                        <thead>
                          <tr>
                            <th colSpan={4}>Meta Information</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="bp3-heading">Region</td>
                            <td>{table.region}</td>
                            <td rowSpan={3} className="bp3-heading" rowSpan={3}>Source</td>
                            <td rowSpan={3}>{table.source}</td>
                          </tr>
                          <tr>
                            <td className="bp3-heading">Geographical Resolution</td>
                            <td>{table.geography}</td>
                          </tr>
                          <tr>
                            <td className="bp3-heading">Time Resolution</td>
                            <td>{table.vintage}</td>
                          </tr>
                          <tr>
                            <td className="bp3-heading">Tags</td>
                            <td colSpan={3}>{table.tags.map(t => <Tag>{t}</Tag>)}</td>
                          </tr>
                          { table.notes && <tr>
                            <td className="bp3-heading">Note</td>
                            <td colSpan={3} dangerouslySetInnerHTML={{__html: table.notes.replace(/_/g, "_<wbr/>")}} />
                          </tr> }
                        </tbody>
                      </table>
                      <div className="data-table-container">
                        <table className="bp3-html-table bp3-html-table-condensed attribute-table">
                          <thead>
                            <tr>
                              <th>Column</th>
                              <th>Description</th>
                              <th>Data Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            { table.attribute.map((a, i) => <tr key={a}>
                                <td>{a}</td>
                                <td className="wrap">{table.attribute_description[i]}</td>
                                <td>{table.vartype[i]}</td>
                              </tr>)}
                          </tbody>
                        </table>
                      </div>
                      <Button icon="th" active={table.tablename === previewTable} onClick={this.onPreview.bind(this, table.tablename)}>Preview First 10 Rows</Button>
                      <Button icon={csvProgress ? <Spinner size={16} value={csvProgress.progress && csvProgress.total ? csvProgress.progress / csvProgress.total : undefined} /> : "download"} disabled={csvProgress} onClick={this.onCSV.bind(this, table.tablename)}>Download Full CSV</Button>
                      { table.tablename === previewTable
                        ? <div className="data-table-container">
                          { preview ? <table className="bp3-html-table">
                          <thead>
                            <tr>
                              {
                                Object.keys(preview[0])
                                  .sort(sorter)
                                  .map(k => <th key={k} dangerouslySetInnerHTML={{__html: k.replace(/_/g, "_<wbr/>")}} />)
                              }
                            </tr>
                          </thead>
                          <tbody>
                            { preview.map((d, i) => <tr key={i}>
                              { Object.keys(d).sort(sorter).map((k, j) => <td key={`${k}_${j}`}>{d[k]}</td>) }
                              </tr>) }
                          </tbody>
                        </table> : <Spinner /> }
                        </div>
                      : null }
                  </Fragment> : null}
              </Card>;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  tables: state.data.tables
}))(Data);
