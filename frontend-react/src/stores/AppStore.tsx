/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React from "react"
import { CBaseStore } from "./BaseStore"
import { action, observable, computed, IObservableArray, reaction } from "mobx"
import { IRootStore } from "./RootStore"
import { toast } from "react-toastify"
import { Error, Success, Info, SuccessTx, ChexFees } from "SharedComponents/Notifications"
import moment from "moment"
import { ITeamMember } from "Pages/LandingPage/TeamList/TeamList"
import { ProductItem } from "Pages/LandingPage/Products"
import { IndustryItem } from "Pages/LandingPage/Industry"
import { AutoSizer } from "react-virtualized"
import { ESocketMessages } from "./SocketStore"
import ReactGA from "react-ga"

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    e: any
    ref: any
  }
}

interface IChartDataPoint {
  x: number   // roundNum
  y: number   // price
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
  account: string;
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

// Expess state object that is passed in when we do a handshake
interface IExpressGlobalStateMessage {
  currentRoundNumber: number
  auctionEndTime: string // We don't do anything with this right now but it's here if we need it
  currentRoundEndTime: string
  eosPrice: number
  chexPriceEos: number
  totalRounds: number
  allRoundsSummaryArray: Array<IRoundSummaryParsed>
  chartData: Array<IChartDataPoint> // We don't use this directly. TV chart will request the data it needs.
  allRoundsSummaryUnfiltered: Array<IRoundSummaryParsed>
}

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
  @observable eosDecimals = 4
  @observable chexDecimals = 8

  bidsTableRef: AutoSizer | null = null

  private firstUpdate = true

