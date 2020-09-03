// import { RootStore } from 'stores/RootStore';
/*****************
 * Andrew Coutts
 * 2019
 *****************/
import { CBaseStore } from "stores/BaseStore"
// import crypto from "crypto"
import { action, computed, observable, reaction } from "mobx"
import { IRootStore } from "stores/RootStore"
import ledgerLogo from "lib/ledger.png"
import scatterLogo from "lib/scatter.png"
import lynxLogo from "lib/lynx.png"
import localStorageMobx from "mobx-localstorage"
import ScatterJS from "@scatterjs/core"
import ScatterEOS from "@scatterjs/eosjs2"
import ScatterLynx from "scatterjs-plugin-lynx";
import { JsonRpc, Api } from "eosjs"

import { ESocketMessages } from "./SocketStore";
import ReactGA from "react-ga"
// Configure Scatter
ScatterJS.plugins(new ScatterEOS(), new ScatterLynx({ Api, JsonRpc }))
// Connect to eos main net


// Make typescript happy so we can use the global window object
declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    scatterJS: IScatter | null
    ga: any
    userTest: any
  }
}

/********************************************************
 * Frontend types
 ********************************************************/
export enum EWalletType {
  lynx = "lynx",
  scatter = "scatter",
  ledger = "ledger",
  meetOne = "meetOne",
  tokenPocket = "tokenPocket",
}

export enum ENetworkNames {
  localnet = "localnet",
  junglenet = "junglenet",
  kylin = "kylin",
  mainnet = "mainnet",
}

export enum EWalletState {
  loggedOut = "loggedOut",
  loggingInSelecting = "loggingInSelecting",
  loggingInProcessing = "loggingInProcessing",
  loggingInError = "loggingInError",
  loggedIn = "loggedIn",
  loggingOut = "loggingOut",
}

export enum EWalletTxState {
  ready = "ready",
  pending = "pending",
  error = "error",
  unitialized = "unitialized",
  success = "success",
}

enum ENetworkChainId {
  localnet = "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f", // Default EOS chain ID
  junglenet = "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473",
  kylin = "5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191",
  mainnet = "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
}

interface IScatterIdentityAccountsObj {
  blockchain: string
  name: string
  authority: string
}

interface IScatterOptions {
  broadcast: boolean
  sign: boolean
  verbose: boolean
}

interface IScatterNetworkObj {
  blockchain: string
  chainId: string
  host: string
  port: number
  protocol: string
}

interface IScatter {
  identity: {
    accounts: Array<IScatterIdentityAccountsObj>,
  }
  account(
    network: string,
  ): {
    name: string
    authority: string
    publicKey: string
    blockchain: string
    isHardware: boolean
    chainId: string,
  }
  getIdentity(requiredFields: any): any
  forgetIdentity(): any
  suggestNetwork(scatterNetworkObj: IScatterNetworkObj): void
  eos(scatterNetworkObj: IScatterNetworkObj, eosJs: any, scatterOptions: IScatterOptions, protocol: string): any
}

interface IBlockchainNode {
  host: string
  port: number
  protocol: string
}

interface ICurrentNetworkObject {
  blockchain: string
  name: ENetworkNames
  chainId: string
  nodes: Array<IBlockchainNode>
  activeNode?: IBlockchainNode
}

interface INodeosResponseTime {
  host: string
  time: number
}

export interface ILoginOption {
  title: string
  name: EWalletType
  logo: string
  error: boolean
  errorMsg: string
}

interface IScatterTxError {
  json: any
  message: string
  stack: string
}
/*------------------------------------------------------*/

export class CWalletStore extends CBaseStore {
  @observable walletState: EWalletState = EWalletState.loggedOut // TODO: set back to 'loggedOut' when done
  @observable walletTxState: EWalletTxState = EWalletTxState.unitialized
  @observable scatter = {} as IScatter
  @observable accountName = ""
  @observable currentSelectedWalletApp: EWalletType | null = EWalletType.scatter
  @observable eosRpc = {} as JsonRpc;
  // Available login options
  @observable loginOptions = [
    {
      title: "Scatter Desktop",
      name: EWalletType.scatter,
      logo: scatterLogo,
      error: false,
      errorMsg: "",
    },
    {
      title: "Lynx Wallet",
      name: EWalletType.lynx,
      logo: lynxLogo,
      error: false,
      errorMsg: "",
    },
    {
      title: "Ledger Hardware Wallet",
      name: EWalletType.ledger,
      logo: ledgerLogo,
      error: false,
      errorMsg: "",
    },
  ]

  // Scatter network object
  currentNetworkObject = {} as ICurrentNetworkObject
  scatterNetworkObj: any
  eos: any

  private envLocalnetNodeosHost: string = process.env.REACT_APP_LOCALNET_NODEOS_HOST || "localhost"
  private envLocalnetNodeosPort: number = parseInt(process.env.REACT_APP_LOCALNET_NODEOS_PORT!, 10) || 8888
  private envLocalnetNodeosProtocol: string = process.env.REACT_APP_LOCALNET_NODEOS_PROTOCOL || "http"
  private envLocalnetChainID: string = process.env.REACT_APP_LOCALNET_NODEOS_CHAINID || ENetworkChainId.localnet
  private envSelectedEosNetwork = process.env.REACT_APP_EOS_ENVIRONMENT || ENetworkNames.localnet

  private userReservesUpdateTimer: NodeJS.Timeout = {} as NodeJS.Timeout;

