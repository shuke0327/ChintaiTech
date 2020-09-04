/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React from "react"
import { CBaseStore } from "./BaseStore"
import { action, observable, computed, IObservableArray, reaction } from "mobx"
import { IRootStore } from "./RootStore"
import { toast } from "react-toastify"
import { Success, Info, SuccessTx } from "SharedComponents/Notifications"
import moment from "moment"
import { ITeamMember } from "Pages/LandingPage/TeamList/TeamList"
import { ProductItem } from "Pages/LandingPage/Products"
import { IndustryItem } from "Pages/LandingPage/Industry"
import { AutoSizer } from "react-virtualized"
import ReactGA from "react-ga"

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    e: any
    ref: any
  }
}

export enum EBidChexState {
  landingScreen = "landingScreen",
  viewTos = "viewTos",
  bidOnChex = "bidOnChex",
}

export enum EKycApproved {
  pendingFirstCheck = -1,
  NotYetCompleted = 0,
  completed = 1,
}

interface ICountDownObject {
  duration: moment.Duration
  days: number
  hours: number
  minutes: number
  seconds: number
  timerObject: NodeJS.Timer
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

export interface ILeaseModel {
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

export interface IBlacklistItem {
  account: string
}

export interface IConfigItem {
  [index: number]: string
  [key: string]: string | number | boolean
  account_to_watch: string
  cpu_threshold_low_us: number
  cpu_threshold_high_us: number
  net_threshold_low_bytes: number
  net_threshold_high_bytes: number
  ram_threshold_low_bytes: number
  ram_threshold_high_bytes: number
  max_price_per_eos: string
  notify_account: boolean
  notify_payer: boolean
  active: boolean
}

export interface IConfigFormItem {
  key: string
  configItem: IConfigItem
  enable_edit: boolean
  enable_delete: boolean
}

// My custom format used after parsing the response from Mike's API
export interface IRoundSummaryParsed {
  totalRaised: number
  roundNum: number
  chexPrice: string
  startTime: string
  endTime: string
}

// // Expess state object that is passed in when we do a handshake
// interface IExpressGlobalStateMessage {
//   currentRoundNumber: number
//   auctionEndTime: string // We don't do anything with this right now but it's here if we need it
//   currentRoundEndTime: string
//   eosPrice: number
//   chexPriceEos: number
//   totalRounds: number
//   allRoundsSummaryArray: Array<IRoundSummaryParsed>
//   chartData: Array<IChartDataPoint> // We don't use this directly. TV chart will request the data it needs.
//   allRoundsSummaryUnfiltered: Array<IRoundSummaryParsed>
// }

export interface IContributionItem {
  round: number
  quantity: number
}

export class CAppStore extends CBaseStore {

  // Auction data
  @observable currentRoundEndTime = ""
  @observable currentRoundNumber = 0
  @observable currentRoundChexPrice = 0
  @observable currentBancorChexPrice = 0
  @observable currentEosPrice = 0
  @observable totalAuctionRounds = 0
  @observable countDownCurrentRound = {
    duration: moment.duration(0),
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    timerObject: {} as NodeJS.Timer
  } as ICountDownObject
  @observable langMenuOpen = false
  @observable teamLightboxOpen = false
  @observable industryItemBoxOpen = false
  @observable productItemBoxOpen = false
  @observable currentSelectedTeamMember = "David Packham"
  @observable currentSelectedProductItem = "Mynt"
  @observable currentSelectedIndustryItem = "Finance"
  @observable auctionStarted = false // TODO: plug in to countdown timer to know when it's started
  @observable loginButtonMousedOver = false
  @observable lastScrollY = 0
  @observable windowWidth = window.innerWidth
  @observable windowHeight = window.innerHeight
  @observable mobileMenuOpen = false
  @observable auctionRoundsSummaryArray = [] as unknown as IObservableArray<IRoundSummaryParsed>
  @observable allRoundsSummaryUnfiltered = [] as unknown as IObservableArray<IRoundSummaryParsed>
  @observable currentBidQuantity = ""
  @observable selectedBidRoundSingle = 0
  @observable selectedBidRoundMultipleStart = 0
  @observable selectedBidRoundMultipleEnd = 0
  @observable subscribeEmail = ""
  @observable chexEosPriceUpdated = false
  @observable kycApproved = EKycApproved.completed // KYC status of user. -1 = loading, 0 = not approved, 1 = approved
  @observable userContributions = [] as Array<IContributionItem>
  @observable currentFutureContributionsCalculation = true
  @observable affiliateReferral = ""
  @observable isUsingRangeOfRounds = false // Toggled when user selects the "a range of rounds" radio button
  @observable regionBlocked = 0 // Used to block USA and China from bidding on CHEX. -1 = loading, 0 = not blocked, 1 = blocked
  @observable tosConfirmed = false // Whether or not the user has accepted the terms
  @observable isAuctionEnded = false
  @observable userAccountInfo: any = {}
  @observable userCpuUtilization = 0

