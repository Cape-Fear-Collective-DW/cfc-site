const mysql = require("mysql2");

module.exports = function(app) {

  const connection = mysql.createConnection(process.env.CANON_AWS_DB);

  app.get("/data", async(req, res) => {

    connection.query("SELECT tags, attribute_description, tablename, geography, region, vintage, source, notes FROM `data_dictionary` GROUP BY tablename", (err, results) => {
      res.json(results);
    });

  });

  app.get("/data/:table", async(req, res) => {

    const {table} = req.params;

    connection.query(`SELECT * FROM \`${table}\` LIMIT 100`, (err, results) => {
      res.json(results);
    });

  });

};