  constructor(rootStore: IRootStore) {
    super(rootStore)
    // @ts-ignore
    this.countDownCurrentRound.timerObject = setInterval(() => this.updateTime(), 500)
    window.addEventListener("resize", this.windowResize)

    // Detect IP address to block region
    if (process.env.NODE_ENV === "production") {
      fetch("https://get.geojs.io/v1/ip/country.json")
        .then((response: any) => response.json())
        .then((data: any) => {
          // (data.country === "US" || data.country === "CN") ? this.setRegionBlocked(1) : this.setRegionBlocked(0)

          if (data.country === "CN") { data.country = "zh" } // Fix Chinese country code
          // Set user's language based on their IP
          if (this.rootStore.langStore.getAllLangs().includes((data.country as string).toLowerCase())) {
            this.rootStore.langStore.setLang((data.country as string).toLowerCase())
          }
        })
        .catch((err: any) => console.error(err))
    } else {
      this.setRegionBlocked(0)
    }

    // Sets the initial state of everything after initially connecting to the express server
    this.rootStore.socketStore.socket.on(ESocketMessages.handshake, (data: IExpressGlobalStateMessage) => {
      // console.log("Handshake: ", data)
      this.setCurrentRoundNumber(data.currentRoundNumber)
      this.setSelectedBidRound(data.currentRoundNumber)
      this.setSelectedBidRoundMultipleStart(data.currentRoundNumber)
      this.setSelectedBidRoundMultipleEnd(data.currentRoundNumber)
      this.setCurrentRoundEndTime(data.currentRoundEndTime)
      this.setCurrentEosPrice(data.eosPrice)
      this.setCurrentRoundChexPrice(data.chexPriceEos)
      this.setTotalRounds(data.totalRounds)
      this.setAuctionRoundsSummaryArray(data.allRoundsSummaryArray)
      this.setAllRoundsSummaryUnfiltered(data.allRoundsSummaryUnfiltered)
      this.setIsAuctionEnded(false)
      this.setContributionsList([]) // Reset contributions for good measure

      // We could get the handshake again if the auction resets to a new one, so
      // in that case reset the chart too.
      if (!this.rootStore.chartStore.firstRequest) {
        if (this.rootStore.chartStore.tvChartRef) {
          this.rootStore.chartStore.currentMarketRealtimeObj.onresetcacheneededcallback!()
          if (this.rootStore.chartStore.tvChartRef) {
            this.rootStore.chartStore.tvChartRef.activeChart().resetData()
          }
          // console.log("Reset chart data for new auction")
        }
      }

      if (localStorage.getItem("affiliate")) {
        this.setAffiliateReferral(localStorage.getItem("affiliate") || "")
      }

      // This will happen if the express server restarts while the user is still logged in. We need to let the express server
      // know we are logged in so it will re-subscribe the user for updates.
      if (this.rootStore.walletStore.userLoggedIn) {
        this.rootStore.socketStore.socket.emit(ESocketMessages.userLoggedIn, this.rootStore.walletStore.accountName)
      }
    })

    this.rootStore.socketStore.socket.on(ESocketMessages.currentRoundEndTimeUpdate, (data: string) => {
      // console.log("currentRoundEndTimeUpdate: ", data)
      this.setCurrentRoundEndTime(data)
    })

    this.rootStore.socketStore.socket.on(ESocketMessages.currentRoundEndTimeUpdate, (data: string) => {
      // console.log("currentRoundEndTimeUpdate: ", data)
      this.setCurrentRoundEndTime(data)
    })

    // autores history update observable
    this.rootStore.socketStore.socket.on(ESocketMessages.getAutomatedresResponse, (data: Array<ILeaseModel>) => {
      this.setCurrentAutomatedresUserTxHistory(data)
    })

    this.rootStore.socketStore.socket.on(ESocketMessages.chexEosPriceUpdate, (data: number) => {
      // console.log("chexEosPriceUpdate: ", data)
      this.setCurrentRoundChexPrice(data)
    })

    this.rootStore.socketStore.socket.on(ESocketMessages.currentRoundNumberUpdate, (data: number) => {
      // console.log("currentRoundNumberUpdate ", data)
      this.setCurrentRoundNumber(data)

      if (this.selectedBidRoundSingle < data) { this.setSelectedBidRound(data) }
      if (this.selectedBidRoundMultipleStart < data) { this.setSelectedBidRoundMultipleStart(data) }
      if (this.selectedBidRoundMultipleEnd < data) { this.setSelectedBidRoundMultipleEnd(data) }
    })

    this.rootStore.socketStore.socket.on(ESocketMessages.auctionRoundsSummaryArrayUpdate, (data: Array<IRoundSummaryParsed>) => {
      // console.log("auctionRoundsSummaryArrayUpdate ", data)
      this.setAuctionRoundsSummaryArray(data)
    })

    this.rootStore.socketStore.socket.on(ESocketMessages.checkKycStatusResp, (approved: number) => {
      // console.log("checkKycStatusResp: ", approved)
      if (approved) {
        this.setKycStatus(1)
      } else {
        this.setKycStatus(0)
      }
    })

    this.rootStore.socketStore.socket.on(ESocketMessages.allRoundsSummaryUnfilteredUpdate, (data: Array<IRoundSummaryParsed>) => {
      this.setAllRoundsSummaryUnfiltered(data)
    })

    this.rootStore.socketStore.socket.on(ESocketMessages.contributionsListUpdate, (data: Array<IContributionItem>) => {
      // console.log("Contributions list update: ", data)
      this.setContributionsList(data)
    })

    // Scroll to top of page between page navigations
    reaction(
      () => this.rootStore.routerStore.location,
      (_data, _reaction) => {
        window.scrollTo(0, 0)
        ReactGA.pageview(this.rootStore.routerStore.location.pathname)
      },
    )
  }

  @computed get currentNewConfigure() {
    return {
      account_to_watch: this.currentAutomatedresAccountToWatch,
      cpu_threshold_low_us: this.currentCpuThresholdLow,
      cpu_threshold_high_us: this.currentCpuThresholdHigh,
      net_threshold_low_bytes: this.currentNetThresholdLow,
      net_threshold_high_bytes: this.currentNetThresholdHigh,
      ram_threshold_low_bytes: this.currentRamThresholdLow,
      ram_threshold_high_bytes: this.currentRamThresholdHigh,
      max_price_per_eos: this.currentMaxEosPrice,
      notify_payer: this.currentNotifyPayer,
      notify_account: this.currentNotifyAccount,
      active: this.currentAccountActive
    }
  }

  @computed get shouldShowKycWarning() {
    if (!this.rootStore.walletStore.userLoggedIn) { return true }
    if (this.kycApproved !== EKycApproved.completed) { return true }

    return false
  }

