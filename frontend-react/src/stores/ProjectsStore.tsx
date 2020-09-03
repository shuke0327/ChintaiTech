import { CBaseStore } from "./BaseStore"
import { action, observable, computed } from "mobx"
import { IRootStore } from "./RootStore"


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
  account_to_watch: string;
  pay_for_users: number;
  ram_buffer: number;
}

// My custom format used after parsing the response from Mike's API
export interface IRoundSummaryParsed {
  totalRaised: number
  roundNum: number
  chexPrice: string
  startTime: string
  endTime: string
}

export interface IProjectDetail {
  name: string
  description: string
  symbol: string
  supply: number
  chartMarket: string
  website: string
}


export interface IContributionItem {
  round: number
  quantity: number
}

export class CProjectsStore extends CBaseStore {
    // Auction data
    @observable currentRoundEndTime = ""
    @observable currentRoundNumber = 0
    @observable projectDetails = {
        name: "Worbli",
        description: "WORBLI was created with the intention of supplying a safe platform for users and developers to experience the benefits of distributed ledger technology (DLT) without the risks. It is a platform that is robust enough to scale to the speed and accessibility of modern centralized platforms while reducing user friction and costs to applications. Worbli is where the most innovative of applications can exist within the confines of the latest regulatory restrictions; where compliance and innovation are at the forefront of the mission.",
        symbol: "WBI",
        supply: 1000000,
        chartMarket: "WBI/EOS",
        website: "https://worbli.io/"
    }

    constructor(rootStore: IRootStore) {
        super(rootStore)

    }

        // Metrics that include all rounds including current and future
        @computed get sumEosContributionsAll() {
            return
        }

        @action setAffiliateReferral = (e: string) => {
            return
        }
  

}
