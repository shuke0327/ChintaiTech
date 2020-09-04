/*****************
 * Andrew Coutts
 * 2019
 * This file manages the state of the trading view chart component
 *****************/
import { CBaseStore } from "stores/BaseStore"
import { action, computed, IObservableArray, observable } from "mobx"
import moment from "moment"
import { IRootStore } from "stores/RootStore"
import { ESocketMessages } from "stores/SocketStore"
import { ColorRed, ColorGreen } from "lib/GlobalStyles"

/********************************************************
 * Oracle types
 ********************************************************/
interface ICandleModelTradingView {
  time: number // Tradingview chart API needs this to be called time in epoch seconds and not a string timestamp
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface ISparklineModel {
  timestamp: string
  price: number
}
/*------------------------------------------------------*/

/********************************************************
 * Frontend types
 ********************************************************/
interface IGetChartDataRequest {
  symbol: string
  from: number
  to: number
  interval: number
  firstRequest: boolean
}

const supportedResolutions = ["1"]
/*------------------------------------------------------*/

// Make typescript happy so we can use the global window object
declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    tvWidget: any
    TradingView: any
    tvObj: any
  }
}

export class CTVSymbol {
  /* tslint:disable:variable-name */
  // These variable names are the spec given by TradingView so we have
  // to honor them. Disable tslint for this block so it doesn't complain
  // about requiring camel case variable names.
  name: string
  ticker: string
  description: string
  type: string = "crypto"
  session: string = "24x7"
  exchange: string = "Chintai.io"
  listed_exchange: string = "Chintai"
  timezone: string = "Etc/UTC"
  minmov: number = 1
  pricescale: number = 100000000
  minmove2: number = 0
  fractional: boolean = false
  has_intraday: boolean = true
  supported_resolutions = supportedResolutions
  intraday_multipliers: Array<string> = ["1"]
  has_seconds: boolean = false
  // seconds_multipliers: Array<string> = ["10"]
  has_daily: boolean = false
  has_weekly_and_monthly: boolean = false
  has_empty_bars: boolean = false
  force_session_rebuild: boolean = true
  has_no_volume: boolean = true
  // volume_precision: number // Why did I comment this? Can't remember if we need this or not still.
  data_status: string = "streaming"
  expired: boolean = false
  expiration_date: string = ""
  sector: string = ""
  industry: string = ""
  currency_code: string = "EOS"

  constructor(ticker: string) {
    this.name = ticker
    this.ticker = ticker
    this.description = ticker.toUpperCase()
  }
  /* tslint:enable:variable-name */
}

interface IHistoryApi {
  onHistoryCallback: (bars: Array<ICandleModelTradingView>, { noData }: { noData: boolean }) => void
  onErrorCallback: () => void
}

export interface ICurrentMarketRealtimeObj {
  subscribed: boolean
  symbolinfo: CTVSymbol | null
  resolution: string
  onrealtimecallback: ((bar: ICandleModelTradingView) => void) | null
  subscribeuid: string
  onresetcacheneededcallback: (() => void) | null
  lastBar: ICandleModelTradingView
  historyApi: IHistoryApi
}

interface ITVConfigExchange {
  value: string
  name: string
  desc: string
}

interface ITVConfigSymbolsTypes {
  name: string
  value: string
}

export interface ITVConfigDataObject {
  exchanges: Array<ITVConfigExchange>
  symbols_types: Array<ITVConfigSymbolsTypes>
  supported_resolutions: Array<string>
  supports_marks: boolean
  supports_timescale_marks: boolean
  supports_time: boolean
  futures_regex: string
}

export interface ITVChartRef {
  activeChart(): any
  setSymbol(symbol: string, interval: string, callback: () => void): void
  setLanguage(locale: string): void
  resetData(): void
}

const sleep = async () => new Promise((resolve, _reject) => setTimeout(resolve, 500))

// Our custom JS API object implementation for TradingView - https://github.com/tradingview/charting_library/wiki/JS-Api
class CTradingViewJSAPIImplementation {
  private rootStore: IRootStore
  private currentMarketRealtimeObj = {} as ICurrentMarketRealtimeObj
  private tvSymbolsArray: IObservableArray<CTVSymbol> = [] as any

