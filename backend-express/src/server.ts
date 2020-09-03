/*****************
 * Author: Andrew Coutts
 * 2019
 *****************/
import * as express from "express"
import * as http from "http"
import * as SocketIO from "socket.io"
import * as helmet from "helmet"
import * as bodyParser from "body-parser"
import * as path from "path"
import * as rp from "request-promise"
import * as moment from "moment"
import * as mailgun from "mailgun.js"
import * as hash from "object-hash"
import { env } from "./Env"
import log from "./Logger"
// import { getTableRows } from "./helpers"
import { registerChexStatsInterval, state } from "./State"
// import { getChexBalance } from "./helpers"

export enum ESocketMessages {
  handshake = "7CC658971E8F998772BC0A3DDA09E834B4D9AEDE",
  currentRoundEndTimeUpdate = "52AD60D40835A6516A67943587BBA49C9204ACD7",
  chexEosPriceUpdate = "FAD87D4A2F117266BC757F0F6BC1BA9A589D8F3F",
  currentRoundNumberUpdate = "0F971C8D3B06F1D45BCA845ED8DC6C943D6A7B47",
  auctionRoundsSummaryArrayUpdate = "3F06077B0CD84A456B28DB53CEAA04E33460A53A",
  subscribeEmail = "E82A35459DB00712AD2525E154B314817EFFB680",
  chartDataUpdate = "D215DC2739535A9981F018F87C85A98403C0FB91",
  getHistory = "0030AC031CB7D68C6AF87BFEF560A99D2D9F1002",
  getHistoryResp = "3C0AD801D207603010D6D7882376AAA4442A58D8",
  userLoggedIn = "A29AE2178F751817F5D0E3CB4DC8478C3AA72AF3",
  userLoggedOut = "5107512AD583E3502BC51488D003936A77FAF4F4",
  contributionsListUpdate = "26AC068FFF6C9E14185AECC8D9E3F2C604D2C5AD",
  allRoundsSummaryUnfilteredUpdate = "C7B08D34B04EA672E1A780C09AC9497CC1AF4530",
  checkKycStatus = "E752682D515F1273087C0F135649998FF0531973",
  checkKycStatusResp = "780A0EF961C994D9731A591401E516088E9859E5",
  unsubscribeEmail = "0EF098FBA400003A25C6C063D5BEFACA4501FD48",
  getAutomatedresHistory = "A3511AC5010B52A9883FECA41F2A1BF68464A67D",
  getAutomatedresResponse = "1ECCFF11F5C370B710DC3C1A11DC8C4996CDA30E",
}

enum EKycApproved {
  pendingFirstCheck = -1,
  NotYetCompleted = 0,
  completed = 1,
}

interface IGetChartDataRequest {
  symbol: string
  from: number
  to: number
  interval: number
  firstRequest: boolean
}

/* Auction API URLs
  /auction                          // Auction summary
  /auction/rounds                   // All rounds summary
  /auction/rounds/:roundNumber      // Specific round summary
  /auction/rounds/:roundNumber/bids // Specific bids for a round
  /bids                             // List of all bids on all rounds
  /bids/:user                       // List of all bids for a user on all rounds
*/

// '/auction' // Auction summary
// interface IAuctionStatsAuction {
//   id: string                  // Dummy value I think, always "0"
//   startTime: string           // Start time of auction
//   endTime: string             // End time of auction
//   totalChex: string           // Total CHEX to be issued
//   totalRaised: string         // Total EOS raised
//   avgChexPrice: string        // Average CHEX price
//   currentAuctionRound: string // Current round number
// }

// '/auction/rounds'                // All rounds summary
// '/auction/rounds/:roundNumber    // Get specific round
interface IAuctionStatsAuctionRoundsItem {
  round: string       // Round #
  totalRaised: string // EOS
  chexPrice: string   // CHEX price for round
  startTime: string   // Round start time
  endTime: string     // Round end time
  totalChex: string   // Total CHEX distributed
}

// My custom format used after parsing the response from Mike's API
interface IRoundSummaryParsed {
  roundNum: number
  totalRaised: number
  chexPrice: string
  startTime: string
  endTime: string
}

