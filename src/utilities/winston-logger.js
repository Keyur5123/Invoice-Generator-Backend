const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `
  return msg
});

const logger = createLogger({
  format: combine(format.colorize(), splat(), timestamp(), myFormat),
  transports: [new transports.Console(),]
});

module.exports = logger

