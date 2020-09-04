/*****************
 * Andrew Coutts
 * 2019
 *****************/
// import { configure } from "mobx"
import { CBaseStore } from "./BaseStore"
import { CSocketStore } from "./SocketStore"
import { CAppStore } from "./AppStore"
import { CWalletStore } from "./WalletStore"
import { CLangStore } from "./LangStore"
import { CChartStore } from "./ChartStore"
import { CProjectsStore } from "./ProjectsStore"
import * as dotenv from "dotenv"
import { RouterStore } from "mobx-react-router"

// Routing
const routerStore = new RouterStore()

// Make typescript happy so we can use the global window object
declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    mobxstores: IRootStore
  }
}

export interface IRootStore {
  // Public members
  langStore: CLangStore
  socketStore: CSocketStore
  appStore: CAppStore
  walletStore: CWalletStore
  routerStore: RouterStore
  chartStore: CChartStore
  projectsStore: CProjectsStore
}

// Configure strict mode in MobX
// configure({ enforceActions: "always" })

export default class CRootStore extends CBaseStore implements IRootStore {
  langStore: CLangStore
  socketStore: CSocketStore
  appStore: CAppStore
  walletStore: CWalletStore
  routerStore: RouterStore
  chartStore: CChartStore
  projectsStore: CProjectsStore

  constructor() {
    // Skip setting the rootStore property as it doesn't apply here (circular reference)
    super()

    // Environment setup
    dotenv.config()

    // Initialize the rest of the stores
    this.routerStore = routerStore
    this.socketStore = new CSocketStore(this)
    this.appStore = new CAppStore(this)
    this.langStore = new CLangStore(this)
    this.walletStore = new CWalletStore(this)
    this.chartStore = new CChartStore(this)
    this.projectsStore = new CProjectsStore(this)
  }
}