  /******Automatedres*****/
  @observable showNewConfigRow = false
  @observable currentAutomatedresDepositWithdrawQuantity = ""
  @observable currentAutomatedresDepositWithdrawTokenAccount = "chexchexchex"
  @observable currentAutomatedresAccountToWatch = ""
  @observable currentCpuThresholdLow = 1000
  @observable currentCpuThresholdHigh = 30000
  @observable currentNetThresholdLow = 1000
  @observable currentNetThresholdHigh = 10000
  @observable currentRamThresholdLow = 0
  @observable currentRamThresholdHigh = 2000
  @observable currentMaxEosPrice = "1.0000 EOS"
  @observable currentNotifyAccount = true
  @observable currentNotifyPayer = true
  @observable currentAccountActive = true
  @observable currentAutomatedresPayForUser = "false"
  @observable currentAutomatedresRamBuffer = 1000
  @observable currentAutomatedresBlacklistAccount = ""
  @observable currentAutomatedresPayerEosReserves = 0
  @observable currentAutomatedresPayerLockedRam = 0
  @observable currentAutomatedresPayerChexReserves = 0
  @observable currentAutomatedresPayerEosLiquid = 0
  @observable currentAutomatedresPayerChexLiquid = 0
  @observable currentAutomatedresConfigs = [] as unknown as IObservableArray<IConfigItem>
  // @observable currentAutomatedresConfigs = [] as unknown as IObservableArray<IConfigItem>
  @observable currentArmConfigUpdates = [] as unknown as IObservableArray<any>
  @observable currentAutomatedresBlacklists = [] as unknown as IObservableArray<IBlacklistItem>
  @observable currentAutomatedresTxHistory = [] as unknown as IObservableArray<ILeaseModel>
  @observable currentEosToChexConvertValue = ""
  @observable currentEosToChexConvertedValue = ""

  /******Automatedres Configure Form*****/
  @observable configFormToUpdate = [] as unknown as IObservableArray<IConfigFormItem>

  // Set configFormToUpdate used to record the changes
  @action initConfigTableUpdates = async () => {
    try {
      if (this.configFormToUpdate.length === 0 && this.currentAutomatedresConfigs.length > 0) {
        this.currentAutomatedresConfigs.map((item: IConfigItem, i: number) => {
          this.configFormToUpdate.push({
            key: item.account_to_watch,
            configItem: item,
            enable_delete: false,
            enable_edit: false
          })
        })
      } else {
        return
      }
    } catch (err) {
      console.log("Error initing Configure Table!", err)
    }
  }

  // convert number to boolean for the result gets from eosio contract table
  @action convertArmConfigs = () => {
    const arrayTemp: Array<IConfigItem> = []
    this.currentAutomatedresConfigs.map((item: IConfigItem) => {
      const configItem = { ...item, notify_account: !!item.notify_account, notify_payer: !!item.notify_payer, active: !!item.active }
      arrayTemp.push(configItem)
    })
    this.currentAutomatedresConfigs.replace(arrayTemp)
  }

