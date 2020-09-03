/*****************
 * Author: Andrew Coutts
 * 2019
 * Helper functions to call the Oracle REST API
 *****************/

import * as dotenv from "dotenv"
dotenv.config()

// Verify that environment variables we need are set, or initialize defaults
export const env = {
  AUCTION_API_SERVER_ADDRESS: process.env.AUCTION_API_SERVER_ADDRESS || "http://127.0.0.1:8080",
  AUCTION_DURATION_MS: parseInt(process.env.AUCTION_DURATION_MS || "86400", 10),
  AUCTION_API_SERVER_ADDRESS_KYLIN: process.env.AUCTION_API_SERVER_ADDRESS_KYLIN || "http://kylin.chintai.io:8900",
  AUCTION_DURATION_MS_KYLIN: parseInt(process.env.AUCTION_DURATION_MS_KYLIN || "1800000", 10),
  EXPRESS_SERVER_SERVER_PORT: parseInt(process.env.EXPRESS_SERVER_SERVER_PORT || "8976", 10),
  NODEOS_ENDPOINT: process.env.NODEOS_ENDPOINT || "https://api.kylin.alohaeos.com:443",
  EXPRESS_SERVER_LOG_DIR: process.env.EXPRESS_SERVER_LOG_DIR || "logs",
  EXPESS_SERVER_DEBUG_LEVEL: process.env.EXPESS_SERVER_DEBUG_LEVEL || "silly",
  EXPRESS_SERVER_NODE_ENV: process.env.NODE_ENV || "development",
  USER_WHITELIST_ACCOUNT: process.env.USER_WHITELIST_ACCOUNT || "chintaiwhite",
  REST_API_URL: process.env.REST_API_URL || "http://74.208.86.75:8060",
}