  @computed get manualBidMemo() {
    if (this.isUsingRangeOfRounds && this.selectedBidRoundMultipleEnd !== this.selectedBidRoundMultipleStart) { // Using a range of rounds
      return `${this.selectedBidRoundMultipleStart}-${this.selectedBidRoundMultipleEnd}|${this.affiliateReferral}|${this.rootStore.walletStore.accountName || this.rootStore.langStore.safeGetLocalizedString("bidOnChex.senderAccount")}`
    } else if (this.isUsingRangeOfRounds && this.selectedBidRoundMultipleEnd === this.selectedBidRoundMultipleStart) {
      return `${this.selectedBidRoundMultipleStart}|${this.affiliateReferral}|${this.rootStore.walletStore.accountName || this.rootStore.langStore.safeGetLocalizedString("bidOnChex.senderAccount")}`
    } else {
      return `${this.selectedBidRoundSingle}|${this.affiliateReferral}|${this.rootStore.walletStore.accountName || this.rootStore.langStore.safeGetLocalizedString("bidOnChex.senderAccount")}`
    }
  }

  @computed get manualAutomatedresDepositMemo() {
    return "deposit to automatedres reserves"
  }

  @computed get manualAutomatedresWithdrawMemo() {
    return "withdraw from automatedres reserves"
  }

  @computed get eosToChexMemo() {
    return `1,bnt2eoscnvrt BNT bancorc11155 CHEX,0.00000000,${this.rootStore.walletStore.accountName}`
  }

  @computed get currentChexPriceUsd() {
    return this.currentRoundChexPrice * this.currentEosPrice
  }

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

  // Metrics that include all rounds including current and future
  @computed get sumEosContributionsAll() {
    if (!this.userContributions.length) { return 0 }
    return this.userContributions.reduce((a, b) => a + b.quantity, 0)
  }

  @computed get sumEosChexPriceAll() {
    if (!this.userContributions.length || !this.allRoundsSummaryUnfiltered.length) { return 0 }
    return this.userContributions.map((e) => {
      return e.quantity * parseFloat(this.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.chexPrice)
    }).reduce((a, b) => a + b, 0)
  }

  @computed get sumChexReceivedAll() {
    if (!this.userContributions.length || !this.allRoundsSummaryUnfiltered.length) { return 0 }
    return this.userContributions.map((e) => {
      // console.log(e.quantity, " | ", parseFloat(this.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.chexPrice))
      return e.quantity / parseFloat(this.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.chexPrice)
    }).reduce((a, b) => a + b, 0)
  }

  // Metrics for only completed rounds
  @computed get sumEosContributionsNoFuture() {
    if (!this.userContributions.length) { return 0 }
    return this.userContributions.reduce((a, b) => a + (b.round >= this.currentRoundNumber && !this.isAuctionEnded ? 0 : b.quantity), 0)
  }

  @computed get sumEosChexPriceNoFuture() {
    if (!this.userContributions.length || !this.allRoundsSummaryUnfiltered.length) { return 0 }
    return this.userContributions.map((e) => {
      if (e.round >= this.currentRoundNumber && !this.isAuctionEnded) { return 0 }
      return e.quantity * parseFloat(this.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.chexPrice)
    }).reduce((a, b) => a + b, 0)
  }

  @computed get sumChexReceivedNoFuture() {
    if (!this.userContributions.length || !this.allRoundsSummaryUnfiltered.length) { return 0 }
    return this.userContributions.map((e) => {
      if (e.round >= this.currentRoundNumber && !this.isAuctionEnded) { return 0 }
      return e.quantity / parseFloat(this.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.chexPrice)
    }).reduce((a, b) => a + b, 0)
  }

  @computed get chexIssuedPerRound() {
    return 1000000 / 1000
  }

  /****  Automatedres ****/

  @computed get tokenName() {
    if (this.currentAutomatedresDepositWithdrawTokenAccount === "" || this.currentAutomatedresDepositWithdrawTokenAccount === "chexchexchex") {
      return "CHEX"
    }
    return "EOS"
  }

  @computed get payForUser() {
    if (this.currentAutomatedresPayForUser === "true") {
      return true
    } else if (this.currentAutomatedresPayForUser === "false") {
      return false
    }
  }

  @computed get tokenDecimals() {
    if (this.currentAutomatedresDepositWithdrawTokenAccount === "chexchexchex") {
      return this.chexDecimals
    } else if (this.currentAutomatedresDepositWithdrawTokenAccount === "eosio.token") {
      return this.eosDecimals
    }
  }