  constructor(currentMarketRealtimeObj: ICurrentMarketRealtimeObj, rootStore: IRootStore, tvSymbolsArray: IObservableArray<CTVSymbol>) {
    this.currentMarketRealtimeObj = currentMarketRealtimeObj
    this.rootStore = rootStore
    this.tvSymbolsArray = tvSymbolsArray
    window.tvObj = this.currentMarketRealtimeObj
  }

  onReady = (cb: (config: ITVConfigDataObject) => void) => {
    // console.log(`// onReady running`)

    // Configuration object to pass in. Using defaults for everything except resolutions
    const config: ITVConfigDataObject = {
      exchanges: [],
      symbols_types: [],
      supported_resolutions: supportedResolutions,
      supports_marks: false,
      supports_timescale_marks: false,
      supports_time: false,
      futures_regex: "",
    }

    this.rootStore.chartStore.updateTvChartRef(window.tvWidget)
    // window.tvWidget = null
    // window.TradingView = null

    // Return asynchronously
    setTimeout(() => {
      cb(config)
    }, 0)
  }

  resolveSymbol = (symbolName: string | undefined, onSymbolResolvedCallback: (symbol: CTVSymbol) => void, onResolveErrorCallback: (error: string) => void) => {
    // console.log(`// resolveSymbol running: symbolName: ${symbolName}`)
    if (!symbolName || symbolName === undefined) {
      setTimeout(() => {
        // console.log(`Calling error callback on resolveSymbol`)
        onResolveErrorCallback("Symbol null")
      }, 0)
      return
    }

    if (symbolName.includes(":")) {
      symbolName = symbolName.split(":").pop()
    }

    const symbolInfo = this.tvSymbolsArray.find((e) => e.ticker === symbolName)

    if (symbolInfo === undefined || !symbolInfo) {
      setTimeout(() => {
        // console.log(`Calling error callback on resolveSymbol`)
        onResolveErrorCallback("Symbol invalid")
      }, 0)
    } else {
      setTimeout(() => {
        onSymbolResolvedCallback(symbolInfo)
      }, 0)
    }
  }

  getBars = async (symbolInfo: CTVSymbol, resolution: string, from: number, to: number, onHistoryCallback: () => void, onErrorCallback: () => void, firstDataRequest: boolean) => {
    // console.log("// getBars running")
    // console.log(resolution)
    const urlInterval = resolution === "D" ? 60 * 60 * 24 : resolution === "1D" ? 60 * 60 * 24 : resolution === "30S" ? 1 : resolution === "15S" ? 1 : resolution === "10S" ? 1 : resolution === "5S" ? 1 : resolution === "1S" ? 1 : parseInt(resolution, 10) * 60
    // Set references for our callbacks that will be called when the data returns later
    this.currentMarketRealtimeObj.historyApi.onHistoryCallback = onHistoryCallback
    this.currentMarketRealtimeObj.historyApi.onErrorCallback = onErrorCallback

    // Request chart data through the websocket
    const reqData: IGetChartDataRequest = {
      symbol: symbolInfo.name,
      from,
      to,
      interval: urlInterval,
      firstRequest: firstDataRequest,
    }
    // console.log("getBars: ", reqData)
    this.rootStore.socketStore.socket.emit(ESocketMessages.getHistory, reqData)
  }

  subscribeBars = (symbolInfo: CTVSymbol, resolution: string, onRealtimeCallback: (bar: ICandleModelTradingView) => void, subscribeUID: string, onResetCacheNeededCallback: () => void) => {
    // console.log("// subscribeBars runnning")
    this.currentMarketRealtimeObj.symbolinfo = symbolInfo
    this.currentMarketRealtimeObj.resolution = resolution
    this.currentMarketRealtimeObj.onrealtimecallback = onRealtimeCallback
    this.currentMarketRealtimeObj.subscribeuid = subscribeUID
    this.currentMarketRealtimeObj.onresetcacheneededcallback = onResetCacheNeededCallback
    this.currentMarketRealtimeObj.subscribed = true
  }