  constructor(rootStore: IRootStore) {
    super(rootStore)

    // Debug function to log in as another user and see things from their perspective
    // window.userTest = (account: string) => {
    //   this.setCurrentSelectedWalletApp(EWalletType.scatter)
    //   this.setWalletState(EWalletState.loggedIn)
    //   this.setAccountName(account)
    //   this.rootStore.socketStore.socket.emit(ESocketMessages.userLoggedIn, this.accountName)
    //   this.setwalletTxState(EWalletTxState.ready)
    // }

    // EOS network objects based on selected network
    switch (this.envSelectedEosNetwork) {
      case ENetworkNames.mainnet: // Mainnet configurations
        this.currentNetworkObject = {
          blockchain: "eos",
          name: ENetworkNames.mainnet,
          chainId: ENetworkChainId.mainnet,
          nodes: [
            {
              host: "nodes.get-scatter.com",
              port: 443,
              protocol: "https",
            },
            {
              host: "eos.greymass.com",
              port: 443,
              protocol: "https",
            },
          ],
        }
        break

      case ENetworkNames.junglenet: // Junglenet configurations
        this.currentNetworkObject = {
          blockchain: "eos",
          name: ENetworkNames.junglenet,
          chainId: ENetworkChainId.junglenet,
          nodes: [
            // {
            //   host: "testnet.blockgenesys.com",
            //   port: 443,
            //   protocol: "https",
            // },
            {
              host: "api.jungle.alohaeos.com",
              port: 443,
              protocol: "https",
            },
            {
              host: "jungle2.cryptolions.io",
              port: 443,
              protocol: "https",
            },
            {
              host: "jungle.eosn.io",
              port: 443,
              protocol: "https",
            },
            {
              host: "jungle.eosio.cr",
              port: 443,
              protocol: "https",
            },
          ],
        }
        break

      case ENetworkNames.kylin: // Kylin configurations
        this.currentNetworkObject = {
          blockchain: "eos",
          name: ENetworkNames.kylin,
          chainId: ENetworkChainId.kylin,
          nodes: [
            // {
            //   host: "kylin.eos.dfuse.io",
            //   port: 443,
            //   protocol: "https",
            // },
            {
              host: "api.kylin.alohaeos.com",
              port: 443,
              protocol: "https",
            },
            {
              host: "api-kylin.eoslaomao.com",
              port: 443,
              protocol: "https",
            },
            {
              host: "api-kylin.eosasia.one",
              port: 443,
              protocol: "https",
            },
          ],
        }
        break

      case ENetworkNames.localnet: // Localnet configurations
      default:
        this.currentNetworkObject = {
          blockchain: "eos",
          name: ENetworkNames.localnet,
          chainId: this.envLocalnetChainID,
          nodes: [
            {
              host: this.envLocalnetNodeosHost,
              port: this.envLocalnetNodeosPort,
              protocol: this.envLocalnetNodeosProtocol,
            },
            {
              host: "eos.greymass.com",
              port: 443,
              protocol: "https",
            },
          ],
        }
        break
    }

    // Locate the fastest Nodeos endpoint to use by benchmarking them all using a ping to '/v1/chain/get_info'
    // if (this.rootStore.routerStore.location.pathname.includes("/auction")) { this.benchmarkNodeosEndpoints() }

    // Main handler for changes to login status
    reaction(
      () => this.walletTxState,
      (_data, _reaction) => {
        // console.log(`Scatter state changed, new state: ${this.walletState}`)

        switch (this.walletTxState) {
          case EWalletTxState.ready:
            // console.log(`[Tx State Changed] ready`)
            break

          case EWalletTxState.pending:
            // console.log(`[Tx State Changed] pendingresult`)
            break

          case EWalletTxState.error:
            // console.log(`[Tx State Changed] resulterror`)
            this.setwalletTxState(EWalletTxState.ready)
            // this.rootStore.appStore.autoSizerRefs.openorders.forceUpdate() // Makes the loading animation stop
            break

          case EWalletTxState.success:
            // console.log(`[Tx State Changed] resultsuccess`)
            this.setwalletTxState(EWalletTxState.ready)
            break

          case EWalletTxState.unitialized:
            // console.log(`[Tx State Changed] unitialized`)
            break

          default:
            // console.log(`[Tx State Changed] Error: unknown state`)
            break
        }
      },
    )

    // Main handler for changes to login status
    reaction(
      () => this.walletState,
      async (_data, _reaction) => {
        // console.log(`Wallet state changed, new state: ${this.walletState}`)
        switch (this.walletState) {
          case EWalletState.loggingInSelecting: {
            // When user initially clicks the login button to select an option
            break
          }

          case EWalletState.loggingInProcessing: {
            // When a user selects a login option and actually begins the login process
            this.resetLoginErrors()
            //@ts-ignore
            if (this.currentSelectedWalletApp === EWalletType.scatter) {
              this.scatterLogin()
            } else if (this.currentSelectedWalletApp === EWalletType.ledger) {
              this.ledgerLogin()
            } else if (this.currentSelectedWalletApp === EWalletType.meetOne) {
              this.scatterLogin()
            } else if (this.currentSelectedWalletApp === EWalletType.tokenPocket) {
              this.scatterLogin()
            } else if (this.currentSelectedWalletApp === EWalletType.lynx) {
              this.scatterLogin()
            }
            break
          }

          case EWalletState.loggingInError: {
            // console.log(this.loginOptions)
            // When a login error happens
            if (this.currentSelectedWalletApp) {
              this.loginOptions.find((e: ILoginOption) => e.name === this.currentSelectedWalletApp)!.error = true
            }
            this.updateLastLoggedInWalletType(null)
            this.setWalletState(EWalletState.loggedOut)
            break
          }

          case EWalletState.loggedIn: {
            // console.log(`[Wallet State reaction] Changed to loggedin`)
            // console.log(this.accountName))

            if (this.currentSelectedWalletApp === EWalletType.scatter) {
              this.setAccountName(this.scatter.identity.accounts.filter((account) => account.blockchain === "eos")[0].name)
              this.updateLastLoggedInWalletType(EWalletType.scatter)
            } else if (this.currentSelectedWalletApp === EWalletType.lynx) {
              // Lynx sets the account name using a callback in SocketStore called from the Express server
              // No need to call "subscribeUserUpdatesScatter()" as the user is already subscribed at the Express server webhook
              this.updateLastLoggedInWalletType(EWalletType.scatter)
            } else {
              // Invalid wallet selected
              this.setWalletState(EWalletState.loggedOut)
            }
            this.rootStore.appStore.notifySuccess(`${this.rootStore.langStore.safeGetLocalizedString("notifications.app.successfulLogin")} ${this.accountName}`)
            this.rootStore.socketStore.socket.emit(ESocketMessages.userLoggedIn, this.accountName)

            // Send Google Analytics event for login
            ReactGA.event({
              category: "User",
              action: "Scatter Login",
              label: this.accountName,
            })
            //update Autores balances and tables
            if (this.rootStore.routerStore.location.pathname.includes("/automatedleasing/portal")) {
              this.updateAutoresBalances()
              // @ts-ignore
              this.userReservesUpdateTimer = setInterval(() => this.updateAutoresBalances(), 5000)
            }

            this.setwalletTxState(EWalletTxState.ready)
            break
          }

          case EWalletState.loggingOut: {
            // console.log(`[Wallet State reaction] Changed to loggingout`)
            if (this.currentSelectedWalletApp === EWalletType.scatter) {
              this.scatterLogout()

            } else if (this.currentSelectedWalletApp === EWalletType.lynx) {
              // Lynx does not keep any identity information so we don"t have a "logout" routine to call
            } else {
              // Invalid wallet selected
            }
            this.rootStore.appStore.setContributionsList([])
            this.setWalletState(EWalletState.loggedOut)
            this.rootStore.appStore.notifyInfo(`${this.rootStore.langStore.safeGetLocalizedString("notifications.app.goodbye")}`)
            break
          }

          case EWalletState.loggedOut: {
            // console.log(`[Wallet State reaction] loggedout`)
            ReactGA.event({
              category: "User",
              action: "Scatter Logout",
              label: this.accountName,
            })

            this.resetLoginErrors()
            this.setAccountName("")
            // this.rootStore.appStore.setKycStatus(-1)
            this.setwalletTxState(EWalletTxState.unitialized)
            // this.setCurrentSelectedWalletApp(null)
            this.updateLastLoggedInWalletType(null)
            this.rootStore.socketStore.socket.emit(ESocketMessages.userLoggedOut)
            clearInterval(this.userReservesUpdateTimer)
            break
          }

          default:
            // console.log(`[Wallet State reaction] Error: unknown state`)
            break
        }
      },
    )
  }