  @action setFormItemEditable = (item: IConfigFormItem) => {
    if (!item.enable_edit) {
      item.enable_edit = true
    }
  }

  @action setDelMode = (index: number) => {
    this.configFormToUpdate[index].enable_delete = true
  }

  @action resetFormItemChange = (index: number) => {
    this.configFormToUpdate[index].configItem = this.currentAutomatedresConfigs[index]
  }

  @action updateFormItemChange = (index: number, type: string, value: number | boolean | string) => {
    this.configFormToUpdate[index].configItem[type] = value
  }

  @action toggleFormItemChange(item: IConfigFormItem, type: string) {
    this.setFormItemEditable(item)
    item.configItem[type] = !item.configItem[type]
  }

  /******Token decimal specs*******/
  // tslint:disable-next-line: member-ordering
  bidsTableRef: AutoSizer | null = null

  // tslint:disable-next-line: member-ordering
  constructor(rootStore: IRootStore) {
    super(rootStore)
    // @ts-ignore
    // this.countDownCurrentRound.timerObject = setInterval(() => this.updateTime(), 500)
    window.addEventListener("resize", this.windowResize)

    // // Sets the initial state of everything after initially connecting to the express server
    // this.rootStore.socketStore.socket.on(ESocketMessages.handshake, (data: IExpressGlobalStateMessage) => {
    //   // console.log("Handshake: ", data)
    //   this.setCurrentRoundNumber(data.currentRoundNumber)
    //   this.setSelectedBidRound(data.currentRoundNumber)
    //   this.setSelectedBidRoundMultipleStart(data.currentRoundNumber)
    //   this.setSelectedBidRoundMultipleEnd(data.currentRoundNumber)
    //   this.setCurrentRoundEndTime(data.currentRoundEndTime)
    //   this.setCurrentEosPrice(data.eosPrice)
    //   this.setCurrentRoundChexPrice(data.chexPriceEos)
    //   this.setTotalRounds(data.totalRounds)
    //   this.setAuctionRoundsSummaryArray(data.allRoundsSummaryArray)
    //   this.setAllRoundsSummaryUnfiltered(data.allRoundsSummaryUnfiltered)
    //   this.setIsAuctionEnded(false)
    //   this.setContributionsList([]) // Reset contributions for good measure

    //   // We could get the handshake again if the auction resets to a new one, so
    //   // in that case reset the chart too.
    //   if (!this.rootStore.chartStore.firstRequest) {
    //     if (this.rootStore.chartStore.tvChartRef) {
    //       this.rootStore.chartStore.currentMarketRealtimeObj.onresetcacheneededcallback!()
    //       if (this.rootStore.chartStore.tvChartRef) {
    //         this.rootStore.chartStore.tvChartRef.activeChart().resetData()
    //       }
    //       // console.log("Reset chart data for new auction")
    //     }
    //   }

    //   if (localStorage.getItem("affiliate")) {
    //     this.setAffiliateReferral(localStorage.getItem("affiliate") || "")
    //   }

    //   // This will happen if the express server restarts while the user is still logged in. We need to let the express server
    //   // know we are logged in so it will re-subscribe the user for updates.
    //   if (this.rootStore.walletStore.userLoggedIn) {
    //     this.rootStore.socketStore.socket.emit(ESocketMessages.userLoggedIn, this.rootStore.walletStore.accountName)
    //   }
    // })
    // Scroll to top of page between page navigations
    reaction(
      () => this.rootStore.routerStore.location,
      (_data, _reaction) => {
        window.scrollTo(0, 0)
        ReactGA.pageview(this.rootStore.routerStore.location.pathname)
      },
    )
  }

