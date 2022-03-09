const mysql = require("mysql2");

module.exports = function(app) {

  const connection = mysql.createConnection(process.env.CANON_AWS_DB);

  const {countyFips, stateFips} = app.settings.cache;

  const prepData = d => {
    Object.keys(d).forEach(key => {
      if (key.includes("_fips")) {
        if (key.includes("state")) d[key.replace("_fips", "")] = stateFips[d[key]] || "State Total";
        if (key.includes("county")) d[key.replace("_fips", "")] = countyFips[d[key]] || "N/A";
      }
    });
    return d;
  };

  app.get("/data", async(req, res) => {

    connection.query("SELECT tags, attribute_description, tablename, geography, region, vintage, source, notes FROM `data_dictionary` GROUP BY tablename", (err, results) => {
      res.json(results);
    });

  });

  app.get("/data/:table", async(req, res) => {

    const {table} = req.params;

    connection.query(`SELECT * FROM \`${table}\` LIMIT 10`, (err, results) => {
      res.json(results.map(prepData));
    });

  });

};
