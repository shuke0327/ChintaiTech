/*****************
 * Andrew Coutts
 * 2019
 * Root page which hosts the sidebar and lazy loads the content pages
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import Header from "SharedComponents/Header"
import Footer from "SharedComponents/Footer"
import styled from "styled-components"
import { FlexColumn, EAuctionPortalViews } from "lib/GlobalStyles"
import { ColorBackground } from "lib/colors"
import { ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Countdown from "./Countdown"
import RoundOverview from "./RoundOverview"
import RoundHistoryTable from "./RoundHistoryTable"
import Chart from "./Chart"
import RoundsSummary from "./AuctionSummary"
import NavBar from "./DashboardNav"
// import { FaQuestionCircle, FaIdCard, FaFileSignature, FaMapMarkerAlt, FaHome, FaMoneyBillWaveAlt } from "react-icons/fa"
import KycStatus from "./KycStatus"
import MyContributions from "./MyContributions"
import ReactTooltip from "react-tooltip"
import queryString from "query-string"
import { HeadWarning, AssistedBid, ManualBid, OrderConfiguration } from "./GetChex"
import { PulseLoader } from "react-spinners"
import { RegionRestricted } from "Pages/ErrorPage"
import TosComponent from "./TermsAndConditions"
import Referral from "./Referral"
import ProjectDescription from "./ProjectDescription"

const Body = styled(FlexColumn)`
  margin-top: 70px;
  justify-content: center;
  overflow: hidden;
  background: ${ColorBackground};
  align-items: center;
  z-index: 1;
`

const PageDimmer = styled.div`
  z-index: 2;
  opacity: ${(props: { dimmerVisible: boolean }) => (props.dimmerVisible ? 1 : 0)};
  visibility: ${(props: { dimmerVisible: boolean }) => (props.dimmerVisible ? "visible" : "hidden")};
  background-color: #00000090;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  transition: opacity 0.3s ease;
`

const PageSection = styled.div`
  margin-bottom: 25px;
  width: calc(100% - 50px);

  &:first-of-type {
    margin-top: 40px;
  }

  @media( max-width: 830px) {
    width: calc(100% - 20px);
  }
`

/* The magic CSS grid that is styled based on conditions like the current selected view and KYC status */
const DashboardGrid = styled.div`
  justify-content: center;
  display: grid;
  min-height: calc(100vh - 70px - 140px - 55px);
  grid-gap: 0.8em;
  max-width: 1250px;
  margin-left: auto;
  margin-right: auto;

  /* 1. Dashboard view */
  grid-template-columns: minmax(450px, 1fr) 1fr;
  grid-template-rows: ${(props: { shouldShowKycWarning: boolean }) => props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) 88px 242px 320px" : "fit-content(1px) fit-content(1px) 88px 242px 320px"};
  grid-template-areas:"project project"
                      "navBar navBar"
                      ${(props: { shouldShowKycWarning: boolean }) => props.shouldShowKycWarning ? "\"headWarning headWarning\"" : ""}
                      "roundStats priceTable"
                      "countdown priceTable"
                      "chart chart";

  /* 2. KYC status view */
  ${(props: { activeView: string, shouldShowKycWarning: boolean }) => props.activeView === EAuctionPortalViews.kyc && `
    grid-template-rows: ${props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px)" : "fit-content(1px) fit-content(1px) fit-content(1px)"};
    grid-template-areas:"project project"
                        "navBar navBar"
                        ${props.shouldShowKycWarning ? "\"headWarning headWarning\"" : ""}
                        "kycStatus kycStatus";
  `}

  /* 3. My contributions view */
  ${(props: { activeView: string, shouldShowKycWarning: boolean }) => props.activeView === EAuctionPortalViews.contributions && `
    grid-template-rows: ${props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px)" : "fit-content(1px) fit-content(1px) fit-content(1px)"};
    grid-template-areas:"project project"
                        "navBar navBar"
                        ${props.shouldShowKycWarning ? "\"headWarning headWarning\"" : ""}
                        "contributions contributions";
  `}

  /* 4. Auction summary view */
  ${(props: { activeView: string, shouldShowKycWarning: boolean }) => props.activeView === EAuctionPortalViews.rounds && `
    grid-template-rows: ${props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px)" : "fit-content(1px) fit-content(1px) fit-content(1px)"};
    grid-template-areas:"project project"
                        "navBar navBar"
                        ${props.shouldShowKycWarning ? "\"headWarning headWarning\"" : ""}
                        "roundsSummary roundsSummary";
  `}

  /* 5. TOS view */
  ${(props: { activeView: string, shouldShowKycWarning: boolean, tosConfirmed: boolean }) => props.activeView === EAuctionPortalViews.getChex && !props.tosConfirmed && `
    grid-template-rows: ${props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px)" : "fit-content(1px) fit-content(1px) fit-content(1px)"};
    grid-template-areas:"project project"
                        "navBar navBar"
                        ${props.shouldShowKycWarning ? "\"headWarning headWarning\"" : ""}
                        "tosContent tosContent";
  `}

  /* 6. Get CHEX view after they have accepted the TOS */
  ${(props: { activeView: string, shouldShowKycWarning: boolean, tosConfirmed: boolean }) => props.activeView === EAuctionPortalViews.getChex && props.tosConfirmed && `
    grid-template-rows: ${props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) 88px 242px 106px fit-content(1px)" : "fit-content(1px) fit-content(1px) 88px fit-content(1px) 106px fit-content(1px)"};
    grid-template-areas:"project project"
                        "navBar navBar"
                        ${props.shouldShowKycWarning ? "\"headWarning headWarning\"" : ""}
                        "roundStats bidConfig"
                        "countdown bidConfig"
                        "bidChexManual bidConfig"
                        "bidChexManual bidChexAssisted";
  `}

  /* 7. Referral Link view */
  ${(props: { activeView: string, shouldShowKycWarning: boolean, tosConfirmed: boolean }) => props.activeView === EAuctionPortalViews.referral && `
  grid-template-rows: ${props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px)" : "fit-content(1px) fit-content(1px) fit-content(1px)"};
  grid-template-areas:"project project"
                      "navBar navBar"
                      ${props.shouldShowKycWarning ? "\"headWarning headWarning\"" : ""}
                      "referral referral";
  `}

  /* Mobile views */
  @media( max-width: 830px) {
    /* 1. Dashboard view */
    grid-template-columns: 1fr;
    grid-template-rows: ${(props: { shouldShowKycWarning: boolean }) => props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px) 350px 350px" : "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px) 350px 350px"};
    grid-template-areas:"project"
                        "navBar"
                        ${(props: { shouldShowKycWarning: boolean }) => props.shouldShowKycWarning ? "\"headWarning\"" : ""}
                        "roundStats"
                        "countdown"
                        "priceTable"
                        "chart";

    /* 2. KYC status view */
    ${(props: { activeView: string, shouldShowKycWarning: boolean }) => props.activeView === EAuctionPortalViews.kyc && `
      grid-template-rows: ${props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px)" : "fit-content(1px) fit-content(1px) fit-content(1px)"};
      grid-template-areas:"project"
                          "navBar"
                          ${props.shouldShowKycWarning ? "\"headWarning\"" : ""}
                          "kycStatus";
    `}

    /* 3. My contributions view */
    ${(props: { activeView: string, shouldShowKycWarning: boolean }) => props.activeView === EAuctionPortalViews.contributions && `
      grid-template-rows: ${props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px)" : "fit-content(1px) fit-content(1px) fit-content(1px)"};
      grid-template-areas:"project"
                          "navBar"
                          ${props.shouldShowKycWarning ? "\"headWarning\"" : ""}
                          "contributions";
    `}

    /* 4. Auction summary view */
    ${(props: { activeView: string, shouldShowKycWarning: boolean }) => props.activeView === EAuctionPortalViews.rounds && `
      grid-template-rows: ${props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px)" : "fit-content(1px) fit-content(1px) fit-content(1px)"};
      grid-template-areas:"project"
                          "navBar"
                          ${props.shouldShowKycWarning ? "\"headWarning\"" : ""}
                          "roundsSummary";
    `}


    /* 5. TOS view on Get CHEX page */
    ${(props: { activeView: string, shouldShowKycWarning: boolean, tosConfirmed: boolean }) => props.activeView === EAuctionPortalViews.getChex && !props.tosConfirmed && `
      grid-template-rows: ${props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px)" : "fit-content(1px) fit-content(1px) fit-content(1px)"};
      grid-template-areas:"project"
                          "navBar"
                          ${props.shouldShowKycWarning ? "\"headWarning\"" : ""}
                          "tosContent";
    `}

      /* 6. Get CHEX view after they have accepted the TOS */
      ${(props: { activeView: string, shouldShowKycWarning: boolean, tosConfirmed: boolean }) => props.activeView === EAuctionPortalViews.getChex && props.tosConfirmed && `
      grid-template-rows: ${props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px)" : "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px)"};
      grid-template-areas:"project"
                          "navBar"
                          ${props.shouldShowKycWarning ? "\"headWarning\"" : ""}
                          "roundStats"
                          "countdown"
                          "bidConfig"
                          "bidChexAssisted"
                          "bidChexManual";
    `}

    /* 7. TOS view on Get CHEX page */
    ${(props: { activeView: string, shouldShowKycWarning: boolean, tosConfirmed: boolean }) => props.activeView === EAuctionPortalViews.referral && `
      grid-template-rows: ${props.shouldShowKycWarning ? "fit-content(1px) fit-content(1px) fit-content(1px) fit-content(1px)" : "fit-content(1px) fit-content(1px) fit-content(1px)"};
      grid-template-areas:"project"
                          "navBar"
                        ${props.shouldShowKycWarning ? "\"headWarning\"" : ""}
                        "tosContent";
    `}
  }

`

