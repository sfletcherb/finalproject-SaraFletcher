const EErrors = require("../helpers/errors/error.dictionary.js");

const handleErrors = (err, req, res, next) => {
  console.log(err);

  switch (err.code) {
    case EErrors.NOT_FOUND:
      res.status(404).send({ status: "error", err: err.name });
      break;
    case EErrors.TYPE_INVALID:
      res.status(400).send({ status: "error", err: err.name });
      break;
    case EErrors.DB_ERROR:
      res.status(500).send({ status: "error", err: err.name });
      break;
    default:
      res.status(500).send({ status: "error", err: "Internal Server Error" });
  }
};

module.exports = handleErrors;
