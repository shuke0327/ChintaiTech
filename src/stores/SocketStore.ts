/*****************
 * Andrew Coutts
 * 2019
 *****************/
import { CBaseStore } from "stores/BaseStore"
import io from "socket.io-client"
// import { observable, action, computed } from "mobx"
import { IRootStore } from "stores/RootStore"
import { EKycApproved } from "./AppStore";

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

function getSocketUrl() {
  // Initialize websocket URL based on environment variable in '.env'
  if (process.env.REACT_APP_EXPRESS_SERVER_URL) {
    return process.env.REACT_APP_EXPRESS_SERVER_URL
  } else {
    return "https://chex.chintai.io"
  }
}

export class CSocketStore extends CBaseStore {
  socket = io(getSocketUrl(), { transports: ["websocket"] })
  socketId: string | undefined

  constructor(rootStore: IRootStore) {
    super(rootStore)

    // Set timeout in case the server can't be reached
    setTimeout(() => this.rootStore.appStore.kycApproved === EKycApproved.pendingFirstCheck ? this.rootStore.walletStore.userLoggedIn ? this.rootStore.appStore.setKycStatus(EKycApproved.NotYetCompleted) : null : null, 10000)

    // General socket.io handlers
    this.socket.on("connect", () => {
      // console.log("Socket: connected")
      this.socketId = this.socket!.id
      // console.log("Emitting checkKycStatus request")
      if (this.rootStore.walletStore.userLoggedIn) { this.socket.emit(ESocketMessages.checkKycStatus) }
    })

    this.socket.on("disconnect", (error: string) => {
      console.log("Socket: connection to API interrupted. | " + error)
    })

    this.socket.on("connect_error", (_error: string) => {
      // console.log("Socket: Error while connecting to API. | " + error)
    })

    this.socket.on("connect_timeout", (_error: string) => {
      // console.log("Socket: connection attempt to API timed out. | " + error)
    })

    this.socket.on("reconnect_attempt", (_attemptNumber: number) => {
      // console.log("Socket: attempting reconnect.. | #" + attemptNumber)
    })

    this.socket.on("reconnect_failed", () => {
      // console.log("Socket: reconnect attempt failed.")
    })
  }
}