  // Reset all login error statuses
  resetLoginErrors = () => {
    this.loginOptions.forEach((e: ILoginOption) => {
      e.error = false
      e.errorMsg = ""
    })
  }

  @computed get currentUserAccountName(): string {
    return this.scatter.account("eos").name
  }

  @computed get userLoggedIn(): boolean {
    // console.info("[userLoggedIn] walletState: ", this.walletState)
    switch (this.walletState) {
      case EWalletState.loggedIn:
        return true

      default:
        return false
    }
  }

  @computed get userLoggingIn(): boolean {
    switch (this.walletState) {
      case EWalletState.loggingInError:
      case EWalletState.loggingInProcessing:
      case EWalletState.loggingInSelecting:
        return true

      default:
        return false
    }
  }

  @computed get currentUserChexReserve(): number {
    return this.rootStore.appStore.currentAutomatedresPayerChexReserves
  }

  @computed get currentUserEosReserve(): number {
    return this.rootStore.appStore.currentAutomatedresPayerEosReserves
  }

  setCurrentWalletErrorMsg = (msg: string) => {
    if (this.currentSelectedWalletApp) {
      this.loginOptions.find((e: ILoginOption) => e.name === this.currentSelectedWalletApp)!.errorMsg = msg
      this.rootStore.appStore.notifyError(msg)
    }
  }

  // update obseravables of reserves
  updateAutoresBalances = () => {
    this.updateAccountInfo()
    this.updateLiquidChex()
    this.updateReservesChex()
    this.updateLiquidEos()
    this.updateReservesEos()
    this.updateLockedRam()
    this.updateConfigTable()
    // this.updateBlacklistTable()
    this.updateBancorChexPrice()
    // this.rootStore.socketStore.socket.emit(ESocketMessages.getAutomatedresHistory, this.accountName)
  }

  @action updateAccountInfo = async () => {
    try {
      const accountInfo = await this.eosRpc.get_account(this.currentUserAccountName)
      this.rootStore.appStore.userAccountInfo = accountInfo
      const cpuUtilization = (accountInfo.cpu_limit.used / accountInfo.cpu_limit.available * 100)
      this.rootStore.appStore.userCpuUtilization = cpuUtilization
    } catch (err) {
      console.log("Errro getting Account Info", err)
    }
  }

  @action updateLiquidChex = async () => {
    try {
      const liquidChex = await this.eosRpc.get_currency_balance("chexchexchex", this.rootStore.walletStore.currentUserAccountName, "CHEX")
      this.rootStore.appStore.currentAutomatedresPayerChexLiquid = parseFloat(liquidChex[0]);
    } catch (err) {
      console.log('Error getting liquid Chex!', err);
    }
  }

  @action updateLiquidEos = async () => {
    try {
      const liquidEos = await this.eosRpc.get_currency_balance("eosio.token", this.rootStore.walletStore.currentUserAccountName, "EOS")
      this.rootStore.appStore.currentAutomatedresPayerEosLiquid = parseFloat(liquidEos[0]);
    } catch (err) {
      console.log('Error getting liquid EOS!', err);
    }
  }

