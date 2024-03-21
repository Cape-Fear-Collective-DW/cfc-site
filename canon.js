module.exports = {
  db: [
    {
      connection: process.env.CANON_CMS_DB,
      tables: [
        require("@datawheel/canon-cms/models"),
        require("@datawheel/canon-core/models")
      ]
    }
  ],
  pdf: {
    pageOptions: {
      timeout: 0
    }
  }
};