const LoaderContainer = styled(FlexColumn)`
  position: absolute;
  left: calc(50% - 60px);
  top: calc(50% - 60px);
  width: 120px;
  height: 120px;
  justify-content: center;
  align-items: center;
`

@inject("stores")
@observer
class AuctionPanels extends Component<IStoreProps & { activeView: EAuctionPortalViews }> {
  render() {
    switch (this.props.activeView) {
      case EAuctionPortalViews.dashboard:
      default: {
        return (
          <React.Fragment>
            <ProjectDescription />
            {/* {this.props.stores!.appStore.shouldShowKycWarning ? <HeadWarning /> : null} */}
            <Countdown />
            <RoundOverview />
            <RoundHistoryTable />
            <Chart />
          </React.Fragment>
        )
      }

      case EAuctionPortalViews.kyc: {
        return (
          <React.Fragment>
            {this.props.stores!.appStore.shouldShowKycWarning ? <HeadWarning /> : null}
            <ProjectDescription />
            <KycStatus />
          </React.Fragment>
        )
      }

      case EAuctionPortalViews.contributions: {
        return (
          <React.Fragment>
            {this.props.stores!.appStore.shouldShowKycWarning ? <HeadWarning /> : null}
            <ProjectDescription />
            <MyContributions />
          </React.Fragment>
        )
      }

      case EAuctionPortalViews.rounds: {
        return (
          <React.Fragment>
            {this.props.stores!.appStore.shouldShowKycWarning ? <HeadWarning /> : null}
            <ProjectDescription />
            <RoundsSummary />
          </React.Fragment>
        )
      }

      case EAuctionPortalViews.referral: {
        return (
          <React.Fragment>
            {this.props.stores!.appStore.shouldShowKycWarning ? <HeadWarning /> : null}
            <ProjectDescription />
            <Referral />
          </React.Fragment>
        )
      }

      case EAuctionPortalViews.getChex: {
        if (this.props.stores!.appStore.regionBlocked === -1) { // Loading block check
          return (
            <LoaderContainer><PulseLoader color={"#fff"} /></LoaderContainer>
          )
        } else if (this.props.stores!.appStore.regionBlocked === 0) { // Not blocked
          if (this.props.stores!.appStore.tosConfirmed) { // TOS have been confirmed
            return (
              <React.Fragment>
                <ProjectDescription />
                {this.props.stores!.appStore.shouldShowKycWarning ? <HeadWarning /> : null}
                <AssistedBid />
                <ManualBid />
                <OrderConfiguration />
                <Countdown />
                <RoundOverview />
              </React.Fragment>
            )
          } else {
            return (
              <React.Fragment>
                <ProjectDescription />
                {this.props.stores!.appStore.shouldShowKycWarning ? <HeadWarning /> : null}
                <TosComponent />
              </React.Fragment>
            )
          }
        } else {
          return (
            <RegionRestricted />
          )
        }
      }
    }
  }
}

