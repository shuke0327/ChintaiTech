/*****************
 * Andrew Diedrich
 * 2019
 * Root page which hosts the sidebar and lazy loads the content pages
 *****************/
import React, { Component } from "react"
import Header from "SharedComponents/Header"
import Footer from "SharedComponents/Footer"
import ActionForm from "./ActionForm"
import AccountConfig from "./AccountConfig"
import TxHistory from './TxHistory'
// import NavBar from "./DashboardNav"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import queryString from "query-string"
import styled from "styled-components"
import EOSCHEXConvert from "./EOSCHEXConvert"
import PortalTitle from "./PortalTitle"
// import ConfigureHistory from "./ActionHistory/Configure"

//import queryString from "query-string"
import { ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FlexColumn, ELeasingPortalViews, ColorLeasingPortalBackground } from "lib/GlobalStyles"
import "react-toastify/dist/ReactToastify.css"
import ReactTooltip from "react-tooltip"


const Body = styled(FlexColumn)`
  margin-top: 70px;
  min-height: calc(100vh - 215px);
  justify-content: center;
  overflow: hidden;
  background: ${ColorLeasingPortalBackground};
  color: #324B56;
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
  margin: 60px auto;
  width: calc(100% - 50px);

  /* &:first-of-type {
    margin-top: 25px;
  } */

  @media( max-width: 830px) {
    width: calc(100% - 20px);
  }
`

export const Form = styled.form`
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Input = styled.input`
  width: 300px;
  height: 35px;
  border: 1px solid #ccc;
  background-color: #fff;
`

export const Button = styled.button`
  width: 300px;
  height: 35px;
  background-color: #5995ef;
  color: #fff;
  border-radius: 3px;
`

// Text

export const Title = styled.h1`
  /* font-family: 'Raleway', sans-serif; */
  font-weight: 600;
  color: #fff;
  font-size: 2.2em;
`

export const Title2 = styled.h2`
  /* font-family: 'Raleway', sans-serif; */
  font-weight: 300;
  color: #fff;
  font-size: 1.8em;
`

export const Text = styled.p`
  /* font-family: 'Raleway', sans-serif; */
  color: ${props => props.color || '#4d4d4d'};
`
/* The magic CSS grid that is styled based on conditions like the current selected view and KYC status */
const DashboardGrid = styled.div`
  justify-content: center;
  display: grid;
  min-height: calc(100vh - 70px - 144px);
  grid-column-gap: 1.5em;
  grid-row-gap: 1em;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;

  /* 1. Dashboard view */
  grid-template-columns: 890px 445px;
  grid-template-rows: 25px 190px minmax(300px, 2fr) minmax(300px, 2fr) minmax(300px, 2fr);
  grid-template-areas: "portalTitle portalTitle "
                       "actionForms chexConverter"
                       "accountConfig accountConfig"
                       "txHistory txHistory";

  /* Mobile views */
  @media( max-width: 1265px) {
    /* 1. Dashboard view */
    grid-template-columns: 890px 445px;
    grid-template-rows: 25px 190px 300px 250px;
    grid-template-areas:"portalTitle portalTitle "
                        "actionForms chexConverter"
                        "accountConfig accountConfig"
                        "txHistory txHistory";
  }

  @media( max-width: 830px) {
    /* 1. Dashboard view */
    grid-template-columns: 1fr;
    grid-template-rows: 70px auto 350px 250px 350px 350px;
    grid-template-areas:"portalTitle"
                        "actionForms"
                        "chexConverter"
                        "accountConfig"
                        "txHistory";
  }

  @media( max-width: 465px) {
  /* 1. Dashboard view */
  grid-template-columns: 320px;
  grid-template-rows: repeat(2, auto) 350px 250px 350px 350px;
  grid-template-areas:"portalTitle"
                      "actionForms"
                      "chexConverter"
                      "accountConfig"
                      "txHistory";
  }
`

@inject("stores")
@observer
class LeasingPanels extends Component<IStoreProps & { activeView: ELeasingPortalViews }> {
  render() {
    switch (this.props.activeView) {
      case ELeasingPortalViews.dashboard:
      default: {
        return (
          <React.Fragment>
            <ActionForm />
            <EOSCHEXConvert />
            <AccountConfig />
            <TxHistory />
          </React.Fragment>
        )
      }
    }
  }
}

@inject("stores")
@observer
export default class LeasingPage extends Component<IStoreProps & { activeView: ELeasingPortalViews }> {

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
            <DashboardGrid>
              <PortalTitle />
              {/* <NavBar activeView={this.props.activeView} /> */}
              <LeasingPanels activeView={this.props.activeView} />
            </DashboardGrid>
          </PageSection>
        </Body >
        <Footer />
        <ReactTooltip type={"dark"} effect={"solid"} />
        <PageDimmer dimmerVisible={this.props.stores!.appStore.pageDimmerVisible} onClick={() => this.props.stores!.appStore.handlePageDimmerClick()} />
        <ToastContainer transition={Slide} className={"toastContainer"} toastClassName={"notifyContainer"} bodyClassName={"notifyBody"} progressClassName={"notifyProgress"} draggable={false} closeOnClick={false} />
      </FlexColumn >
    )
  }
}
