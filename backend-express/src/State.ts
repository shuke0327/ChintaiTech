/*****************
 * Author: Andrew Coutts
 * 2019
 *****************/
import { getChexBalance, getChexStats } from "./helpers"

interface IState {
  chex: {
    totalSupply: number       // Total supply of CHEX tokens
    circulatingSupply: number // Circulating supply of CHEX which have been released from the auction and vested in the chintaiowners contract
    precisionDecimals: number // Number of decimals precision
  }
}

export const state: IState = {
  chex: {
    totalSupply: 1000000000.0000 ,  // Hard coded 1B tokens
    circulatingSupply: 0,
    precisionDecimals: 4,
  }
}

const chexStatsUpdateTask = async () => {
  const auctionBalance = await getChexBalance("myntdemocode").then((e) => parseFloat(e || "0"))
  const unvestedOwnersBalance = await getChexBalance("chintaiowner").then((e) => parseFloat(e || "0"))
  const currentMaxSupply = await getChexStats().then((e) => !e ? 1000000000 : parseFloat(e.CHEX.max_supply))
  state.chex.circulatingSupply = currentMaxSupply - auctionBalance - unvestedOwnersBalance
}

export const registerChexStatsInterval = async () => {
  await chexStatsUpdateTask()
  setInterval(async () => await chexStatsUpdateTask(), 10000)
}