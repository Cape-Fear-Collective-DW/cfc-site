const axios = require("axios"),
      url = require("url");

const {CANON_CMS_CUBES} = process.env;

module.exports = function(app) {
  app.get("/proxy/*", async(req, res) => {
    const params = req.params[0];
    const baseURL = url.resolve(CANON_CMS_CUBES, params);
    const queryString = url.parse(req.url).query;
    const fullURL = queryString ? `${baseURL}?${queryString}` : baseURL;

    const data = await axios
      .get(fullURL)
      .then(resp => resp.data)
      .catch(error => {
        const {response} = error;
        const errorObject = Object.assign({}, response, {request: undefined});
        res.status(response.status);
        return errorObject;
      });

    res.send(data).end();
  });

  app.get("/proxy_agg/:cube/*", async(req, res) => {
    const params = req.params[0];
    const cube = req.params.cube;
    const baseURL = url.resolve(`${CANON_CMS_CUBES}/cubes/`, `${cube}/${params}`);
    const queryString = url.parse(req.url).query;
    const fullURL = queryString ? `${baseURL}?${queryString}` : baseURL;

    const data = await axios
      .get(fullURL)
      .then(resp => resp.data)
      .catch(error => {
        const {response} = error;
        const errorObject = Object.assign({}, response, {request: undefined});
        res.status(response.status);
        return errorObject;
      });

    res.send(data).end();
  });
};
