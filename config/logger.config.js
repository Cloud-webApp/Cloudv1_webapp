import { createLogger, format, transports } from 'winston';
import appRoot from 'app-root-path';
 
const { combine, timestamp, printf, splat } = format;
 
const myFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta) : ''
  }`;
});
 
const logger = createLogger({
  format: combine(timestamp(), splat(), myFormat),
  transports: [
    new transports.File({ filename: `${appRoot.path}/logs/webapp.log` }),
    new transports.Console(),
  ],
});
 
export default logger;