interface IChartDataPoint {
  timestamp: string   // roundNum
  price: number   // price
}

// // '/auction/rounds/:roundNumber/bids'  // Individual bids for a round
// interface IAuctionSTatsAuctionRoundBidsItem {
//   user: string        // EOS account
//   quantity: number    // Total EOS contributed
// }

// // '/bids' // List of all bids to the auction
// interface IAuctionStatsBidsItemBids {
//   user: string    // EOS account
//   round: number   // Round #
//   quantity: {
//     value: number // Amount of EOS contributed
//   }
// }

// interface IAuctionStatsBidsItem {
//   user: string
//   bids: Array<IAuctionStatsBidsItemBids>
// }

interface IAuctionStatsBidsForUser {
  user: string,
  bids: Array<{
    user: string
    round: number
    quantity: {
      value: number,
    },
  }>
}

interface IGlobalState {
  currentRoundNumber: number
  auctionEndTime: string
  currentRoundEndTime: string
  eosPrice: number
  chexPriceEos: number
  totalRounds: number
  allRoundsSummaryArray: Array<IRoundSummaryParsed>
  chartData: Array<IChartDataPoint>
  allRoundsSummaryUnfiltered: Array<IRoundSummaryParsed>
}

interface ILocalState {
  connectedClients: Map<string, IConnectedClient>
  subscribedEosAccounts: Array<string>
  haveNotifiedAuctionEnded: boolean
}

interface IContributionItem {
  round: number
  quantity: number
}

interface IConnectedClient {
  ip: string
  connectedAt: string
  eosAccountName: string
  kycApproved: EKycApproved
  currentChexBalance: number
  contributions: Array<IContributionItem>
}

// interface IWhitelistTableResult {
//   account: string,
//   score: number,
//   metadata: string,
//   timestamp: string
// }

interface IUnsubscribesResult {
  items: Array<{ address: string, tags: Array<string>, created_at: string }>
  paging: {
    first: string,
    last: string,
    next: string,
    previous: string,
  }
}

interface IMailgunResponse {
  address: string
  message: string
}

enum ELeaseActExpStatus {
  active = "active",
  expired = "expired",
}

enum ELeaseUndelStatus {
  pending = "pending",
  unstaking = "unstaking",
  refunded = "refunded",
}

interface ILeaseModel {
  key?: number
  leaseId: number
  lendOrderId: number
  borrowOrderId: number
  takerType: string
  timestampOpen: string
  timestampExpire: string
  accountLender: string
  accountBorrowerOwner: string
  accountBorrowerDelegatee: string
  rate: number
  quantity: number
  totalInterest: number
  cpuBwMix: number
  actExpStatus: ELeaseActExpStatus
  undelStatus: ELeaseUndelStatus | null
  timestampUnstake: string | null
  timestampRefund: string | null
  txIds: Array<string>
}

const app: express.Express = express()
const httpVar = http.createServer(app)
const io = SocketIO(httpVar)
const mg = mailgun.client({ username: "api", key: "key-88828829f7b4e5434d674a1db2182d3b" })

// State which is used internally by the express server to keep track of connected clients
const localState = {
  connectedClients: new Map<string, IConnectedClient>(),
  subscribedEosAccounts: [] as Array<string>,
  haveNotifiedAuctionEnded: false, // Used to send one final chart update to all users when auction ends to give them the final chart datapoint
} as ILocalState

// State sent to all users on connect for general info like round information
const globalState = {
  currentRoundNumber: 0,
  auctionEndTime: "",
  currentRoundEndTime: "",
  eosPrice: 0,
  chexPriceEos: 0,
  totalRounds: 0,
  allRoundsSummaryArray: [] as Array<IRoundSummaryParsed>,
  chartData: [] as Array<IChartDataPoint>,
  allRoundsSummaryUnfiltered: [] as Array<IRoundSummaryParsed>,
} as IGlobalState

const auctionServer = env.AUCTION_API_SERVER_ADDRESS

