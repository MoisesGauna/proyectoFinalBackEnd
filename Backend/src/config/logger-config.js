
import winston from "winston";
import config from "./config.js";

const customLoggerOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "magenta",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

winston.addColors(customLoggerOptions.colors);

//Loggers para producción
const prodLogger = winston.createLogger({
  levels: customLoggerOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLoggerOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

//Loggers para desarrollo
const devLogger = winston.createLogger({
  levels: customLoggerOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLoggerOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

export const logger = winston.createLogger({
  levels: customLoggerOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLoggerOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

// Middleware de logger
export const addLogger = (req, res, next) => {
  if (config.environment === "prod") {
    req.logger = prodLogger;
    req.logger.warning(
      `${req.method} en ${
        req.url
      } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
    );
  } else {
    req.logger = devLogger;
    req.logger.http(
      `${req.method} en ${
        req.url
      } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
    );
  }
  next();
};