  @action updateReservesChex = async () => {
    try {
      const chexReserves = await this.eosRpc.get_table_rows({ json: true, code: "automatedres", scope: "automatedres", table: "payer2", lower_bound: this.rootStore.walletStore.currentUserAccountName, upper_bound: this.rootStore.walletStore.currentUserAccountName })
      this.rootStore.appStore.currentAutomatedresPayerChexReserves = parseFloat(chexReserves.rows.length === 0 ? 0 : chexReserves.rows[0].chex_reserves);
    } catch (err) {
      console.log('Error getting Reserve Chex!', err);
    }
  }

  @action updateReservesEos = async () => {
    try {
      const eosReserves = await this.eosRpc.get_table_rows({ json: true, code: "automatedres", scope: "automatedres", table: "payer2", lower_bound: this.rootStore.walletStore.currentUserAccountName, upper_bound: this.rootStore.walletStore.currentUserAccountName })
      this.rootStore.appStore.currentAutomatedresPayerEosReserves = parseFloat(eosReserves.rows.length === 0 ? 0 : eosReserves.rows[0].eos_reserves);
    } catch (err) {
      console.log('Error getting Reserve EOS!', err);
    }
  }

  @action updateLockedRam = async () => {
    try {
      const lockedRamAsset = await this.eosRpc.get_table_rows({ json: true, code: "automatedres", scope: "automatedres", table: "payer2", lower_bound: this.rootStore.walletStore.currentUserAccountName, upper_bound: this.rootStore.walletStore.currentUserAccountName })
      this.rootStore.appStore.currentAutomatedresPayerLockedRam = parseFloat(lockedRamAsset.rows.length === 0 ? 0 : lockedRamAsset.rows[0].assets_locked_in_ram_bytes);
    } catch (err) {
      console.log('Error getting Locked Ram value!', err);
    }
  }

  @action updateConfigTable = async () => {
    try {
      const config = await this.eosRpc.get_table_rows({ json: true, code: "automatedres", scope: this.rootStore.walletStore.currentUserAccountName, table: "config2" })
      this.rootStore.appStore.currentAutomatedresConfigs = config.rows
      this.rootStore.appStore.convertArmConfigs()
      this.rootStore.appStore.initConfigTableUpdates()
    } catch (err) {
      console.log('Error updating Configure Table!', err)
    }
  }

  @action updateBlacklistTable = async () => {
    try {
      const blacklist = await this.eosRpc.get_table_rows({ json: true, code: "automatedres", scope: this.rootStore.walletStore.currentUserAccountName, table: "blacklist" })
      this.rootStore.appStore.currentAutomatedresBlacklists = blacklist.rows
    } catch (err) {
      console.log('Error updating Blacklist Table!', err)
    }
  }

  @action updateBancorChexPrice = async () => {
    try {
      const response = await fetch("https://api.bancor.network/0.1/currencies/5ca9c443b86b7f9c661bf0d6/value?toCurrencyId=5a1eb3753203d200012b8b75&fromAmount=1000000000")
      const data = await response.json()
      this.rootStore.appStore.currentBancorChexPrice = Number((Number(data.data) / 100000).toFixed(6))
    } catch (err) {
      console.log('Error updating current Bancor Chex Price!', err)
    }
  }

  // Logout clear observables
  @action clearConfigTable = async () => {
    this.rootStore.appStore.currentAutomatedresConfigs.replace([]);
  }

  @action clearBlackListTable = async () => {
    this.rootStore.appStore.currentAutomatedresBlacklists.replace([]);
  }

  @action clearTxHistory = () => {
    this.rootStore.appStore.currentAutomatedresTxHistory.replace([]);
  }

  @action clearAutoresBalances = () => {
    this.rootStore.appStore.currentAutomatedresPayerChexLiquid = 0
    this.rootStore.appStore.currentAutomatedresPayerChexReserves = 0
    this.rootStore.appStore.currentAutomatedresPayerEosLiquid = 0
    this.rootStore.appStore.currentAutomatedresPayerEosReserves = 0
  }



  @action setCurrentSelectedWalletApp = (e: EWalletType | null) => {
    if (this.currentSelectedWalletApp !== e) {
      // console.log("[setCurrentSelectedWalletApp]: ", e)
      this.currentSelectedWalletApp = e
    }
  }

  @action setAccountName = (e: string) => {
    this.accountName = e
  }

  // Used to update the current logged-in state
  @action setWalletState = (e: EWalletState) => {
    // console.log(`Updating wallet state. Current: ${this.walletState} | New: ${e}`)
    this.walletState = e
  }

  // Used to update the current transaction-ready state
  @action setwalletTxState = (e: EWalletTxState) => {
    this.walletTxState = e
  }

  // Used to update the local instance of Scatter from the browser
  @action setScatterInstance = (e: any) => {
    this.scatter = e
  }

  updateLastLoggedInWalletType = (e: EWalletType | null) => {
    localStorageMobx.setItem("lastWalletType", e)
  }

  getLastLoggedInWalletType = (): EWalletType => {
    return localStorageMobx.getItem("lastWalletType")
  }

  // Lynx transaction error handler
  handleLynxTxErrors = (e: string) => {
    switch (e) {
      case "AssertionError [ERR_ASSERTION]":
        // this.rootStore.appStore.notifyError("Something went wrong while submitting the transaction to Lynx. Please try your transaction again.", 5000)
        break

      default:
        // this.rootStore.appStore.notifyError(e, 2000)
        break
    }
    this.setwalletTxState(EWalletTxState.error)
  }