  unsubscribeBars = (_subscriberUID: string) => {
    // console.log(`// unsubscribeBars running: ${subscriberUID}`)
    this.currentMarketRealtimeObj.subscribed = false
  }

  calculateHistoryDepth = (resolution: string, resolutionBack: string, intervalBack: number) => {
    // console.log("// calculateHistoryDepth running")
    // console.log(resolution, resolutionBack, intervalBack)
    // Force TV to request data in small chunks at a time to load the chart faster
    // switch (resolution) {
    //   case "1S":
    //   case "5S":
    //   case "10S":
    //   case "15S":
    //   case "30S":
    //   case "1":
    //     resolutionBack = "D"
    //     intervalBack = 0.1
    //     break

    //   case "2":
    //   case "3":
    //   case "5":
    //     resolutionBack = "D"
    //     intervalBack = 0.5 // Request data 0.5D at a time
    //     break

    //   case "10":
    //   case "15":
    //   case "30":
    //   case "45":
    //   case "60":
    //     resolutionBack = "D"
    //     intervalBack = 7 // Request data 7D at a time
    //     break

    //   default:
    //     resolutionBack = "D"
    //     intervalBack = 30 // Request data 30D at a time
    //     break
    // }
    return { resolutionBack: "D", intervalBack: 240 } // Leaving unimplemented so the user can always view the entire auction data
  }

  ///////////////////////////////////////////////////////////////
  // Unimplemented methods that we could potentially use someday
  ///////////////////////////////////////////////////////////////
  // searchSymbols = (userInput, exchange, symbolType, onResultReadyCallback) => {
  //   // console.log(`// Search Symbols running: userInput: ${userInput} | exchange: ${exchange} | symbolType: ${symbolType}`)
  // }
  // getMarks = (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
  //   // console.log("// getMarks running")
  // }
  // getTimeScaleMarks = (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
  //   // console.log("// getTimeScaleMarks running")
  // }
  // getServerTime = cb => {
  //   // This is normally used for TV to sync up the countdown timer on the chart. But since we syncrhonize using block ticks, this
  //   // doesn't apply to us now so this remains unimplemented.

  //   // console.log("// getServerTime running")
  //   // this.rootStore.getSocketStore().getServerTime(cb)
  // }
}

export class CChartStore extends CBaseStore {
  @observable tvSymbolsArray: IObservableArray<CTVSymbol> = [] as any
  @observable chartInterval: number = 1
  @observable tvChartRef: ITVChartRef | null = null

  // Used to hold realtime callbacks and current symbol info
  currentMarketRealtimeObj: ICurrentMarketRealtimeObj = {
    subscribed: false,
    symbolinfo: null,
    resolution: "",
    onrealtimecallback: null,
    subscribeuid: "",
    onresetcacheneededcallback: null,
    lastBar: {
      time: 0,
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      volume: 0,
    },
    historyApi: {} as IHistoryApi,
  }

  firstRequest = true

  constructor(rootStore: IRootStore) {
    super(rootStore)
    // NOTE: CTVSymbol objects are now initialized in MarketsStore.ts in the websocket handler for 'ESocketMsgFromExpress.marketObjectUpdate'
    this.addTvSymbolObj(new CTVSymbol("WBI/EOS"))

    this.rootStore.socketStore.socket.on(ESocketMessages.getHistoryResp, (data: Array<ICandleModelTradingView>) => {
      this.processBarsResponse(data)
    })

    // // Called when a market's candle is updated
    this.rootStore.socketStore.socket.on(ESocketMessages.chartDataUpdate, (data: ICandleModelTradingView) => {
      this.realtimeChartCandleTickUpdate(data)
    })
  }

