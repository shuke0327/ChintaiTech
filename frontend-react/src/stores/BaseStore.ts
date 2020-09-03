/*****************
 * Andrew Coutts
 * 2019
 * Base level store used by all other stores which carries a reference to the root store
 *****************/
import { IRootStore } from "./RootStore"

export class CBaseStore {
  // Create a generic reference to the root store
  protected readonly rootStore: IRootStore

  // When child class calls super() it will pass in the reference to rootStore
  protected constructor(rootStore?: IRootStore) {
    if (rootStore) {
      this.rootStore = rootStore
    } else {
      this.rootStore = {} as IRootStore
    }
  }
}