  @action setAffiliateReferral = (e: string) => {
    this.affiliateReferral = e
    localStorage.setItem("affiliate", e) // We will read the affiliate from localstorage and fall back to what's in the store
  }

  @action setTosConfirmed = (e: boolean) => {
    this.tosConfirmed = e
  }

  @action setIsAuctionEnded = (e: boolean) => this.isAuctionEnded = e
  @action setRegionBlocked = (e: number) => this.regionBlocked = e
  @action togglIsUsingRangeOfRounds = () => this.isUsingRangeOfRounds = !this.isUsingRangeOfRounds
  @action setSelectedBidRound = (e: number) => this.selectedBidRoundSingle = e
  @action setSelectedBidRoundMultipleStart = (e: number) => this.selectedBidRoundMultipleStart = e
  @action setSelectedBidRoundMultipleEnd = (e: number) => this.selectedBidRoundMultipleEnd = e
  @action setSubscribeEmail = (e: string) => this.subscribeEmail = e
  @action toggleMobileMenu = () => { this.mobileMenuOpen = !this.mobileMenuOpen }
  @action setLoginButtonMousedOver = (e: boolean) => this.loginButtonMousedOver = e
  @action closeTeamLightbox = () => this.teamLightboxOpen = false
  @action closeProductItemBox = () => this.productItemBoxOpen = false
  @action closeIndustryItemBox = () => this.industryItemBoxOpen = false
  @action setChexEosPriceUpdated = (e: boolean) => this.chexEosPriceUpdated = e
  @action toggleLangMenu = () => this.langMenuOpen = !this.langMenuOpen
  @action setKycStatus = (e: EKycApproved) => this.kycApproved = e
  @action setContributionsList = (e: Array<IContributionItem>) => this.userContributions = e
  @action setAllRoundsSummaryUnfiltered = (e: Array<IRoundSummaryParsed>) => this.allRoundsSummaryUnfiltered.replace(e)
  @action toggleCurrentFutureContributionsCalculation = () => this.currentFutureContributionsCalculation = !this.currentFutureContributionsCalculation

  @action setCurrentBidQuantity = (e: string) => {
    this.currentBidQuantity = e
  }

  /****** Automatedres *****/
  @action addCurrentNewConfig() {
    try {
      this.currentArmConfigUpdates.push(
        {
          account: "automatedres",
          name: "configure",
          authorization: [
            {
              actor: this.rootStore.walletStore.currentUserAccountName,
              permission: this.rootStore.walletStore.scatter.account("eos").authority,
            },
          ],
          data: {
            payer: this.rootStore.walletStore.currentUserAccountName,
            config: this.currentNewConfigure
          },
        }
      )
    }
    catch (e) {
      console.error(e)
    }
  }

  @action addTransactionAction = (e: any) => {
    this.currentArmConfigUpdates.push(e)
  }

  @action addConfigureUpdates = () => {
    this.configFormToUpdate.map((item: IConfigFormItem) => {
      if (item.enable_edit && !item.enable_delete) {
        this.addTransactionAction({
          account: process.env.REACT_APP_AUTOMATEDRES_ACCOUNT || "automatedres",
          name: "configure",
          authorization: [
            {
              actor: this.rootStore.walletStore.currentUserAccountName,
              permission: this.rootStore.walletStore.scatter.account("eos").authority,
            },
          ],
          data: {
            payer: this.rootStore.walletStore.currentUserAccountName,
            config: item.configItem
          }
        })
      }
    })
  }

  // add Del records to the batch config updates
  @action addDelRecord = (selectedAccount: string) => {
    this.addTransactionAction({
      account: process.env.REACT_APP_AUTOMATEDRES_ACCOUNT || "automatedres",
      name: "delconftab",
      authorization: [
        {
          actor: this.rootStore.walletStore.currentUserAccountName,
          permission: this.rootStore.walletStore.scatter.account("eos").authority,
        },
      ],
      data: {
        payer: this.rootStore.walletStore.currentUserAccountName,
        account_to_watch: selectedAccount
      }
    })
  }

  @action clearCurrentArmConfigUpdates = () => {
    this.currentArmConfigUpdates.replace([])
    this.configFormToUpdate.replace([])
    this.initConfigTableUpdates()
  }

