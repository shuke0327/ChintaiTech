/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React from "react"
import ReactDOM from "react-dom"
import { Router, Route, Switch } from "react-router-dom"
import * as serviceWorker from "./serviceWorker"
import { Provider } from "mobx-react"
import RootStore from "stores/RootStore"
import { createGlobalStyle } from "styled-components"
import createBrowserHistory from "history/createBrowserHistory"
import { syncHistoryWithStore } from "mobx-react-router"
import LandingPage from "Pages/LandingPage"
import ErrorPage from "Pages/ErrorPage"
import NanamiBold from "lib/Nanami-Bold.otf"
import { ColorDarkGrayText, ColorFont } from "lib/colors"
import "react-virtualized/styles.css"
import "react-toggle/style.css"
// import "react-vis/dist/style/legends"
import ReactGA from "react-ga"

// Setup Google Analytics. Use another tag in development
ReactGA.initialize(process.env.NODE_ENV === "production" ? "UA-136680716-2" : "UA-136680716-3", {
  debug: false,
})
ReactGA.pageview(window.location.pathname + window.location.search)

// Setup rootStore
const rootStore = new RootStore()

// Routing
const browserHistory = createBrowserHistory()
const history = syncHistoryWithStore(browserHistory, rootStore.routerStore)

// Global style override for body margin
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Catamaran');

  @font-face {
    font-family: Nanami;
    src: url(${NanamiBold});
  }

  body {
    margin: 0;
    color: ${ColorFont};
    font-weight: 300;
    font-family: PoppinsLight;
    -webkit-font-smoothing: antialiased;
  }

  .notifyContainer {
    color: ${ColorDarkGrayText}!important;
    min-height: 0px!important;
    font-size: 0.9em!important;
    margin-bottom: 0.75em!important;
    box-shadow: 1px 1px 8px #00000090!important;
    cursor: default!important;
  }

  .react-toggle--checked .react-toggle-track {
    background-color: #00CE7D!important;
  }

  .react-toggle-thumb {
    /* border: none!important;
    top: 3px!important;
    left: 3px!important;
    width: 18px!important;
    height: 18px!important; */
  }

  .react-toggle--checked .react-toggle-thumb {
    /* left: 28px!important; */
  }

  .react-toggle-track {
    /* background-color: #324b5690!important; */
  }

  .react-toggle--focus .react-toggle-thumb, .react-toggle:active:not(.react-toggle--disabled) .react-toggle-thumb {
    box-shadow: none!important;
  }

  .react-toggle:hover {
    /* background-color: inherit!important; */
  }
`

// .Toastify__close-button--default {
//   align-self: center!important;
//   font-size: 1.3em!important;
//   user-select: none;
//   margin-left: 8px;
// }

// .toastContainer {
//   z-index: 0!important;
//   bottom: 3em!important;
// }

// .notifyContainerError {
//   background-color: ${ColorRed}!important;
//   color: #ffffff!important;
// }

// .notifyProgress {
//   background: linear-gradient(to right, #85CE38, #00A6CC)!important;
// }

ReactDOM.render(
  <Provider stores={rootStore}>
    <Router history={history}>
      <React.Fragment>
        <Switch>
          {/* Valid Routes */}
          <Route exact path="/" component={LandingPage} />
          {/* Error Route */}
          <Route path="*" component={() => <ErrorPage />} />
        </Switch>
        <GlobalStyle />
      </React.Fragment>
    </Router>
  </Provider>,
  document.getElementById("content"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
