const mysql = require("mysql2");
const {Parser} = require("json2csv");
const {rollup} = require("d3-array");
const {merge} = require("d3plus-common");

module.exports = function(app) {

  const connection = mysql.createConnection(process.env.CANON_AWS_DB);

  const {countyFips, stateFips} = app.settings.cache;

  const prepData = d => {
    Object.keys(d).forEach(key => {
      if (key.includes("_fips")) {
        if (key.includes("state")) d[key.replace("_fips", "")] = stateFips[d[key]] || "N/A";
        if (key.includes("county")) d[key.replace("_fips", "")] = d[key] === "000" ? "State Total" : countyFips[d[key]] || "N/A";
      }
    });
    return d;
  };

  const aggs = {
    last_updated: (arr, cb) => cb(arr[0]),
    tags: (arr, cb) => arr.map(cb)
      .filter(d => d !== "key")
      .join(",")
      .split(/\,[\s]{0,1}/g)
      .filter((d, i, a) => a.indexOf(d) === i)
  };

  const stickies = ["year", "state", "state_fips", "county", "county_fips", "gender", "race"];
  const sorter = (a, b) => {
    const sA = stickies.indexOf(a);
    const sB = stickies.indexOf(b);
    return sA < 0 && sB < 0 ? a.localeCompare(b) : sA < 0 ? 1 : sB < 0 ? -1 : sA - sB;
  };

  app.get("/data", async(req, res) => {

    connection.query("SELECT * FROM `data_dictionary`", (err, results) => {
      const rollups = rollup(results, arr => merge(arr, aggs), d => d.tablename);
      const tables = Array.from(rollups, r => r[1])
        .sort((a, b) => a.tablename.localeCompare(b.tablename));
      return res.json(tables);
    });

  });

  app.get("/data/:table/:format", async(req, res) => {

    const {table, format} = req.params;

    if (format === "csv") {

      connection.query(`SELECT * FROM \`${table}\``, (err, results) => {
        const data = results.map(prepData);
        const fields = Object.keys(data[0]).sort(sorter);
        const json2csv = new Parser({fields});
        const csv = json2csv.parse(data);
        res.header('Content-Type', 'text/csv');
        res.attachment(`${table}.csv`);
        return res.send(csv);
      });

    }
    else {

      connection.query(`SELECT * FROM \`${table}\` LIMIT 10`, (err, results) => {
        const data = results.map(prepData);
        return res.json(data);
      });

    }

  });

};
