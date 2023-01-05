const mysql = require("mysql2");
const {Parser} = require("json2csv");
const {rollup} = require("d3-array");
const {merge} = require("d3plus-common");

const counties = require("../static/counties.json");
const countyLookup = counties.reduce((obj, c) => (obj[`${c.statefp}${c.countyfp}`] = c, obj), {});

const catcher = err => {
  console.log("MySQL Connection Error:");
  console.log(err);
};

const {CANON_AWS_DB, NODE_ENV} = process.env;

module.exports = function(app) {

  const pool = CANON_AWS_DB ? mysql.createPool(CANON_AWS_DB).promise() : false;

  const {stateFips} = app.settings.cache;

  const aggs = {
    attribute: (arr, cb) => arr.map(cb),
    attribute_description: (arr, cb) => arr.map(cb),
    last_updated: (arr, cb) => cb(arr[0]),
    tags: (arr, cb) => arr.map(cb)
      .filter(d => d !== "key")
      .join(",")
      .split(/\,[\s]{0,1}/g)
      .filter((d, i, a) => a.indexOf(d) === i),
    target_update_dt: (arr, cb) => arr.map(cb),
    vartype: (arr, cb) => arr.map(cb)
  };

  const stickies = ["year", "state", "state_fips", "county", "county_fips", "gender", "race"];
  const sorter = (a, b) => {
    const sA = stickies.indexOf(a);
    const sB = stickies.indexOf(b);
    return sA < 0 && sB < 0 ? a.localeCompare(b) : sA < 0 ? 1 : sB < 0 ? -1 : sA - sB;
  };

  app.get("/data", async(req, res) => {

    if (!pool) return res.json([]);
    const connection = await pool.getConnection().catch(catcher);
    if (!connection) return res.json([]);

    const [results, ] = await connection.query("SELECT * FROM `data_dictionary`");
    connection.release();

    const rollups = rollup(results, arr => merge(arr, aggs), d => d.tablename);

    const tables = Array.from(rollups, r => r[1])
      .sort((a, b) => a.tablename.localeCompare(b.tablename));

    return res.json(tables);

  });

  app.post("/data/:table/:format", async(req, res) => {

    if (!pool) return res.json([]);

    const {sessionId} = req.body;
    const sockets = app.get("sockets");
    const io = app.get("io");
    const socket = io.to(sockets[sessionId]);

    const connection = await pool.getConnection().catch(catcher);
    if (!connection) return res.json([]);

    const {table, format} = req.params;
    const query = `SELECT * FROM \`${table}\`${format === "json" ? " LIMIT 10" : ""}`;

    socket.emit("progress", {progress: 0});
    const [results, ] = await connection.query(query);
    connection.release();
    const total = results.length / 10000 + 3;
    socket.emit("progress", {progress: 1, total});

    for (let i = 0; i < results.length; i++) {
      const d = results[i];
      Object.keys(d).forEach(key => {
        if (key.includes("_fips")) {
          if (key.includes("state")) {
            d[key.replace("_fips", "")] = stateFips[d[key]] || "N/A";
          }
          else if (key.includes("county") && d["state_fips"]) {
            d[key.replace("_fips", "")] = d[key] === "000" ? "State Total"
              : countyLookup[`${d["state_fips"]}${d[key]}`] ? countyLookup[`${d["state_fips"]}${d[key]}`].countyname
               : "N/A";
          }
        }
      });
      if (!(i % 10000)) socket.emit("progress", {total, progress: i / 10000});
    }

    socket.emit("progress", {total, progress: results.length / 10000 + 1});

    if (format === "csv") {

      const fields = Object.keys(results[0]).sort(sorter);
      const json2csv = new Parser({fields});
      const csv = json2csv.parse(results);
      socket.emit("progress", {total, progress: results.length / 10000 + 2});

      res.header("Content-Type", "text/csv");
      res.attachment(`${table}.csv`);
      return res.send(csv).end();

    }
    else {
      return res.json(results);
    }

  });

};
