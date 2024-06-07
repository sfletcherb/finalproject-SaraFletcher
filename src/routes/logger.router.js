const express = require("express");
const router = express.Router();

router.get("/loggerTest", (req, res) => {
  req.logger.debug("This is a debug message");
  req.logger.http("This is an HTTP log message");
  req.logger.info("This is an info message");
  req.logger.warning("This is a warning message");
  req.logger.error("This is an error message");
  req.logger.fatal("This is a fatal message");

  res.send("Logs have been recorded");
});

module.exports = router;