  // TODO: re-implement with latest Lynx api - this is broken for now
  // Process login for Lynx
  lynxLogin = () => {
    // // console.info("[lynxLogin] Sending login request to local Lynx wallet")
    // if (window.lynxMobile) {
    //   // Lynx mobile login
    //   // Register callback handlers
    //   window.lynxMobile.listenOnSetAccountName((e) => {
    //     console.log(JSON.stringify(e))
    //     // setAccountName(e) // Set account name for current user once we know it
    //   })

    //   window.lynxMobile.listenOnTransactionResult((e) => {
    //     console.log(JSON.stringify(e))
    //     // Handle transaction result here
    //   })

    //   window.lynxMobile.requestSetAccountName()
    // } else {
    //   // Lynx desktop login
    //   window.location.assign(`eoslynx://confirm?apikey=SZ11Ad2o57HiTRJHncvBiEXdluyHOx6CLccguwczPxHdY9w&session=${this.rootStore.socketStore.socketId}|authenticate`)
    // }
  }

  // Main login routine for Ledger
  ledgerLogin = async () => {
    // console.log("Processing Ledger login")
    // this.setCurrentSelectedWalletApp(EWalletType.ledger)
    // this.setWalletState(EWalletState.loggingInProcessing)
  }

  // Main login routine for Scatter Desktop
  scatterLogin = async () => {
    // console.log("Processing Scatter Desktop login")

    if (this.currentSelectedWalletApp !== EWalletType.scatter) { this.setCurrentSelectedWalletApp(EWalletType.scatter) }

    // First check if the user has Scatter Desktop opened and unlocked
    const scatterExists = await this.hookScatterInstance()

    // Scatter not found
    if (!scatterExists) {
      console.error("[scatterLogin] Unable to continue processing login because Scatter Desktop was not found")
      this.setCurrentWalletErrorMsg(this.rootStore.langStore.safeGetLocalizedString("notifications.app.scatterMissing"))
      this.setWalletState(EWalletState.loggingInError)
      return
    }

    // TODO: move this to do a check- first, if the last selected wallet type is Scatter, then run this on page load to skip the popup dialog
    // // Detect if we have an existing identity already loaded
    // if (this.scatter.identity) {
    //   // console.log(this.scatter.identity)
    //   this.setWalletState(EWalletState.loggedIn)
    //   return
    // }

    try {
      // Suggest the network to the user if they haven"t configured it yet
      await this.scatter.suggestNetwork(this.scatterNetworkObj)
    } catch (e) {
      console.error(e)
      if (e.code === "not_paired") {
        this.setCurrentWalletErrorMsg("The request to link Chintai CHEX Auction to Scatter was cancelled.")
        this.setWalletState(EWalletState.loggingInError)
        return
      }
    }

    try {
      const identityResult = await this.scatter.getIdentity({ accounts: [this.scatterNetworkObj] })
      if (identityResult && this.walletState === EWalletState.loggingInProcessing) {
        this.setWalletState(EWalletState.loggedIn)
      }

      // Disabled for now until RIDL is ready for production
      // console.info("About to authenticate")
      // let authResult = await this.scatter.authenticate(Math.random().toString(36).substring(0, 12))
      // console.info(authResult)
      // if (authResult) this.setWalletState(EWalletState.loggedin)
    } catch (e) {
      console.log(e)
      if (e.type === "locked") {
        // Wallet locked
        this.setCurrentWalletErrorMsg("Scatter Desktop is locked - please unlock your wallet and try again.")
        this.setWalletState(EWalletState.loggingInError)
        return
      } else if (e.type === "identity_rejected") {
        // Cancelled request
        this.setCurrentWalletErrorMsg("The login request was cancelled.")
        if (this.currentSelectedWalletApp) { this.setWalletState(EWalletState.loggingInError) }
        return
      } else {
        // catch-all
        console.error(e)
        this.setCurrentWalletErrorMsg(e.message)
        this.setWalletState(EWalletState.loggingInError)
        return
      }
    }
  }

  // Hook into the window scatter instance and null the window reference for security
  // https://get-scatter.com/docs/dev/setting-up-for-web-apps
  hookScatterInstance = () => {
    return new Promise(async (resolve, _reject) => {
      // console.info("Initializing Scatter and hooking into local Scatter Desktop if it exists")
      try {
        const result = await ScatterJS.scatter.connect(`chintai.io`, { initTimeout: 10000 })
        if (result) {
          this.setScatterInstance(ScatterJS.scatter)
          window.scatterJS = null // DEBUG: MAKE SURE I REMOVE THIS BEFORE PRODUCTION!!!!!!!!
        }
        resolve(result)
        // console.log(result)
      } catch (e) {
        console.error("Error while hooking Scatter: ", e)
      }
    })
  }

  scatterLogout = () => {
    // console.log(`processing logout`)
    this.scatter.forgetIdentity()
    this.setScatterInstance(null)
    this.clearConfigTable()
    this.clearBlackListTable()
    this.clearTxHistory()
    this.clearAutoresBalances()
  }

  // Scatter error handler
  handleScatterTxErrors = (e: IScatterTxError) => {
    console.log(e.message)
    let errorRefString = ""
    let notifyFunction = this.rootStore.appStore.notifyError

    ReactGA.exception({
      description: `Bid Failed: ${e.message}`,
      fatal: false,
    })

    switch (e.message) {
      case "assertion failure with message: insufficient funds":
      case "assertion failure with message: no balance object found": { // Brand new account with no EOS in it
        errorRefString = "notifications.app.insufficientFunds"
        break
      }

      case "assertion failure with message: You must complete the KYC process": {
        errorRefString = "notifications.app.kycNotCompletedYet"
        break
      }

      case "User rejected the signature request": {
        errorRefString = "notifications.app.txCancelled"
        notifyFunction = this.rootStore.appStore.notifyInfo
        break
      }

      default: {
        notifyFunction(e.message.slice(0, 1).toUpperCase().concat(e.message.slice(1, e.message.length)), 30000)
        this.setwalletTxState(EWalletTxState.error)
        return
      }
    }

    notifyFunction(this.rootStore.langStore.safeGetLocalizedString(errorRefString), 30000)
    this.setwalletTxState(EWalletTxState.error)
  }

