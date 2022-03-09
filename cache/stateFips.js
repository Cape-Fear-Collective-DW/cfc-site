const axios = require("axios");

module.exports = async function() {

  const arr = await axios.get("https://datausa.io/api/data?drilldowns=State&measure=Population&year=latest")
    .then(resp => resp.data.data);

  return arr.reduce((obj, d) => {
    obj[d["ID State"].slice(7)] = d.State;
    return obj;
  }, {});

};
