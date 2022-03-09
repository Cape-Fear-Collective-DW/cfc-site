const axios = require("axios");

module.exports = async function() {

  const arr = await axios.get("https://datausa.io/api/data?drilldowns=County&measure=Population&year=latest")
    .then(resp => resp.data.data);

  return arr.reduce((obj, d) => {
    obj[d["ID County"].slice(9)] = d.County;
    return obj;
  }, {});

};