  // TODO: why is this in a computed property?
  @computed get widgetOptions(): any {
    return {
      debug: false,
      theme: "Light",
      symbol: `${this.rootStore.projectsStore.projectDetails.chartMarket}`,
      datafeed: new CTradingViewJSAPIImplementation(this.currentMarketRealtimeObj, this.rootStore, this.tvSymbolsArray),
      interval: this.chartInterval,
      container_id: "tv_chart_container",
      library_path: "/chart/",
      locale: this.rootStore.langStore.safeGetCurrentLang,
      disabled_features: ["remove_library_container_border", "pane_context_menu", "timeframes_toolbar", "left_toolbar", "border_around_the_chart", "create_volume_indicator_by_default", "border_around_the_chart", "header_fullscreen_button", "header_undo_redo", "header_indicators", "header_screenshot", "control_bar", "header_settings", "header_chart_type", "header_resolutions", "header_widget_dom_node", "header_symbol_search", "study_templates", "compare_symbol", "header_compare", "show_hide_button_in_legend", "header_saveload"],
      enabled_features: ["use_localstorage_for_settings", "display_market_status", "side_toolbar_in_fullscreen_mode", "move_logo_to_main_pane", "hide_left_toolbar_by_default"],
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      fullscreen: false,
      autosize: true,
      studies_overrides: {
        "volume.volume.color.0": ColorRed, // Down color
        "volume.volume.color.1": ColorGreen, // Up color
      },
      overrides: {
        "mainSeriesProperties.style": 3,
        "paneProperties.vertGridProperties.color": "#FFFFFF",
        "paneProperties.horzGridProperties.color": "#FFFFFF",
        "paneProperties.crossHairProperties.color": "#989898",
        "mainSeriesProperties.areaStyle.color1": "#0d78ca",
        "mainSeriesProperties.areaStyle.color2": "#ffffff",
        "mainSeriesProperties.areaStyle.linecolor": "#0d78ca",
        "mainSeriesProperties.areaStyle.linewidth": 2,
      },
    }
  }

  @action updateTvChartRef = (e: ITVChartRef | null) => {
    this.tvChartRef = e
  }

  @action addTvSymbolObj = (e: CTVSymbol) => {
    this.tvSymbolsArray.push(e)
  }

  // Callback when the socketStore gets a response for a get bars request
  processBarsResponse = (barData: Array<ICandleModelTradingView>) => {
    // console.log("lastBar: ", this.currentMarketRealtimeObj.lastBar)
    // console.log(barData)
    // ~ Handle an edge case where the DB is freshly initialized with no bars in it but the datascraper is sending realtime updates to the frontend, so we need to give tradingview a bar to start with
    if (this.firstRequest) {
      if (!barData.length) {
        // ~ console.log(`Warning: zero length on bar response, means the DB of bars is empty. Providing TV a dummy candle to start with`);
        const dummyBar = {
          time: 0,
          open: 0,
          high: 0,
          low: 0,
          close: 0,
          volume: 0,
        }
        this.currentMarketRealtimeObj.lastBar = dummyBar
      } else {
        // console.log(`First data request, setting last bar`)
        // console.log(barData[barData.length - 1])
        this.currentMarketRealtimeObj.lastBar = barData[barData.length - 1]
      }
      this.firstRequest = false
    }

    // console.log(`Handling response for bars data:`)
    // console.log(barData)
    // console.log(this.currentMarketRealtimeObj.lastBar)
    // this.currentMarketRealtimeObj.lastBar = barData[barData.length - 1]
    // // console.log(this.currentMarketRealtimeObj.lastBar)

    // if (!this.currentMarketRealtimeObj.lastBar) {
    //   this.currentMarketRealtimeObj.lastBar = {
    //     time: 0,
    //     open: 0,
    //     high: 0,
    //     low: 0,
    //     close: 0,
    //     volume: 0,
    //   }
    // }

    // If we get an empty response then that"s the end of the data so we notify the TV api with the "noData:true" flag
    if (barData.length) {
      // console.log(`sending noData false`)
      this.currentMarketRealtimeObj.historyApi.onHistoryCallback(barData, { noData: false })
    } else {
      // console.log(`sending noData true`)
      this.currentMarketRealtimeObj.historyApi.onHistoryCallback(barData, { noData: true })
    }
  }