@inject("stores")
@observer
export default class PageRoot extends Component<IStoreProps & { activeView: EAuctionPortalViews }> {
  componentDidMount() {
    // Benchmark Nodeos endpoints + auto-log into scatter
    this.props.stores!.walletStore.benchmarkNodeosEndpoints()

    // Save the affiliate ID
    const affiliate = queryString.parse(this.props.stores!.routerStore.location.search).ref as string
    if (affiliate) {
      this.props.stores!.appStore.setAffiliateReferral(affiliate)
      this.props.stores!.routerStore.history.push({
        pathname: this.props.stores!.routerStore.location.pathname,
        search: "",
      })
    }
  }

  render() {
    return (
      <FlexColumn>
        <Header />
        <Body>
          <PageSection>
            <DashboardGrid activeView={this.props.activeView} shouldShowKycWarning={this.props.stores!.appStore.shouldShowKycWarning} tosConfirmed={this.props.stores!.appStore.tosConfirmed}>
              <NavBar activeView={this.props.activeView} />
              <AuctionPanels activeView={this.props.activeView} />
            </DashboardGrid>
          </PageSection>

          {/* <PageSection>
            <IslandContainer>
              <IslandContent>
                <FlexRow>
                  <h1><FaQuestionCircle /> CHEX Token Auction Instructions</h1>
                </FlexRow>

                <FlexColumn>
                  <h3>Step 1) Complete KYC through external provider</h3>
                  <FlexRow>
                    <FlexColumn>
                      <h4>KYC REQUIREMENTS (Below 15,000 CHF)</h4>
                      <ul>
                        <li><FaIdCard /> Photo ID or Passport</li>
                        <li><FaFileSignature /> Full Name</li>
                        <li><FaMapMarkerAlt /> Address</li>
                      </ul>
                    </FlexColumn>
                    <FlexColumn>
                      <h4>KYC REQUIREMENTS (Above 15,000 CHF)</h4>
                      <ul>
                        <li><FaIdCard /> Photo ID or Passport</li>
                        <li><FaFileSignature /> Full Name</li>
                        <li><FaMapMarkerAlt /> Address</li>
                        <li><FaHome /> Proof of Address</li>
                        <li><FaMoneyBillWaveAlt /> Proof of Funds</li>
                      </ul>
                    </FlexColumn>
                  </FlexRow>
                </FlexColumn>

                <FlexColumn>
                  <h3>Step 2) Send EOS, BTC, ETH, or Fiat to auction contract</h3>
                </FlexColumn>

                <FlexColumn>
                  <h3>Step 3) Receive your CHEX tokens</h3>
                </FlexColumn>
              </IslandContent>
            </IslandContainer>
          </PageSection> */}
        </Body >
        <Footer />
        <ReactTooltip type={"dark"} effect={"solid"} />
        <PageDimmer dimmerVisible={this.props.stores!.appStore.pageDimmerVisible} onClick={() => this.props.stores!.appStore.handlePageDimmerClick()} />
        <ToastContainer transition={Slide} className={"toastContainer"} toastClassName={"notifyContainer"} bodyClassName={"notifyBody"} progressClassName={"notifyProgress"} draggable={false} closeOnClick={false} />
      </FlexColumn >
    )
  }
}
