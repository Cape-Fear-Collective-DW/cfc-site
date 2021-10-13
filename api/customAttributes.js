module.exports = function(app) {

  app.post("/api/cms/customAttributes/:pid", async(req, res) => {

    return res.json({
      tesseract: process.env.CANON_CONST_TESSERACT
    });

  });

};
