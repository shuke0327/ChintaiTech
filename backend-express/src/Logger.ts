/*****************
 * Author: Andrew Coutts
 * 2019
 * Logging library
] *****************/
// Imports
import * as winston from "winston"
import * as fs from "fs"
import * as path from "path"
import * as moment from "moment"
import { env } from "./Env"

// Declarations
const filename: string = path.join(env.EXPRESS_SERVER_LOG_DIR, `${moment.utc().format("YYYYMMDD-HHmmssSSS")}.log`)

if (!fs.existsSync(env.EXPRESS_SERVER_LOG_DIR)) {
  fs.mkdirSync(env.EXPRESS_SERVER_LOG_DIR)
}

const log = winston.createLogger({
  exitOnError: false,
  level: env.EXPESS_SERVER_DEBUG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    winston.format.printf((info) => `[${info.timestamp}|${info.level}]: ${info.message}`),
  ),
  transports: [
    env.EXPRESS_SERVER_NODE_ENV === "production" ? new winston.transports.File({ filename }) : new winston.transports.Console({ silent: env.EXPRESS_SERVER_NODE_ENV === "test" }),
  ],
})

export default log