  // @computed get manualBidMemo() {
  //   if (this.isUsingRangeOfRounds && this.selectedBidRoundMultipleEnd !== this.selectedBidRoundMultipleStart) { // Using a range of rounds
  //     return `${this.selectedBidRoundMultipleStart}-${this.selectedBidRoundMultipleEnd}|${this.affiliateReferral}|${this.rootStore.walletStore.accountName || this.rootStore.langStore.safeGetLocalizedString("bidOnChex.senderAccount")}`
  //   } else if (this.isUsingRangeOfRounds && this.selectedBidRoundMultipleEnd === this.selectedBidRoundMultipleStart) {
  //     return `${this.selectedBidRoundMultipleStart}|${this.affiliateReferral}|${this.rootStore.walletStore.accountName || this.rootStore.langStore.safeGetLocalizedString("bidOnChex.senderAccount")}`
  //   } else {
  //     return `${this.selectedBidRoundSingle}|${this.affiliateReferral}|${this.rootStore.walletStore.accountName || this.rootStore.langStore.safeGetLocalizedString("bidOnChex.senderAccount")}`
  //   }
  // }

  // @computed get manualAutomatedresDepositMemo() {
  //   return "deposit to automatedres reserves"
  // }

  // @computed get manualAutomatedresWithdrawMemo() {
  //   return "withdraw from automatedres reserves"
  // }

  // @computed get eosToChexMemo() {
  //   return `1,bnt2eoscnvrt BNT bancorc11155 CHEX,0.00000000,${this.rootStore.walletStore.accountName}`
  // }

  // @computed get currentChexPriceUsd() {
  //   return this.currentRoundChexPrice * this.currentEosPrice
  // }

  @computed get pageDimmerVisible() {
    if (this.teamLightboxOpen || this.productItemBoxOpen || this.industryItemBoxOpen || this.mobileMenuOpen || this.langMenuOpen) {
      return true
    } else {
      return false
    }
  }

  @computed get currentSelectedTeamMemberObject() {
    try {
      return (this.rootStore.langStore.safeGetLocalizedString("advisors").concat(this.rootStore.langStore.safeGetLocalizedString("teamMembers")) as unknown as Array<ITeamMember>).find((e: ITeamMember) => e.name === this.currentSelectedTeamMember)
    } catch (e) {
      return null
    }
  }

  @computed get currentSelectedProductItemObject() {
    try {
      return (this.rootStore.langStore.safeGetLocalizedString("products.productsData") as unknown as Array<ProductItem>).find((e: ProductItem) => e.name === this.currentSelectedProductItem)
    } catch (e) {
      return null
    }
  }

  @computed get currentSelectedIndustryItemObject() {
    try {
      return (this.rootStore.langStore.safeGetLocalizedString("industry.industryData") as unknown as Array<IndustryItem>).find((e: IndustryItem) => e.name === this.currentSelectedIndustryItem)
    } catch (e) {
      return null
    }
  }

  @computed get isMobile() {
    return this.windowWidth < 830 ? true : false
  }

  // // Metrics that include all rounds including current and future
  // @computed get sumEosContributionsAll() {
  //   if (!this.userContributions.length) { return 0 }
  //   return this.userContributions.reduce((a, b) => a + b.quantity, 0)
  // }

  // @computed get sumEosChexPriceAll() {
  //   if (!this.userContributions.length || !this.allRoundsSummaryUnfiltered.length) { return 0 }
  //   return this.userContributions.map((e) => {
  //     return e.quantity * parseFloat(this.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.chexPrice)
  //   }).reduce((a, b) => a + b, 0)
  // }

  // @computed get sumChexReceivedAll() {
  //   if (!this.userContributions.length || !this.allRoundsSummaryUnfiltered.length) { return 0 }
  //   return this.userContributions.map((e) => {
  //     // console.log(e.quantity, " | ", parseFloat(this.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.chexPrice))
  //     return e.quantity / parseFloat(this.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.chexPrice)
  //   }).reduce((a, b) => a + b, 0)
  // }

