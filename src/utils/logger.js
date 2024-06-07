const winston = require("winston");
const configObject = require("../config/dotenv.js");

const { node_env } = configObject;

const customLevels = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
  colors: {
    debug: "blue",
    http: "grey",
    info: "cyan",
    warning: "yellow",
    error: "red",
    fatal: "bold red",
  },
};

const logFormat = winston.format.combine(
  winston.format.colorize({ colors: customLevels.colors }),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

//Logger dev
const createDevLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: logFormat,
    }),
  ],
});

//Logger production
const createProdLogger = winston.createLogger({
  levels: customLevels.levels,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      level: "info",
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: logFormat,
    }),
  ],
});

const logger = node_env === "production" ? createProdLogger : createDevLogger;

//Middleware de logging
const loggerMiddleware = (req, res, next) => {
  req.logger = logger;
  req.logger.http(`${req.method} en ${req.url}`);
  next();
};

module.exports = { logger, loggerMiddleware };