  submitBid = async () => {
    try {
      this.setwalletTxState(EWalletTxState.pending)
      const result = await this.eos.transact(
        {
          actions: [
            {
              account: "eosio.token",
              name: "transfer",
              authorization: [
                {
                  actor: this.currentUserAccountName,
                  permission: this.scatter.account("eos").authority,
                },
              ],
              data: {
                from: this.rootStore.walletStore.currentUserAccountName,
                to: process.env.REACT_APP_TOKEN_AUCTION_ACCOUNT,
                quantity: `${parseFloat(this.rootStore.appStore.currentBidQuantity).toFixed(4)} EOS`,
                memo: this.rootStore.appStore.manualBidMemo,
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        },
      )
      this.rootStore.appStore.notifyTxSuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.bidSuccessful"), result.processed.id)
      ReactGA.event({
        category: "User",
        action: "Bid Submitted",
        label: this.accountName,
        value: parseFloat(this.rootStore.appStore.currentBidQuantity),
      })

      this.setwalletTxState(EWalletTxState.success)
    } catch (e) {
      this.handleScatterTxErrors(e)
    }
  }

  submitAutomatedresDeposit = async () => {
    // sign up own account to watch if this is first deposit into ARM
    if (this.rootStore.appStore.currentAutomatedresPayerChexReserves === 0 && this.rootStore.appStore.currentAutomatedresPayerEosReserves === 0) {
      this.rootStore.appStore.setCurrentAutomatedresAccountToWatch(this.currentUserAccountName)
      try {
        this.setwalletTxState(EWalletTxState.pending)
        const result = await this.eos.transact(
          {
            actions: [
              {
                // eosio.token or chexchexchex
                account: `${this.rootStore.appStore.currentAutomatedresDepositWithdrawTokenAccount}`,
                name: "transfer",
                authorization: [
                  {
                    actor: this.currentUserAccountName,
                    permission: this.scatter.account("eos").authority,
                  },
                ],
                data: {
                  from: this.rootStore.walletStore.currentUserAccountName,
                  to: process.env.REACT_APP_AUTOMATEDRES_ACCOUNT || "automatedres",
                  quantity: `${parseFloat(this.rootStore.appStore.currentAutomatedresDepositWithdrawQuantity).toFixed(this.rootStore.appStore.tokenDecimals)} ${this.rootStore.appStore.tokenName}`,
                  memo: this.rootStore.appStore.manualAutomatedresDepositMemo,
                },
              },
              {
                account: "automatedres",
                name: "configure",
                authorization: [
                  {
                    actor: this.currentUserAccountName,
                    permission: this.scatter.account("eos").authority,
                  },
                ],
                data: {
                  payer: this.rootStore.walletStore.currentUserAccountName,
                  config: {
                    account_to_watch: this.rootStore.walletStore.currentUserAccountName,
                    cpu_threshold_low_us: 1000,
                    cpu_threshold_high_us: 30000,
                    net_threshold_low_bytes: 1000,
                    net_threshold_high_bytes: 10000,
                    ram_threshold_low_bytes: 100,
                    ram_threshold_high_bytes: 2000,
                    max_price_per_eos: '1.0000 EOS',
                    notify_payer: true,
                    notify_account: true,
                    active: true
                  }
                },
              },
            ],
          },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          },
        )
        this.rootStore.appStore.notifyTxSuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.autoresDepositSuccessful"), result.processed.id)
        ReactGA.event({
          category: "User",
          action: "Bid Submitted",
          label: this.accountName,
          value: parseFloat(this.rootStore.appStore.currentBidQuantity),
        })

        this.setwalletTxState(EWalletTxState.success)
        this.updateAutoresBalances()
      } catch (e) {
        this.handleScatterTxErrors(e)
      }
    } else {
      // if tokens are already deposited into automatedres for user
      try {
        this.setwalletTxState(EWalletTxState.pending)
        const result = await this.eos.transact(
          {
            actions: [
              {
                //eosio.token or chexchexchex
                account: `${this.rootStore.appStore.currentAutomatedresDepositWithdrawTokenAccount}`,
                name: "transfer",
                authorization: [
                  {
                    actor: this.currentUserAccountName,
                    permission: this.scatter.account("eos").authority,
                  },
                ],
                data: {
                  from: this.rootStore.walletStore.currentUserAccountName,
                  to: process.env.REACT_APP_AUTOMATEDRES_ACCOUNT || "automatedres",
                  quantity: `${parseFloat(this.rootStore.appStore.currentAutomatedresDepositWithdrawQuantity).toFixed(this.rootStore.appStore.tokenDecimals)} ${this.rootStore.appStore.tokenName}`,
                  memo: this.rootStore.appStore.manualAutomatedresDepositMemo,
                },
              },
            ],
          },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          },
        )
        this.rootStore.appStore.notifyTxSuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.autoresDepositSuccessful"), result.processed.id)
        ReactGA.event({
          category: "User",
          action: "Bid Submitted",
          label: this.accountName,
          value: parseFloat(this.rootStore.appStore.currentBidQuantity),
        })

        this.setwalletTxState(EWalletTxState.success)
        this.updateAutoresBalances()
      } catch (e) {
        this.handleScatterTxErrors(e)
      }
    }
  }

  submitAutomatedresWithdraw = async () => {
    try {
      this.setwalletTxState(EWalletTxState.pending)
      const result = await this.eos.transact(
        {
          actions: [
            {
              //eosio.token or chexchexchex
              account: "automatedres",
              name: "withdraw",
              authorization: [
                {
                  actor: this.currentUserAccountName,
                  permission: this.scatter.account("eos").authority,
                },
              ],
              data: {
                payer: this.rootStore.walletStore.currentUserAccountName,
                quantity: `${parseFloat(this.rootStore.appStore.currentAutomatedresDepositWithdrawQuantity).toFixed(this.rootStore.appStore.tokenDecimals)} ${this.rootStore.appStore.tokenName}`,
                memo: this.rootStore.appStore.manualAutomatedresWithdrawMemo,
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        },
      )
      this.rootStore.appStore.notifyTxSuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.autoresWithdrawSuccessful"), result.processed.id)
      ReactGA.event({
        category: "User",
        action: "Bid Submitted",
        label: this.accountName,
        value: parseFloat(this.rootStore.appStore.currentBidQuantity),
      })

      this.setwalletTxState(EWalletTxState.success)
      this.updateAutoresBalances()
    } catch (e) {
      this.handleScatterTxErrors(e)
    }
  }

  submitAutomatedresConfigure = async () => {
    try {
      this.setwalletTxState(EWalletTxState.pending)
      const result = await this.eos.transact(
        {
          actions: [
            {
              account: "automatedres",
              name: "configure",
              authorization: [
                {
                  actor: this.currentUserAccountName,
                  permission: this.scatter.account("eos").authority,
                },
              ],
              data: {
                payer: this.rootStore.walletStore.currentUserAccountName,
                config: this.rootStore.appStore.currentNewConfigure
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        },
      )
      this.rootStore.appStore.notifyTxSuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.autoresConfigSuccessful"), result.processed.id)
      ReactGA.event({
        category: "User",
        action: "Bid Submitted",
        label: this.accountName,
        value: parseFloat(this.rootStore.appStore.currentBidQuantity),
      })

      this.setwalletTxState(EWalletTxState.success)
      this.updateAutoresBalances()
    } catch (e) {
      this.handleScatterTxErrors(e)
    }
  }

  submitBatchAutomatedresConfigure = async () => {
    try {
      this.setwalletTxState(EWalletTxState.pending)

      // add new records
      if (this.rootStore.appStore.showNewConfigRow && this.rootStore.appStore.currentAutomatedresAccountToWatch) {
        this.rootStore.appStore.addCurrentNewConfig()
      }

      // add update records
      if (this.rootStore.appStore.configFormToUpdate.length > 0) {
        this.rootStore.appStore.addConfigureUpdates()
      }
      const result = await this.eos.transact(
        {
          actions: this.rootStore.appStore.currentArmConfigUpdates,
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        },
      )
      this.rootStore.appStore.notifyTxSuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.autoresConfigSuccessful"), result.processed.id)

      this.setwalletTxState(EWalletTxState.success)
      this.updateAutoresBalances()
    } catch (e) {
      this.rootStore.appStore.clearCurrentArmConfigUpdates()
      this.handleScatterTxErrors(e)
    }
  }

  submitAutomatedresDeleteConfigure = async (selectedAccount: string) => {
    try {
      this.setwalletTxState(EWalletTxState.pending)
      const result = await this.eos.transact(
        {
          actions: [
            {
              account: "automatedres",
              name: "delconftab",
              authorization: [
                {
                  actor: this.currentUserAccountName,
                  permission: this.scatter.account("eos").authority,
                },
              ],
              data: {
                payer: this.rootStore.walletStore.currentUserAccountName,
                account_to_watch: selectedAccount
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        },
      )
      this.rootStore.appStore.notifyTxSuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.autoresConfigRemove"), result.processed.id)
      ReactGA.event({
        category: "User",
        action: "Bid Submitted",
        label: this.accountName,
        value: parseFloat(this.rootStore.appStore.currentBidQuantity),
      })

      this.setwalletTxState(EWalletTxState.success)
      this.updateAutoresBalances()
    } catch (e) {
      this.handleScatterTxErrors(e)
    }
  }

  submitAutomatedresAddBlacklist = async () => {
    try {
      this.setwalletTxState(EWalletTxState.pending)
      const result = await this.eos.transact(
        {
          actions: [
            {
              account: "automatedres",
              name: "addblacklist",
              authorization: [
                {
                  actor: this.currentUserAccountName,
                  permission: this.scatter.account("eos").authority,
                },
              ],
              data: {
                payer: this.rootStore.walletStore.currentUserAccountName,
                account: this.rootStore.appStore.currentAutomatedresBlacklistAccount
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        },
      )
      this.rootStore.appStore.notifyTxSuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.autoresBlacklistSuccessful"), result.processed.id)
      ReactGA.event({
        category: "User",
        action: "Bid Submitted",
        label: this.accountName,
        value: parseFloat(this.rootStore.appStore.currentBidQuantity),
      })

      this.setwalletTxState(EWalletTxState.success)
      this.updateAutoresBalances()
    } catch (e) {
      this.handleScatterTxErrors(e)
    }
  }

  submitAutomatedresRemoveBlacklist = async (selectedAccount: string) => {
    try {
      this.setwalletTxState(EWalletTxState.pending)
      const result = await this.eos.transact(
        {
          actions: [
            {
              account: "automatedres",
              name: "remblacklist",
              authorization: [
                {
                  actor: this.currentUserAccountName,
                  permission: this.scatter.account("eos").authority,
                },
              ],
              data: {
                payer: this.rootStore.walletStore.currentUserAccountName,
                account: selectedAccount
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        },
      )
      this.rootStore.appStore.notifyTxSuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.autoresBlacklistRemove"), result.processed.id)
      ReactGA.event({
        category: "User",
        action: "Bid Submitted",
        label: this.accountName,
        value: parseFloat(this.rootStore.appStore.currentBidQuantity),
      })

      this.setwalletTxState(EWalletTxState.success)
      this.updateAutoresBalances()
    } catch (e) {
      this.handleScatterTxErrors(e)
    }
  }

  submitEmergencyCpuAction = async () => {
    let txResult
    try {
      this.setwalletTxState(EWalletTxState.pending)
      const result = await this.eos.transact(
        {
          actions: [
            {
              // eosio.token or chexchexchex
              account: "automatedres",
              name: "cpuemergency",
              authorization: [
                {
                  actor: this.currentUserAccountName,
                  permission: this.scatter.account("eos").authority,
                },
              ],
              data: {},
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        },
      )
      this.rootStore.appStore.notifyTxSuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.emergencyCpu"), result.processed.id)
      ReactGA.event({
        category: "User",
        action: "Emergency CPU Requested",
        label: this.accountName,
        value: this.rootStore.appStore.userCpuUtilization,
      })

      txResult = result

      this.setwalletTxState(EWalletTxState.success)
      this.updateAutoresBalances()
    } catch (e) {
      if (e.message === "Transaction exceeded the current NET usage limit imposed on the transaction" || e.message === "Transaction exceeded the current CPU usage limit imposed on the transaction") {
        this.rootStore.appStore.notifyTxSuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.emergencyCpu"), txResult.processed.id)
      } else {
        this.handleScatterTxErrors(e)
      }
    }
  }

  submitEosToChexTransaction = async () => {
    try {
      this.setwalletTxState(EWalletTxState.pending)
      const result = await this.eos.transact(
        {
          actions: [
            {
              account: "eosio.token",
              name: "transfer",
              authorization: [
                {
                  actor: this.currentUserAccountName,
                  permission: this.scatter.account("eos").authority,
                },
              ],
              data: {
                from: this.rootStore.walletStore.currentUserAccountName,
                to: "thisisbancor",
                quantity: `${parseFloat(this.rootStore.appStore.currentEosToChexConvertValue).toFixed(4)} EOS`,
                memo: this.rootStore.appStore.eosToChexMemo,
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        },
      )

      // TODO - implement notification and GA
      this.rootStore.appStore.notifyTxSuccess(this.rootStore.langStore.safeGetLocalizedString("notifications.app.convertSuccess"), result.processed.id)
      // ReactGA.event({
      //   category: "User",
      //   action: "Bid Submitted",
      //   label: this.accountName,
      //   value: parseFloat(this.rootStore.appStore.currentBidQuantity),
      // })

      // TODO - validate if this is needed
      this.setwalletTxState(EWalletTxState.success)
      // this.updateAutoresBalances()
    } catch (e) {
      // TODO - validate if this is needed
      this.handleScatterTxErrors(e)
    }
  }

  // Benchmark the nodes to find the fastest node for the end user to use
  benchmarkNodeosEndpoints = async () => {
    // Create an array of promises so we can resolve them all at once
    const promises: Array<Promise<INodeosResponseTime>> = []

    // Iterate over each available node for the current network and add it to the pending promise array
    this.currentNetworkObject.nodes.forEach((node: IBlockchainNode) => promises.push(this.getNodeosResponseTime(node)))

    // Now resolve all of the promises and return an array of the response times
    const results: Array<INodeosResponseTime> = await Promise.all(promises)

    // Set the active node to the fastest one
    this.currentNetworkObject.activeNode = this.currentNetworkObject.nodes.find((e: IBlockchainNode) => e.host === results.reduce((prev, curr) => (prev.time < curr.time ? prev : curr)).host)! // Black magic

    // Setup the parsed Scatter network object
    this.scatterNetworkObj = ScatterJS.Network.fromJson({
      blockchain: this.currentNetworkObject.blockchain,
      chainId: this.currentNetworkObject.chainId,
      host: this.currentNetworkObject.activeNode.host,
      port: this.currentNetworkObject.activeNode.port,
      protocol: this.currentNetworkObject.activeNode.protocol,
    })

    const rpc = new JsonRpc(this.scatterNetworkObj.fullhost())
    this.eosRpc = rpc;
    console.log("eosRpc: ", this.eosRpc);
    this.eos = ScatterJS.eos(this.scatterNetworkObj, Api, { rpc, beta3: true })

    // If user has previously logged in with a wallet, automatically log into it
    const lastWalletType = this.getLastLoggedInWalletType()
    if (lastWalletType === EWalletType.scatter) {
      this.setCurrentSelectedWalletApp(EWalletType.scatter) // Make sure to reset the current selected wallet after a logout in case the mouse didn"t move and we immediately click the button again
      this.setWalletState(EWalletState.loggingInProcessing)
    }
  }

  // Clever use of the Image object as a lightweight browser-compatible ping utility with no external dependencies
  private getNodeosResponseTime = (node: IBlockchainNode): Promise<INodeosResponseTime> => {
    // Copyright (c) 2015, Jonathan Frederic
    // All rights reserved.
    // https://github.com/jdfreder/pingjs
    return new Promise(async (resolve, _reject) => {
      try {
        const requestImage = (url: string) => {
          return new Promise((_resolve, reject) => {
            const img = new Image()
            img.onload = () => _resolve(img)
            img.onerror = () => reject(url)
            img.crossOrigin = "Anonymous"
            img.src = url
          })
        }

        const ping = (url: string, multiplier: number) => {
          return new Promise((_resolve, reject) => {
            const start = new Date().getTime()
            const response = () => {
              let delta = new Date().getTime() - start
              delta *= multiplier || 1
              _resolve(delta)
            }
            requestImage(url)
              .then(response)
              .catch(response)

            setTimeout(() => reject(Error("Timeout")), 5000)
          })
        }

        resolve({
          host: node.host,
          time: (await ping(`${node.protocol}://${node.host}:${node.port}/v1/chain/get_info`, 0.3)) as number,
        })
      } catch (e) {
        // console.info("Error in response while fetching Nodeos response time: ", e)
        resolve({
          host: node.host,
          time: 9999999999, // Set it to an unrealistically large number to ensure we ignore this when later comparing to find the fastest node
        })
      }
    })
  }
}