  // // Metrics for only completed rounds
  // @computed get sumEosContributionsNoFuture() {
  //   if (!this.userContributions.length) { return 0 }
  //   return this.userContributions.reduce((a, b) => a + (b.round >= this.currentRoundNumber && !this.isAuctionEnded ? 0 : b.quantity), 0)
  // }

  // @computed get sumEosChexPriceNoFuture() {
  //   if (!this.userContributions.length || !this.allRoundsSummaryUnfiltered.length) { return 0 }
  //   return this.userContributions.map((e) => {
  //     if (e.round >= this.currentRoundNumber && !this.isAuctionEnded) { return 0 }
  //     return e.quantity * parseFloat(this.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.chexPrice)
  //   }).reduce((a, b) => a + b, 0)
  // }

  // @computed get sumChexReceivedNoFuture() {
  //   if (!this.userContributions.length || !this.allRoundsSummaryUnfiltered.length) { return 0 }
  //   return this.userContributions.map((e) => {
  //     if (e.round >= this.currentRoundNumber && !this.isAuctionEnded) { return 0 }
  //     return e.quantity / parseFloat(this.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.chexPrice)
  //   }).reduce((a, b) => a + b, 0)
  // }

  // @computed get chexIssuedPerRound() {
  //   return 1000000 / 1000
  // }

  /****  Automatedres ****/

  // @computed get tokenName() {
  //   if (this.currentAutomatedresDepositWithdrawTokenAccount === "" || this.currentAutomatedresDepositWithdrawTokenAccount === "chexchexchex") {
  //     return "CHEX"
  //   }
  //   return "EOS"
  // }

  // @computed get payForUser() {
  //   if (this.currentAutomatedresPayForUser === "true") {
  //     return true
  //   } else if (this.currentAutomatedresPayForUser === "false") {
  //     return false
  //   }
  // }

  // @computed get tokenDecimals() {
  //   if (this.currentAutomatedresDepositWithdrawTokenAccount === "chexchexchex") {
  //     return this.chexDecimals
  //   } else if (this.currentAutomatedresDepositWithdrawTokenAccount === "eosio.token") {
  //     return this.eosDecimals
  //   }
  // }

  // @action setAffiliateReferral = (e: string) => {
  //   this.affiliateReferral = e
  //   localStorage.setItem("affiliate", e) // We will read the affiliate from localstorage and fall back to what's in the store
  // }

  // @action setTosConfirmed = (e: boolean) => {
  //   this.tosConfirmed = e
  // }

  // @action setIsAuctionEnded = (e: boolean) => this.isAuctionEnded = e
  // @action setRegionBlocked = (e: number) => this.regionBlocked = e
  // @action togglIsUsingRangeOfRounds = () => this.isUsingRangeOfRounds = !this.isUsingRangeOfRounds
  // @action setSelectedBidRound = (e: number) => this.selectedBidRoundSingle = e
  // @action setSelectedBidRoundMultipleStart = (e: number) => this.selectedBidRoundMultipleStart = e
  // @action setSelectedBidRoundMultipleEnd = (e: number) => this.selectedBidRoundMultipleEnd = e
  @action setSubscribeEmail = (e: string) => this.subscribeEmail = e
  @action toggleMobileMenu = () => { this.mobileMenuOpen = !this.mobileMenuOpen }
  // @action setLoginButtonMousedOver = (e: boolean) => this.loginButtonMousedOver = e
  @action closeTeamLightbox = () => this.teamLightboxOpen = false
  @action closeProductItemBox = () => this.productItemBoxOpen = false
  @action closeIndustryItemBox = () => this.industryItemBoxOpen = false
  // @action setChexEosPriceUpdated = (e: boolean) => this.chexEosPriceUpdated = e
  @action toggleLangMenu = () => this.langMenuOpen = !this.langMenuOpen
  // @action setKycStatus = (e: EKycApproved) => this.kycApproved = e
  // @action setContributionsList = (e: Array<IContributionItem>) => this.userContributions = e
  // @action setAllRoundsSummaryUnfiltered = (e: Array<IRoundSummaryParsed>) => this.allRoundsSummaryUnfiltered.replace(e)
  // @action toggleCurrentFutureContributionsCalculation = () => this.currentFutureContributionsCalculation = !this.currentFutureContributionsCalculation

