import React, {Component} from "react";
import {connect} from "react-redux";
import {Helmet} from "react-helmet-async";
import axios from "axios";

import {fetchData} from "@datawheel/canon-core";
import {Button, Card, Spinner, Tag} from "@blueprintjs/core";
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
          </div>
          <div id="data-results">
            <div className="data-results-count">Showing {results.length === tables.length ? tables.length : `${results.length} of ${tables.length}`} Tables</div>
            { results.map(table => {
              return <Card>
                <h2 className="data-result-title">{table.tablename}</h2>
                <p>{table.table_description}</p>
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
                <Button icon="th" active={table.tablename === open} onClick={this.onPreview.bind(this, table.tablename)}>Preview First 10 Rows</Button>
                <Button icon="download" onClick={this.onCSV.bind(this, table.tablename)}>Download Full CSV</Button>
                { table.tablename === open
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
