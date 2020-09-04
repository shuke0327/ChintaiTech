/*****************
 * Andrew Coutts
 * 2019
 * Root page which hosts the sidebar and lazy loads the content pages
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { Link } from "react-router-dom"
import Header from "SharedComponents/Header"
import Footer from "SharedComponents/Footer"
import styled from "styled-components"
import { FlexColumn, TitleText, LandingRowInner, PageRow, PageRowWhite, PageRowMaxWidth, FlexRow, ColorBlue } from "lib/GlobalStyles"
import { ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LeasingFAQ from "./LeasingFAQ"
import LandingContent from "./LandingContent"
import Pricing from "./Pricing"
import Process from "./Process"
import queryString from "query-string"
// import { FaRegArrowAltCircleRight } from "react-icons/fa";

const Body = styled(FlexColumn)`
  margin-top: 70px;
  min-height: calc(100vh - 215px);
  justify-content: center;
  overflow: hidden;
  background: #fff;
  color: #fff;
`

const LandingRow = styled(PageRow)`
  position: relative;
  min-height: calc(100vh + 60px);
`

const MainPageLandingRowInner = styled(LandingRowInner)`
  padding-right: 0px;
  padding-left: 0px;
  padding-top: 0px;
  margin-bottom: 20px;

  @media (max-width: 830px) {
    
  }
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

const LandingGrid = styled.div`
  justify-content: center;
  display: grid;
  grid-gap: 25px;
  justify-content: center;
  align-items: center;
  grid-template-columns: 1fr;
  grid-template-rows: fit-content(1px) fit-content(1px);
  grid-template-areas: "landingContent"
                        "screenshots";
`

const HighlightColumn = styled(FlexColumn)`
  text-align: center;
  flex: 0 1 350px;
  align-items: center;
  padding: 0px 15px;

  img {
    width: calc(100vw - 30px);
    max-width: 450px;
  }

  h2 {
    margin-bottom: 10px;
  }

  p {
    margin: 0;
    text-align: justify;
  }
`

const PentagonRow = styled(FlexRow)`
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  color: #0d78ca;
`

const BottomRow = styled(PageRow)`
  background-color: #0d78ca;
  padding: 2rem 0;
  border-top-left-radius:20%;
  border-top-right-radius:20%;
`

const LandingButtonsContainer = styled(FlexRow)`
  padding: 45px;
  justify-content: center;
  flex-wrap: wrap;

  a {
    padding: 12.5px 25px;
  }
`


const SetupNow = styled.button`
  border: none;
  border-bottom: 2px solid ${ColorBlue};
  font-size: 2.5em;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.02em;
  padding: 8px 15px;
  cursor: pointer;
  color: ${ColorBlue};
  background-color: transparent;
  transition: all 1s;
  :hover {
    transform: scale(1.1);
  }
`

const FAQTitle = styled(TitleText)`
  color: #fff;
`

interface IAdvantItem {
  title: string;
  text: string;
}

@inject("stores")
@observer
export default class AutomatedLeasing extends Component<IStoreProps> {
  componentDidMount() {
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

  renderAdvantages() {
    return (this.props.stores!.langStore.safeGetLocalizedString("leasingLandingAdvantages")as unknown as Array<IAdvantItem>).map((e: IAdvantItem) => {
      return (
      <HighlightColumn>
        <h2>{e.title}</h2>
        <p>{e.text}</p>
      </HighlightColumn>
      )
    })
  }


  render() {
    return (
      <FlexColumn>
        <Header />
        <Body>
          <LandingRow>
            <MainPageLandingRowInner>
              <LandingGrid>
                <LandingContent />
              </LandingGrid>
            </MainPageLandingRowInner>
          </LandingRow>

          <PageRowWhite id="pricing" style={{paddingTop: "0px"}}>
            <PageRowMaxWidth>
              <PentagonRow>
                <Process />
              </PentagonRow>
              <PentagonRow>
                <Pricing />
              </PentagonRow>
            </PageRowMaxWidth>
          </PageRowWhite>

          <LandingButtonsContainer>
            <Link to={`/automatedleasing/portal`}>    
              <SetupNow>{this.props.stores!.langStore.safeGetLocalizedString("GoToAutoresPortal")}</SetupNow>
            </Link>
          </LandingButtonsContainer>
          

          <BottomRow>
            <PageRowMaxWidth>
              <FAQTitle>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.title")}</FAQTitle>
              <LeasingFAQ />
            </PageRowMaxWidth>
          </BottomRow>

        </Body >
        <Footer />
        <PageDimmer dimmerVisible={this.props.stores!.appStore.pageDimmerVisible} onClick={() => this.props.stores!.appStore.handlePageDimmerClick()} />
        {/* <TeamViewExpanded /> */}
        <ToastContainer transition={Slide} className={"toastContainer"} toastClassName={"notifyContainer"} bodyClassName={"notifyBody"} progressClassName={"notifyProgress"} draggable={false} closeOnClick={false} />
      </FlexColumn >
    )
  }
}