// Helper function to send confirmation emails
const sendConfirmationEmail = (logMessage: string, address: string) => {
  mg.messages
    .create("mail.chintai.io", {
      from: "Chintai <hello@chintai.io>",
      to: ["hello@chintai.io"],
      subject: `${logMessage}: ${address}`,
      html: `<b>Address:</b> ${address}`,
    })
    .then((_msg: any) => log.silly(`${logMessage}: ${address}`)) // logs response data
    .catch((err: any) => log.error(err)) // logs any error
}

// Runs every 1s to get user info like their whitelist status and contribution history
const getUserInfoTask = async () => {
  // First get the latest copy of the on-chain whitelist entries
  // const whitelistEntries = await getTableRows<IWhitelistTableResult>(env.USER_WHITELIST_ACCOUNT, env.USER_WHITELIST_ACCOUNT, "accounts")

  for (const entry of localState.connectedClients.entries()) {
    if (entry[1].eosAccountName !== "") {
      // Get the user's CHEX balance
      // getChexBalance(entry[1].eosAccountName).then((data: string) => {
      //   if (parseFloat(data)) {
      //     entry[1].currentChexBalance = parseFloat(data)
      //   }
      // }).catch((err) => {
      //   log.error(`[getUserInfoTask->getChexBalance] Error: ${err.message}`)
      // })

      // Check the user's KYC status
      // if (whitelistEntries) {
      //   // log.silly(`Checking whitelist for account: ${entry[1].eosAccountName} | kycApproved: ${entry[1].kycApproved}`)
      //   if (whitelistEntries.find((e) => e.account === entry[1].eosAccountName)) {
      //     if (entry[1].kycApproved !== EKycApproved.completed) {
      //       entry[1].kycApproved = EKycApproved.completed
      //       io.sockets.connected[entry[0]].emit(ESocketMessages.checkKycStatusResp, 1)
      //       log.info(`Emitting KYC status confirmation for account: ${entry[1].eosAccountName} | Status: Completed`)
      //     }
      //   } else {
      //     if (entry[1].kycApproved !== EKycApproved.NotYetCompleted) {
      //       entry[1].kycApproved = EKycApproved.NotYetCompleted
      //       io.sockets.connected[entry[0]].emit(ESocketMessages.checkKycStatusResp, 0)
      //       log.info(`Emitting KYC status confirmation for account: ${entry[1].eosAccountName} | Status: Not Completed`)
      //     }
      //   }
      // }

      // Get the user's contributions list
      rp({
        url: `${auctionServer}/bids/${entry[1].eosAccountName}`,
        method: "GET",
        json: true,
      }).then((data: IAuctionStatsBidsForUser) => {
        if (!data) { return }

        const oldListHash = hash(entry[1].contributions)
        entry[1].contributions = data.bids.map((e: {
          user: string
          round: number
          quantity: {
            value: number,
          },
        }) => {
          return {
            round: e.round,
            quantity: e.quantity.value,
          }
        })
        const newListHash = hash(entry[1].contributions)
        if (oldListHash !== newListHash) {
          io.sockets.connected[entry[0]].emit(ESocketMessages.contributionsListUpdate, entry[1].contributions)
        }

      }).catch((err) => {
        log.error(`[getUserInfoTask->getUserContributions] Error: ${err.message}`)
      })
    }
  }
}

const buildChartData = () => {
  globalState.chartData = globalState.allRoundsSummaryArray.map((e: IRoundSummaryParsed) => {
    return ({
      timestamp: moment.utc(e.endTime).format(),
      price: parseFloat(e.chexPrice),
    })
  })
}

