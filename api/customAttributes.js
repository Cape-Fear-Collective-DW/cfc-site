const axios = require("axios");
const {CANON_CMS_CUBES} = process.env;
const yn = require("yn");
const verbose = yn(process.env.CANON_CMS_LOGGING);
const BASE_API = `${CANON_CMS_CUBES}data.jsonrecords`;

const catcher = error => {
  if (verbose) console.error("Custom Attribute Error:", error);
  return [];
};

module.exports = function(app) {

  app.post("/api/cms/customAttributes/:pid", async(req, res) => {
    const {variables} = req.body;
    const {id1} = variables;

    const customHierarchy = id1 === "cf" ? "Cape Fear Member" : "County"
    const customId = id1 === "cf" ? 1 : id1
    const isRegion = id1 === "cf"

    const poverty = {
        cube: "Poverty Population",
        drilldowns: "Year",
        measures: "Indicator Total",
      };

    const povertyData = await axios
        .get(BASE_API, {params: poverty})
        .then(resp => resp.data.data)
        .catch(catcher);
      povertyData.sort((a, b) => b["Year"] - a["Year"]);
      const povertyLastYear = povertyData[0] ? povertyData[0]["Year"] : undefined;


    return res.json({
      tesseract: process.env.CANON_CONST_TESSERACT,
      customHierarchy,
      customId,
      isRegion,
      povertyLastYear
    });

  });

};