  // Called when socketStore gets a new candle tick from the express server.
  // We need to process this tick and either update the current bar on screen
  // or create a new bar and send the updated/new bar to TV through the callback.
  // TODO: verify UTC parsing is correct with moment() calls
  realtimeChartCandleTickUpdate = (dataCandle: ICandleModelTradingView) => {
    // console.log(`chartStore: received a new market tick: ${dataCandle.time} | Last: ${dataCandle.close} | Volume: ${dataCandle.volume}`)
    if (!this.currentMarketRealtimeObj.subscribed) {
      return
    }

    // Get the last bar we processed so we can update it if we don't need to start a new one yet
    const lastBar = this.currentMarketRealtimeObj.lastBar

    let rounded = moment.utc(dataCandle.time)

    // The current resolution of the user's chart
    let resolution = this.currentMarketRealtimeObj.resolution

    switch (resolution) {
      case "D":
        // Round the latest tick time to the nearest day
        rounded = moment(dataCandle.time)
          .utc()
          .startOf("day")
        // console.log("rounded(Day): " + rounded)
        break

      case "1S":
      case "5S":
      case "10S":
      case "15S":
      case "30S":
        // Since the API speaks in seconds, we just need to strip off the "S" for the "seconds" resolution cases
        resolution = resolution.substr(0, resolution.indexOf("S"))
        // console.log("Resolution for seconds case after stripping off S: " + resolution)
        break

      default:
        // Default case is we are dealing with a resolution in minutes, so we just multiply it by 60
        // to get the appropriate value in seconds which is what the public API speaks in.
        resolution = (parseInt(resolution, 10) * 60).toString()
        break
    }

    // Do the rounding on values that aren"t 1D since we already did that in the switch statement
    if (resolution !== "D") {
      const coeff = parseInt(resolution, 10) * 1000
      rounded = moment.utc(Math.floor(dataCandle.time / coeff) * coeff)
    }

    const lastBarSec = lastBar.time
    let _lastBar = {} as ICandleModelTradingView

    // If current bar time is > end time for last bar, start a new bar
    if (rounded.utc().diff(lastBarSec) > 0) {
      _lastBar = {
        time: rounded.unix() * 1000, // Start a new candle with the time as the next rounded time period
        open: lastBar.close,
        high: lastBar.close,
        low: lastBar.close,
        close: dataCandle.close,
        volume: dataCandle.volume,
      }
    } else {
      // Update existing candle
      if (dataCandle.close < lastBar.low) {
        lastBar.low = dataCandle.close
      }
      if (dataCandle.close > lastBar.high) {
        lastBar.high = dataCandle.close
      }
      lastBar.close = dataCandle.close
      lastBar.volume += dataCandle.volume
      _lastBar = lastBar
    }

    this.currentMarketRealtimeObj.onrealtimecallback!(_lastBar)
    this.currentMarketRealtimeObj.lastBar = _lastBar
  }

  // Used to synchronize page loading - we have to first receive the first request from express server to build our market list, and then
  // the TV items will be ready for use.
  waitForMarketInitialization = () => {
    return new Promise(async (resolve, _reject) => {
      while (this.rootStore.appStore.totalAuctionRounds <= 0) {
        await sleep()
      }
      resolve()
    })
  }

  createTvChart = async () => {
    // console.log(`Creating TV chart`)
    // TODO: Call from ComponentDidMount
    // await this.waitForMarketInitialization()
    window.tvWidget = new window.TradingView.widget(this.widgetOptions)
  }

  // This is called from uiStore on first page load, after enough has loaded for us to determine which market
  // the user is subscribed to. If we tried to call it from the constructor here then `this.rootStore.uiStore.subscribedSymbol` wouldn"t
  // have a value yet.
  initTvChart = () => {
    // console.log(`TV Chart init function`)
    // TODO: Call from ComponentDidMount
    window.TradingView.onready(() => {
      // console.log(`Running TV onReady: this.rootStore.uiStore.subscribedSymbol: ${this.rootStore.uiStore.subscribedSymbol}`)
      this.createTvChart()
    })
  }
}