const eosPriceUpdateTask = () => {
  rp({
    url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=EOS`,
    method: "GET",
    json: true,
    headers: {
      "X-CMC_PRO_API_KEY": "1b3206dc-8483-4d6e-8589-9253d0e4caee",
    },
  }).then((data: any) => {
    if (!data) { return }

    if (data.data.EOS.quote.USD.price !== globalState.eosPrice) {
      globalState.eosPrice = data.data.EOS.quote.USD.price
      log.info(`[eosPriceUpdateTask] EOS price updated: ${globalState.eosPrice}`)
    }
  }).catch((err) => {
    log.error(`[eosPriceUpdateTask] Error: ${err.name}`)
  })
}

const updateTask = async () => {
  // First check the overall auction end time to make sure a new auction didn't start.
  // If it did, reset all of the states. Also use this to update the total number of rounds.
  await rp({
    url: `${auctionServer}/auction`,
    method: "GET",
    json: true,
  }).then((data: IAuctionStatsAuctionRoundsItem) => {
    if (!data) {
      log.error("Error while getting '/auction/rounds': null response")
      return
    }

    // If the auction end time is different then reset all of the states
    if (moment.utc(globalState.auctionEndTime).format() !== moment.utc(data.endTime).format()) {
      globalState.auctionEndTime = moment.utc(data.endTime).format()
      globalState.totalRounds = moment.duration(moment.utc(data.endTime).diff(moment.utc(data.startTime))).asMilliseconds() / env.AUCTION_DURATION_MS
      globalState.chartData = []
      globalState.allRoundsSummaryArray = []
      globalState.currentRoundNumber = 0
      globalState.currentRoundEndTime = ""
      globalState.chexPriceEos = 0
      localState.haveNotifiedAuctionEnded = false
      globalState.allRoundsSummaryUnfiltered = []

      // Reset all client contribution lists
      for (const entry of localState.connectedClients.entries()) {
        entry[1].contributions = []
        entry[1].kycApproved = EKycApproved.pendingFirstCheck
      }
      log.info(`New auction has been started. New number of rounds: ${globalState.totalRounds} | New end time: ${globalState.auctionEndTime}`)
      io.emit(ESocketMessages.handshake, globalState)
    }
  }).catch((err) => {
    log.error(`[/auction/rounds/#] Error: ${err.name}`)
  })

  // Get list of all rounds
  await rp({
    url: `${auctionServer}/auction/rounds`,
    method: "GET",
    json: true,
  }).then((roundsData: Array<IAuctionStatsAuctionRoundsItem>) => {
    if (!roundsData) {
      log.error("Error while getting '/auction/rounds': null response")
      return
    }

    // The REST api will return every round including if it's null or has no contributions yet (as there's no table entry on chain yet).
    // We must filter this list to return only the rounds whose end time is <= the current time.
    const allRoundsFiltered = roundsData.filter((d: IAuctionStatsAuctionRoundsItem) => moment.utc(d.startTime) <= moment.utc())
    const previousRoundsArrayLength = globalState.allRoundsSummaryArray.length
    const previousUnfilteredArrayHash = hash(globalState.allRoundsSummaryUnfiltered)

    // Now we need to manipulate the data into a new format before saving it to state
    globalState.allRoundsSummaryArray = allRoundsFiltered.map((e: IAuctionStatsAuctionRoundsItem) => {
      return {
        totalRaised: parseFloat(e.totalRaised),
        roundNum: parseInt(e.round, 10),
        chexPrice: e.chexPrice,
        startTime: moment.utc(e.startTime).format(),
        endTime: moment.utc(e.endTime).format(),
      }
    })

    // Lazy for now- also keep a copy of the rounds including future ones for displaying a user's future contributions on the UI
    globalState.allRoundsSummaryUnfiltered = roundsData.map((e) => {
      return {
        totalRaised: parseFloat(e.totalRaised),
        roundNum: parseInt(e.round, 10),
        chexPrice: e.chexPrice,
        startTime: moment.utc(e.startTime).format(),
        endTime: moment.utc(e.endTime).format(),
      }
    })

    if (globalState.allRoundsSummaryArray.length !== previousRoundsArrayLength) {
      io.emit(ESocketMessages.auctionRoundsSummaryArrayUpdate, globalState.allRoundsSummaryArray)
    }

    // Use hash to determine when anything in the array has changed
    if (hash(globalState.allRoundsSummaryUnfiltered) !== previousUnfilteredArrayHash) {
      io.emit(ESocketMessages.allRoundsSummaryUnfilteredUpdate, globalState.allRoundsSummaryUnfiltered)
    }

    // Update the chart data
    buildChartData()

    // Now update the current round number and time to end of current round
    const latestItem = globalState.allRoundsSummaryArray[globalState.allRoundsSummaryArray.length - 1]
    if (typeof latestItem !== "undefined") { // Make sure there's at least 1 item in the array
      if (Object.prototype.hasOwnProperty.call(latestItem, "roundNum")) { // Make sure it has a round number
        // Now update the round number and associated round end time if necessary
        if (globalState.currentRoundNumber !== latestItem.roundNum) {
          globalState.currentRoundNumber = latestItem.roundNum
          globalState.currentRoundEndTime = latestItem.endTime
          io.emit(ESocketMessages.currentRoundEndTimeUpdate, globalState.currentRoundEndTime)
          io.emit(ESocketMessages.currentRoundNumberUpdate, globalState.currentRoundNumber)

          // Update the chart on the start of a new round by sending the prior round's data point
          const dataPoint = globalState.allRoundsSummaryArray.find((e) => e.roundNum === latestItem.roundNum - 1)
          io.emit(ESocketMessages.chartDataUpdate, {
            time: moment.utc(dataPoint!.endTime).unix() * 1000,
            open: dataPoint!.chexPrice,
            high: dataPoint!.chexPrice,
            low: dataPoint!.chexPrice,
            close: dataPoint!.chexPrice,
          })
        }
      }
    }

    // Check if the auction is over. If it is, broadcast the last datapoint
    if (moment.utc() > moment.utc(globalState.auctionEndTime)) {
      if (!localState.haveNotifiedAuctionEnded) {
        // console.log("!haveNotifiedAuctionEnded")
        if (globalState.chartData.length) {
          // console.log("globalSTate.chartData.length")
          console.log("Emitting: ", {
            time: moment.utc(globalState.currentRoundEndTime!).unix() * 1000,
            open: globalState.chexPriceEos,
            high: globalState.chexPriceEos,
            low: globalState.chexPriceEos,
            close: globalState.chexPriceEos,
          })
          io.emit(ESocketMessages.chartDataUpdate, {
            time: moment.utc(globalState.currentRoundEndTime!).unix() * 1000,
            open: globalState.chexPriceEos,
            high: globalState.chexPriceEos,
            low: globalState.chexPriceEos,
            close: globalState.chexPriceEos,
          })
          // console.log("Emitted")
          localState.haveNotifiedAuctionEnded = true
          // console.log("Setting to false")
        }
      }
    }
  }).catch((err: Error) => {
    log.error(`[/auction/rounds] Error: ${err}`)
  })

  // Get current round information to update whenever someone contributes to the current round
  await rp({
    url: `${auctionServer}/auction/rounds/${globalState.currentRoundNumber}`,
    method: "GET",
    json: true,
  }).then((data: IAuctionStatsAuctionRoundsItem) => {
    if (!data) { return }

    if (data.chexPrice && parseFloat(data.chexPrice) !== globalState.chexPriceEos) {
      globalState.chexPriceEos = parseFloat(data.chexPrice)
      io.emit(ESocketMessages.chexEosPriceUpdate, globalState.chexPriceEos)

      // Optional: emit chart updates in realtime as price changes. No point in doing this if we aren't displaying the current round data point though.
      // if (globalState.chartData.length) {
      //   io.emit(ESocketMessages.chartDataUpdate, {
      //     time: moment.utc(globalState.currentRoundEndTime!).unix() * 1000,
      //     open: globalState.chexPriceEos,
      //     high: globalState.chexPriceEos,
      //     low: globalState.chexPriceEos,
      //     close: globalState.chexPriceEos,
      //   })
      // }
    }
  }).catch((err) => {
    log.error(`[/auction/rounds/#] Error: ${err.name}`)
  })
}

(async () => {
  try {
    await updateTask()
    await eosPriceUpdateTask()
    await getUserInfoTask()

    // Update auction stats constantly
    setInterval(() => updateTask(), 500)

    // Update EOS price every 5 mins
    setInterval(() => eosPriceUpdateTask(), 3600000)

    // Update user info every 2s
    setInterval(() => getUserInfoTask(), 2000)

    // Update CHEX stats every 10s
    await registerChexStatsInterval()

    // Middleware
    app.use(helmet())

    // Parse incoming request data
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    ////////////////////////////////
    // Routing definitions
    ////////////////////////////////
    app.get("/whitepaper", (req, res) => {
      switch (req.query.lang) {
        case "ko": {
          res.redirect(307, "/whitepapers/Chintai%20Tokenomic%20Model%20(한국어).pdf")
          break
        }

        case "zh": {
          res.redirect(307, "/whitepapers/Chintai%20Tokenomic%20Model(中文版).pdf")
          break
        }

        default: {
          res.redirect(307, "/whitepapers/Chintai%20Tokenomic%20Model.pdf")
          break
        }
      }
    })

    // API for CHEX token information
    app.get("/api/v1/chextokenstats", async (_req, res) => {
      res.status(200).json(state.chex)
    })

    // Serve files in /public/ folder
    app.use(express.static("public"))

    app.get("/*", (req, res) => {
      res.sendFile(path.join(__dirname, "../public/index.html"))
    })

    // Start the server
    httpVar.listen(env.EXPRESS_SERVER_SERVER_PORT)
    log.info(`Server listening on port ${env.EXPRESS_SERVER_SERVER_PORT}`)

    // Client websocket connection handlers
    // Called on new client connection from frontend
    io.on("connect", (socket: SocketIO.Socket) => {
      log.info(`New frontend client connection | ip: [${socket.handshake.headers["x-forwarded-for"]}] | socketid: [${socket.id}]`)
      localState.connectedClients.set(socket.id, {
        ip: socket.handshake.headers["x-forwarded-for"],
        connectedAt: socket.handshake.time,
        eosAccountName: "",
        kycApproved: EKycApproved.pendingFirstCheck,
        contributions: [],
        currentChexBalance: 0,
      })
      socket.emit(ESocketMessages.handshake, globalState)

      socket.on("disconnect", (_reason: string) => {
        log.info(`Client disconnected | ip: [${localState.connectedClients.get(socket.id)!.ip}] | socketid: [${socket.id}]`)
        localState.connectedClients.delete(socket.id)
      })

      socket.on(ESocketMessages.checkKycStatus, () => {
        let status = "Pending Check"
        // if (localState.connectedClients.get(socket.id)!.kycApproved === EKycApproved.completed) {
          socket.emit(ESocketMessages.checkKycStatusResp, 1)
          status = "Completed"
        // } else if (localState.connectedClients.get(socket.id)!.kycApproved === EKycApproved.NotYetCompleted) {
        //   socket.emit(ESocketMessages.checkKycStatusResp, 0)
        //   status = "Not Completed"
        // }
        // I have a hunch this will always be a case where it returns as "pending check" but i'll leave this routine here just in case.
        log.info(`Recieved request to verify KYC for account: ${localState.connectedClients.get(socket.id)!.eosAccountName} | Status: ${status}`)
      })

      socket.on(ESocketMessages.getAutomatedresHistory, async (accountName: string) => {
        let respData: Array<ILeaseModel> = []
        await rp({
          url: `${env.REST_API_URL}/v3/chintaiclassic/getautomatedreshistory/${accountName}`,
          method: "GET",
          json: true,
        }).then((data: Array<ILeaseModel>) => {
          if (Object.prototype.hasOwnProperty.call(data, "error")) {
            log.error("undefined data from autores history")
          } else {
            respData = data
          }
        }).catch((err) => {
          log.silly(`Error calling automatedres history endpoint: ${err.message}`)
        })
        socket.emit(ESocketMessages.getAutomatedresResponse, respData)
      })

      socket.on(ESocketMessages.userLoggedIn, (accountName: string) => {
        log.debug(`User logged in: ${accountName} | ip: [${localState.connectedClients.get(socket.id)!.ip}]`)
        if (accountName && accountName !== "undefined") {
          // log.silly(`Adding user to subscribed accounts array: ${accountName}`)
          localState.connectedClients.get(socket.id)!.eosAccountName = accountName
          localState.subscribedEosAccounts.push(accountName)
        }

        // Send the user their current list of contributions if anything is cached
        socket.emit(ESocketMessages.contributionsListUpdate, localState.connectedClients.get(socket.id)!.contributions)
      })

      socket.on(ESocketMessages.userLoggedOut, () => {
        log.debug(`User logged out: ${localState.connectedClients.get(socket.id)!.eosAccountName}`)
        localState.subscribedEosAccounts = localState.subscribedEosAccounts.filter((e: string) => e !== localState.connectedClients.get(socket.id)!.eosAccountName)
        localState.connectedClients.get(socket.id)!.kycApproved = EKycApproved.pendingFirstCheck
        localState.connectedClients.get(socket.id)!.eosAccountName = ""
      })

      socket.on(ESocketMessages.getHistory, (data: IGetChartDataRequest) => {
        // log.silly(`Received getHistory request from client: ${socket.id} | interval: ${data.interval}`)
        const barsToReturn = globalState.chartData.filter((e: IChartDataPoint) => moment.utc(e.timestamp) >= moment.utc(data.from * 1000) && moment.utc(e.timestamp) <= moment.utc(data.to * 1000 + env.AUCTION_DURATION_MS) && (e.timestamp !== globalState.currentRoundEndTime || moment.utc() > moment.utc(globalState.auctionEndTime))).map((f: IChartDataPoint) => {
          return {
            time: moment.utc(f.timestamp).unix() * 1000,
            open: f.price,
            high: f.price,
            low: f.price,
            close: f.price,
            volume: 0,
          }
        })
        socket.emit(ESocketMessages.getHistoryResp, barsToReturn)
      })

      socket.on(ESocketMessages.subscribeEmail, async (address: string) => {
        log.silly(`Subscribing new user to mailing list: ${address}`)

        // First check if the user is on the unsubscribes list. If exists, remove the user from unsubscribes
        // list, else add them as a new subscription
        try {
          // Get the unsubscribes list
          const unsubscribeListResult: IUnsubscribesResult = await rp({
            url: `https://api.mailgun.net/v3/mail.chintai.io/unsubscribes`,
            method: "GET",
            json: true,
            auth: {
              user: "api",
              pass: "key-88828829f7b4e5434d674a1db2182d3b",
            },
          })

          // Check if the user exists in there
          let userIncluded = false
          unsubscribeListResult.items.forEach((e) => { if (e.address === address) { userIncluded = true } })

          if (userIncluded) {// User is in the unsubscribes list, so just remove them from there to re-subscribe them
            // Send the request to remove them from the unsubscribes list
            const result: IMailgunResponse = JSON.parse(await rp({
              url: `https://api.mailgun.net/v3/mail.chintai.io/unsubscribes/${address}`,
              method: "DELETE",
              auth: {
                user: "api",
                pass: "key-88828829f7b4e5434d674a1db2182d3b",
              },
            }))

            // If it was successful, send a confirmation email to hello@chintai.io
            if (result.message === "Unsubscribe event has been removed") {
              sendConfirmationEmail("Existing User Re-Subscribed", address)
            } else {
              // If user is already subscribed, do nothing
              log.error(result)
            }
          } else { // User is new so create a new subscribe entry for them
            // Send the request to add a new user to the mailing list
            const result: IMailgunResponse = await rp({
              url: `https://api.mailgun.net/v3/lists/hello@mail.chintai.io/members`,
              method: "POST",
              json: true,
              auth: {
                user: "api",
                pass: "key-88828829f7b4e5434d674a1db2182d3b",
              },
              form: {
                address,
              },
            })

            // If it was successful, send a confirmation email to hello@chintai.io
            if (result.message === "Mailing list member has been created") {
              sendConfirmationEmail("New User Subscribed", address)
            } else {
              log.error(result)
            }
          }
        } catch (e) {
          log.error(e)
        }
      })

      socket.on(ESocketMessages.unsubscribeEmail, async (address: string) => {
        log.silly(`Unsubscribing user from mailing list: ${address}`)

        try {
          const result: IMailgunResponse = await rp({
            url: `https://api.mailgun.net/v3/mail.chintai.io/unsubscribes`,
            method: "POST",
            json: true,
            auth: {
              user: "api",
              pass: "key-88828829f7b4e5434d674a1db2182d3b",
            },
            form: {
              address,
              tag: "*",
            },
          })

          if (result.message === "Address has been added to the unsubscribes table") {
            sendConfirmationEmail("User Unsubscribed", address)
          } else {
            log.error(result)
          }
        } catch (e) {
          log.error(e)
        }
      })
    })
  } catch (err) {
    log.error(err.message)
  }
})()