  @action setCurrentAutomatedresQuantity = (e: string) => {
    this.currentAutomatedresDepositWithdrawQuantity = e
  }

  @action setCurrentAutomatedresTokenAccount = (e: string) => {
    this.currentAutomatedresDepositWithdrawTokenAccount = e
    if (e === "eosio.token") {
      this.notifyChexFees(this.rootStore.langStore.safeGetLocalizedString("leasingTables.payerTable.convertChex"), 25000)
    }
  }

  @action toggleNewConfigRow = () => { this.showNewConfigRow = !this.showNewConfigRow }

  @action setCurrentAutomatedresAccountToWatch = (e: string) => {
    this.currentAutomatedresAccountToWatch = e
  }
  @action setCurrentCpuThresholdLow = (e: number) => {
    this.currentCpuThresholdLow = e
  }
  @action setCurrentCpuThresholdHigh = (e: number) => {
    this.currentCpuThresholdHigh = e
  }
  @action setCurrentNetThresholdLow = (e: number) => {
    this.currentNetThresholdLow = e
  }
  @action setCurrentNetThresholdHigh = (e: number) => {
    this.currentNetThresholdHigh = e
  }
  @action setCurrentRamThresholdLow = (e: number) => {
    this.currentRamThresholdLow = e
  }
  @action setCurrentRamThresholdHigh = (e: number) => {
    this.currentRamThresholdHigh = e
  }
  @action setCurrentMaxEosPrice = (e: string) => {
    this.currentMaxEosPrice = e
  }
  @action toggleCurrentNotifyAccount = () => {
    this.currentNotifyAccount = !this.currentNotifyAccount
  }
  @action toggleCurrentNotifyPayer = () => {
    this.currentNotifyPayer = !this.currentNotifyPayer
  }
  @action toggleCurrentAccountActive = () => {
    this.currentAccountActive = !this.currentAccountActive
  }
  @action setCurrentAutomatedresPayForUser = (e: string) => {
    this.currentAutomatedresPayForUser = e
  }
  @action setCurrentAutomatedresRamBuffer = (e: number) => {
    this.currentAutomatedresRamBuffer = e
  }
  @action setCurrentAutomatedresBlacklistAccount = (e: string) => {
    this.currentAutomatedresBlacklistAccount = e
  }

  @action setCurrentAutomatedresUserTxHistory = (e: Array<ILeaseModel>) => {
    this.currentAutomatedresTxHistory.replace(e)
  }

  @action setEosToChexConvertValue = (e: string) => {
    this.currentEosToChexConvertValue = e
    fetch(`https://api.bancor.network/0.1/currencies/5a1eb3753203d200012b8b75/value?toCurrencyId=5ca9c443b86b7f9c661bf0d6&fromAmount=${e || "0"}`)
      .then((response: any) => response.json())
      .then((data: any) => this.currentEosToChexConvertedValue = String(Number(data.data) / 10000))
  }

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

  /////////////////////////////////////////////////////////////////////
  // Auction state updaters
  @action setAuctionRoundsSummaryArray = (e: Array<IRoundSummaryParsed>) => {
    this.auctionRoundsSummaryArray.replace(e)
    try {
      if (this.bidsTableRef) { this.bidsTableRef.forceUpdate() }
    } catch (e) {
      console.error(e)
    }
  }

  @action setCurrentRoundEndTime = (e: string) => {
    if (!e) { return }
    // First just update our round end time variable
    this.currentRoundEndTime = moment.utc(e).format()

    try {
      // Now update the duration of the countdown to reflect the end time of the new round
      // console.log("///////////////////////////////////////////////////////////////////////////////////////////////")
      // console.log("currentRoundEndTime: ", moment.utc(this.currentRoundEndTime).unix())
      // console.log(moment.utc(this.currentRoundEndTime).format())
      // console.log("currentTime: ", moment.utc().unix())
      // console.log("endTime - currentTime: ", moment.utc(this.currentRoundEndTime).unix() - moment.utc().unix())
      // console.log("///////////////////////////////////////////////////////////////////////////////////////////////")
      this.countDownCurrentRound.duration = moment.duration((moment.utc(this.currentRoundEndTime).unix() - moment.utc().unix()) * 1000, "milliseconds")
    } catch (e) {
      // Catch errors if currentRoundEndTime isn't a valid date
      console.error(e)
    }
  }

