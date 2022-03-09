import React, {Component} from "react";
import {connect} from "react-redux";
import {Helmet} from "react-helmet-async";
import axios from "axios";

import {fetchData} from "@datawheel/canon-core";
import {Button, Callout, Card, Collapse, Elevation, Spinner, Tag} from "@blueprintjs/core";
import "./Data.css";

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
      open: false,
      preview: false,
      results: props.tables
    }
  }

  onFilter(e) {

    const query = e.target.value.toLowerCase();
    const {tables} = this.props;
    const {fields} = this.state;

    const filteredTables = tables.filter(t => {
      return fields.some(k => t[k] instanceof Array
        ? t[k].some(s => s.toLowerCase().includes(query))
        : t[k].toLowerCase().includes(query));
    })

    this.setState({results: filteredTables});

  }

  onPreview(tablename) {

    if (tablename === this.state.open) {
      this.setState({preview: false, open: false});
    }
    else {
      this.setState({preview: false, open: tablename});
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

  render() {

    const {open, preview, results} = this.state;
    const {tables} = this.props;
    const title = "Data Library";

    return (
      <div id="data">
        <Helmet title={title} />
        <h1 className="data-title">{title}</h1>
        <input className="bp3-input" onChange={this.onFilter.bind(this)} placeholder="Search" />
        <Callout>Showing {results.length === tables.length ? tables.length : `${results.length} of ${tables.length}`} Tables</Callout>
        { results.map(table => {
          return <Card elevation={Elevation.TWO}>
            <h2>{table.tablename}</h2>
            <div className="card-content">
              <table className="meta-table bp3-html-table bp3-html-table-condensed">
                <thead>
                  <tr>
                    <th colSpan={2}>Meta Information</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Region</td>
                    <td>{table.region}</td>
                  </tr>
                  <tr>
                    <td>Geographical Resolution</td>
                    <td>{table.geography}</td>
                  </tr>
                  <tr>
                    <td>Time Resolution</td>
                    <td>{table.vintage}</td>
                  </tr>
                  <tr>
                    <td>Source</td>
                    <td>{table.source}</td>
                  </tr>
                  <tr>
                    <td>Tags</td>
                    <td>{table.tags.map(t => <Tag>{t}</Tag>)}</td>
                  </tr>
                </tbody>
              </table>
              <table className="bp3-html-table bp3-html-table-condensed bp3-html-table-striped attribute-table">
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
                      <td>{table.attribute_description[i]}</td>
                      <td>{table.vartype[i]}</td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            { table.notes && <Callout title="Note">
              {table.notes}
            </Callout> }
            <Button icon="th" active={table.tablename === open} onClick={this.onPreview.bind(this, table.tablename)}>Preview First 10 Rows</Button>
            <Button icon="download" onClick={this.onCSV.bind(this, table.tablename)}>Download Full CSV</Button>
            <Collapse isOpen={table.tablename === open}>
              { preview ? <table className="bp3-html-table">
                  <thead>
                    <tr>
                      {Object.keys(preview[0]).sort(sorter).map(k => <th key={k}>{k}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    { preview.map((d, i) => <tr key={i}>
                      {Object.keys(d).sort(sorter).map((k, j) => <td key={`${k}_${j}`}>{d[k]}</td>)}
                      </tr>) }
                  </tbody>
                </table> : <Spinner /> }
            </Collapse>
          </Card>;
        })}
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
