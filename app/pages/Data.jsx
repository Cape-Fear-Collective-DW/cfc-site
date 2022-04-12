import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {Helmet} from "react-helmet-async";
import axios from "axios";

import {fetchData} from "@datawheel/canon-core";
import {Button, Card, Spinner, Tag} from "@blueprintjs/core";
import {merge} from "d3-array";
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
      fields: Object.keys(props.tables[0]),
      filters: [],
      openFilters: [],
      openTables: [],
      preview: false,
      previewTable: false,
      query: "",
      results: props.tables
    }
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
      results = results.filter(r => r.tags.some(t => tags.includes(t)));
    }

    this.setState({results, query});

  }

  onPreview(tablename) {

    if (tablename === this.state.previewTable) {
      this.setState({preview: false, previewTable: false});
    }
    else {
      this.setState({preview: false, previewTable: tablename});
      axios.get(`/data/${tablename}/json`)
        .then(resp => this.setState({preview: resp.data}));
    }
  }

  onCSV(tablename) {

    const a = document.createElement("a");
    a.href = `/data/${tablename}/csv`;
    a.download = `${tablename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

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

    const {filters, openFilters, openTables, preview, previewTable, results} = this.state;
    const {tables} = this.props;
    const title = "Community Data Platform";

    return (
      <div id="data">
        <Helmet title={title} />
        <h1 className="data-title">{title}</h1>
        <div id="data-container">
          <div id="data-filters">
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
          </div>
          <div id="data-results">
            <div className="data-results-count">Showing {results.length === tables.length ? tables.length : `${results.length} of ${tables.length}`} Tables</div>
            { results.map(table => {
              return <Card>
                <div className="data-result-header">
                  <div className="data-result-header-text">
                    <h2 className="data-result-title">{table.tablename}</h2>
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
                      <Button icon="download" onClick={this.onCSV.bind(this, table.tablename)}>Download Full CSV</Button>
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


Data.need = [
  fetchData("tables", "/data")
];

export default connect(state => ({
  tables: state.data.tables
}))(Data);