  // @action setCurrentBidQuantity = (e: string) => {
  // this.currentBidQuantity = e
  // }

  /****** Automatedres *****/

  @action handlePageDimmerClick = () => {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false
    } else if (this.langMenuOpen) {
      this.toggleLangMenu()
    } else if (this.teamLightboxOpen) {
      this.teamLightboxOpen = false
    } else if (this.productItemBoxOpen) {
      this.productItemBoxOpen = false
    } else {
      this.industryItemBoxOpen = false
    }
  }

  @action openTeamLightbox = (e: string) => {
    this.currentSelectedTeamMember = e
    this.teamLightboxOpen = true

    ReactGA.modalview(`team-profile: ${this.currentSelectedTeamMember}`)
  }

  @action openProductItemBox = (e: string) => {
    this.currentSelectedProductItem = e
    this.productItemBoxOpen = true
    ReactGA.modalview(`product-item: ${this.currentSelectedProductItem}`)
  }

  @action openIndustryItemBox = (e: string) => {
    this.currentSelectedIndustryItem = e
    this.industryItemBoxOpen = true
    ReactGA.modalview(`industry-item: ${this.currentSelectedIndustryItem}`)
  }

  @action updateWindowWidth = (e: number) => {
    this.windowWidth = e
    // console.log(`Updating window width in uiStore: ${e}px`)
  }

  @action updateWindowHeight = (e: number) => {
    this.windowHeight = e
    // console.log(`Updating window height in uiStore: ${e}px`)
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  windowResize = () => {
    this.updateWindowWidth(window.innerWidth)
    this.updateWindowHeight(window.innerHeight)
  }

  // Toast notifications
  notifySuccess = (msg: string, duration?: number) => {
    toast(<Success msg={msg} />, {
      autoClose: duration || 5000,
      position: this.windowWidth < 800 ? toast.POSITION.BOTTOM_CENTER : toast.POSITION.TOP_CENTER,
      hideProgressBar: true,
    })
  }

  notifyTxSuccess = (msg: string, txId: string) => {
    toast(<SuccessTx msg={msg} txId={txId} />, {
      autoClose: 5000,
      position: this.windowWidth < 800 ? toast.POSITION.BOTTOM_CENTER : toast.POSITION.TOP_CENTER,
      hideProgressBar: true,
    })
  }

  notifyInfo = (msg: string, duration?: number) => {
    toast(<Info msg={msg} />, {
      autoClose: 5000,
      position: this.windowWidth < 800 ? toast.POSITION.BOTTOM_CENTER : toast.POSITION.TOP_CENTER,
      hideProgressBar: true,
    })
  }

  // submitSubscribeRequest = () => {
  //   if (this.subscribeEmail.match(/\S+@\S+\.\S+/)) {
  //     this.rootStore.socketStore.socket.emit(ESocketMessages.subscribeEmail, this.subscribeEmail)
  //     this.notifySuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.subscribeSuccess"), 15000)
  //     ReactGA.event({
  //       category: "User",
  //       action: "Subscribed Email",
  //     })
  //   } else {
  //     this.notifyError(this.rootStore.langStore.safeGetLocalizedString("notifications.app.invalidEmail"))
  //   }
  // }

  // submitUnsubscribeRequest = (email: string) => {
  //   if (email.match(/\S+@\S+\.\S+/)) {
  //     this.rootStore.socketStore.socket.emit(ESocketMessages.unsubscribeEmail, email)
  //     this.notifySuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.unsubscribeSuccess"), 15000)
  //     ReactGA.event({
  //       category: "User",
  //       action: "Unsubscribed Email",
  //     })
  //   } else {
  //     this.notifyError(this.rootStore.langStore.safeGetLocalizedString("notifications.app.invalidEmail"))
  //   }
  // }
}