  @action setTotalRounds = (e: number) => this.totalAuctionRounds = e
  @action setCurrentRoundNumber = (e: number) => this.currentRoundNumber = e
  @action setCurrentEosPrice = (e: number) => this.currentEosPrice = e

  @action setCurrentRoundChexPrice = (e: number) => {
    this.currentRoundChexPrice = e
    if (!this.firstUpdate) {
      this.setChexEosPriceUpdated(true)
      setTimeout(() => this.setChexEosPriceUpdated(false), 650)
    } else {
      this.firstUpdate = false
    }
  }

  // Includes a safety check to hold the timer at 0 if a negative number arises due to synchronization issues
  @action updateTime() {
    this.countDownCurrentRound.duration = moment.duration(this.countDownCurrentRound.duration.asMilliseconds() - 500, "milliseconds")
    this.countDownCurrentRound.days = moment.duration(this.countDownCurrentRound.duration).days() < 0 ? 0 : moment.duration(this.countDownCurrentRound.duration).days()
    this.countDownCurrentRound.hours = moment.duration(this.countDownCurrentRound.duration).hours() < 0 ? 0 : moment.duration(this.countDownCurrentRound.duration).hours()
    this.countDownCurrentRound.minutes = moment.duration(this.countDownCurrentRound.duration).minutes() < 0 ? 0 : moment.duration(this.countDownCurrentRound.duration).minutes()
    this.countDownCurrentRound.seconds = moment.duration(this.countDownCurrentRound.duration).seconds() < 0 ? 0 : moment.duration(this.countDownCurrentRound.duration).seconds()

    // At the end of the last round force a redraw of the bids table to remove the "in-progress" status
    if (this.countDownCurrentRound.seconds === 0 && this.countDownCurrentRound.minutes === 0 && this.countDownCurrentRound.hours === 0 && this.countDownCurrentRound.days === 0) {
      if (this.currentRoundNumber === this.totalAuctionRounds) {
        try {
          if (this.bidsTableRef) { this.bidsTableRef.forceUpdate() }
          // Set the auction as complete
          this.setIsAuctionEnded(false)
        } catch (e) {
          console.error(e)
        }
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  stopTimerCurrentRound = () => clearInterval(this.countDownCurrentRound.timerObject)

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

  notifyChexFees = (msg: string, duration?: number) => {
    toast(<ChexFees msg={msg} />, {
      autoClose: 5000,
      position: this.windowWidth < 800 ? toast.POSITION.BOTTOM_CENTER : toast.POSITION.TOP_CENTER,
      hideProgressBar: true,
    })
  }

  notifyError = (msg: any, duration?: number) => {
    toast(<Error msg={msg} />, {
      autoClose: duration || 5000,
      position: this.windowWidth < 800 ? toast.POSITION.BOTTOM_CENTER : toast.POSITION.TOP_CENTER,
      hideProgressBar: true,
    })
  }

  submitSubscribeRequest = () => {
    if (this.subscribeEmail.match(/\S+@\S+\.\S+/)) {
      this.rootStore.socketStore.socket.emit(ESocketMessages.subscribeEmail, this.subscribeEmail)
      this.notifySuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.subscribeSuccess"), 15000)
      ReactGA.event({
        category: "User",
        action: "Subscribed Email",
      })
    } else {
      this.notifyError(this.rootStore.langStore.safeGetLocalizedString("notifications.app.invalidEmail"))
    }
  }

  submitUnsubscribeRequest = (email: string) => {
    if (email.match(/\S+@\S+\.\S+/)) {
      this.rootStore.socketStore.socket.emit(ESocketMessages.unsubscribeEmail, email)
      this.notifySuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.unsubscribeSuccess"), 15000)
      ReactGA.event({
        category: "User",
        action: "Unsubscribed Email",
      })
    } else {
      this.notifyError(this.rootStore.langStore.safeGetLocalizedString("notifications.app.invalidEmail"))
    }
  }

  safeUpdateBidsTableRef = () => {
    if (!this.bidsTableRef) {
      return;
    }
    this.bidsTableRef.forceUpdate();
  }
}
