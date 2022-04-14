const axios = require("axios");
const {CANON_CMS_CUBES} = process.env;
const yn = require("yn");
const verbose = yn(process.env.CANON_CMS_LOGGING);
const BASE_API = `${CANON_CMS_CUBES}data.jsonrecords`;
const sponsors = require("../app/helpers/sponsors.js");

const catcher = error => {
  if (verbose) console.error("Custom Attribute Error:", error);
  return [];
};

module.exports = function(app) {

  app.post("/api/cms/customAttributes/:pid", async(req, res) => {
    const {variables} = req.body;
    const {id1, hierarchy1} = variables;

    const isRegion = hierarchy1 === "Region";
    const isCounty = hierarchy1 === "County";
    const customHierarchy = hierarchy1 === "County" ? "Region" : hierarchy1

    //Regions cube
       const region = {
        cube: "Regions",
        drilldowns: "County",
        measures: "Counties",
        [hierarchy1]: id1,
        parents: true
      };

      const regionData = await axios
        .get(BASE_API, {params: region})
        .then(resp => resp.data.data)
        .catch(catcher);
      const customId = hierarchy1 === "County" ? regionData[0]["Region ID"] : id1;

    //Poverty cube
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
      isRegion,
      isCounty,
      customId,
      customHierarchy,
      povertyLastYear,
      sponsor: sponsors[0],
    });

  });
};
