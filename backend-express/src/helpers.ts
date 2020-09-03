/*****************
 * Author: Andrew Coutts
 * 2019
 * Helper library for EOSJS functions
 *****************/
import { JsonRpc, RpcError } from "eosjs"
import fetch from "node-fetch"
import log from "./Logger"
import { env } from "./Env"

interface ITableRowsResult<T> {
  rows: Array<T>
}

export interface IGetCurrencyStatsResp {
  CHEX: {
    supply: string,
    max_supply: string,
    issuer: string,
  }
}

// Custom fetch wrapper implementation that allows us to enforace a request timeout time
const customFetch = (url: any, options: any, timeout = 1800) => {
  return Promise.race([
    fetch(url, options),
    new Promise((resolve, reject) => setTimeout(() => reject(new Error("timeout")), timeout)),
  ])
}

// EOSJS RPC
const rpc = new JsonRpc(env.NODEOS_ENDPOINT || "http://127.0.0.1:8888", { fetch: (customFetch as any) })

export function getTableRows<T>(code: string, scope: string, table: string, lowerBound?: string, upperBound?: string) {
  return new Promise<Array<T> | null>((resolve, reject) => {
    rpc.get_table_rows({
      json: true,
      code,
      scope,
      table,
      lower_bound: lowerBound,
      upper_bound: upperBound,
      limit: -1,
    }).then((data: ITableRowsResult<T>) => {
      resolve(data.rows)
    }).catch((e) => {
      if (e instanceof RpcError) {
        log.error(`[getTableRows] Error while getting table rows: ${JSON.stringify(e.json, null, 2)}`)
      }
      log.error(`[getTableRows] Error while getting table data (code/scope/table) [${code}]/[${scope}]/[${table}]: ${JSON.stringify(e.message, null, 2)}`)
      resolve(null)
    })
  })
}

export function getChexBalance(account: string) {
  return new Promise<string | null>((resolve, reject) => {
    rpc.get_currency_balance("chexchexchex", account, "CHEX").then((data: string) => {
      if (data.length) {
        resolve(data[0])
      }
    }).catch((e) => {
      if (e instanceof RpcError) {
        log.error(`[getChexBalance] Error while getting table rows: ${JSON.stringify(e.json, null, 2)}`)
      }
      log.error(`[getChexBalance] Error while getting CHEX balance for [${account}]: ${JSON.stringify(e.message, null, 2)}`)
      resolve(null)
    })
  })
}

export function getChexStats() {
  return new Promise<IGetCurrencyStatsResp | null>((resolve, reject) => {
    rpc.get_currency_stats("chexchexchex", "chex").then((data) => {
      resolve(data)
    }).catch((e) => {
      if (e instanceof RpcError) {
        log.error(`[getChexStats] Error while getting currency stats: ${JSON.stringify(e.json, null, 2)}`)
      }
      log.error(`[getChexStats] Error while getting CHEX stats: ${JSON.stringify(e.message, null, 2)}`)
      resolve(null)
    })
  })
}
