const mysql = require("mysql2");
const {Parser} = require("json2csv");

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

  app.get("/data", async(req, res) => {

    connection.query("SELECT tags, attribute_description, tablename, geography, region, vintage, source, notes FROM `data_dictionary` GROUP BY tablename", (err, results) => {
      return res.json(results);
    });

  });

  app.get("/data/:table/:format", async(req, res) => {

    const {table, format} = req.params;

    if (format === "csv") {

      connection.query(`SELECT * FROM \`${table}\``, (err, results) => {
        const data = results.map(prepData);
        const fields = Object.keys(data[0]);
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
