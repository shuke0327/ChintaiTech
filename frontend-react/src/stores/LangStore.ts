/*****************
 * Andrew Coutts
 * 2019
 *****************/
import { action, computed, observable } from "mobx"
import { CBaseStore } from "stores/BaseStore"
import { IRootStore } from "stores/RootStore"
import langEn from "lib/localization/en.json"
import langKo from "lib/localization/ko.json"
import langZh from "lib/localization/zh.json"
// import langDe from "lib/localization/de.json"

// Make languages available
const langsJson = {
  ...langEn,
  ...langKo,
  ...langZh,
} as any
type langType = keyof typeof langsJson

export class CLangStore extends CBaseStore {
  @observable currentSelectedLang = ""

  constructor(rootStore: IRootStore) {
    super(rootStore)

    // Set default language if it isn't already set
    if (!localStorage.getItem("lang")) {
      this.setLang("en") // Initialize default value
    } else {
      this.setLang(localStorage.lang)
    }
  }

  @computed get safeGetCurrentLang(): any {
    // console.info("safeGetCurrentLang: ", Object.prototype.hasOwnProperty.call(langsJson, this.currentSelectedLang))
    return Object.prototype.hasOwnProperty.call(langsJson, this.currentSelectedLang) ? this.currentSelectedLang : "en"
  }


  // Safe method to set the current language on the TradingView chart and UI
  @action setLang = (e: string) => {
    const newLang = Object.prototype.hasOwnProperty.call(langsJson, e) ? e : "en"
    localStorage.setItem("lang", newLang)
    this.currentSelectedLang = newLang
    this.rootStore.appStore.safeUpdateBidsTableRef()
  }

  getAllLangs = (): Array<string> => {
    return Object.keys(langsJson)
  }

  getLangKeyNativeName = (key: string): string => {
    return langsJson[key as langType].langselector.native
  }

  // This safely returns localized strings with fallback support to english in case the language is missing a particular string
  safeGetLocalizedString = (key: string): string => {
    // console.info("[safeGetLocalizedString] key: ", key)
    // Check if the current language has the requested key. If it doesn't have it, return the English fallback.
    // If the English fallback key doesn't exist either, return a generic error string indicating the issue.
    const localizedString = key.split(".").reduce((p: any, c: any) => (p && p[c]) || null, langsJson[this.safeGetCurrentLang as langType])
    if (!localizedString) {
      if (this.safeGetCurrentLang !== "en") {
        const fallBackString = key.split(".").reduce((p: any, c: any) => (p && p[c]) || null, langsJson.en)

        if (fallBackString) {
          console.error(`Warning: localized string missing for '${key}' - using fallback in 'en'`)
          return fallBackString
        }
      }
      console.error(`Warning: localized string missing for '${key}' - no fallback was available in 'en'`)
      return `<LANG_ERR_${key}>`
    }
    return localizedString
  }
}
