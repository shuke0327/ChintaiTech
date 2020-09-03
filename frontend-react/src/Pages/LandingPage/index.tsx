/*****************
 * Andrew Coutts
 * 2019
 * Root page which hosts the sidebar and lazy loads the content pages
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import Header from "./Header"
import Footer from "./Footer"
import styled from "styled-components"
import { FlexColumn, TitleText, LandingRowInner, PageRow, PageRowWhite, PageRowMaxWidth } from "lib/GlobalStyles"
import { ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import TeamList, { TeamViewExpanded } from "./TeamList/TeamList"
import Roadmap from "./Roadmap"
import BlueWater from "SharedComponents/bluewater"
import BubbleImage from "./bubble-image.png"
import GridImage from "./grid-image.png"
import TeamBgLeftImg from "./team-bg-left.png"
import TeamBgRightImg from "./team-bg-right.png"
import AboutChintai from "./AboutChintai"
import Products, { ProductItemViewExpanded } from "./Products"
import Industry, { IndustryItemViewExpanded } from "./Industry"
import { ScreenshotsComponent } from "./LandingScreenshots"
import KeyPointComponent from "./KeyPoints"
import LandingContent from "./LandingContent"
import queryString from "query-string"
import ProductBackgroundImg from "./Products/products-background-image.png"


const Body = styled(FlexColumn)`
  margin-top: 0px;
  min-height: calc(100vh - 215px);
  justify-content: center;
  overflow: hidden;
`

const LandingRow = styled(PageRow)`
  position: relative;
`
const FirstLandingRow = styled(PageRow)`
  position: relative;
  min-height: 40vh;
`

const BubbleImageCointainer = styled.div`
  z-index: -1010;
  position: absolute;
  top: 0;
  left: 0;
  height: auto;
  pointer-events: none;
  opacity: 1;
  display: flex;
  img {
    width: 100vw;
  }
  @media screen and (max-width: 1024px) {
    display: none;
  }
`

const ProductsRow = styled(PageRowWhite)`
  position: relative;
  width: 100%;
  background-image: url(${ProductBackgroundImg});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  @media screen and (max-width: 660px) {
    background-image: none;
  }
`
const MainPageLandingRowInner = styled(LandingRowInner)`
  padding-top: 75px;
  margin-bottom: 80px;
  justify-content: center;

  @media (max-width: 830px) {
    padding-top: 10px;
  }
`

const PageDimmer = styled.div`
  z-index: 10;
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
  padding-top: 50px;
  justify-content: center;
  width:58vw;
  display: grid;
  grid-template-areas: "landingContent screenshots";
  grid-template-columns: 50% auto;
  align-items: flex-start;
  grid-gap: 10%;
  @media screen and (max-width: 1260px) {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`

// const SecondRow = styled(PageRowWhite)`
//   padding-top: 150px;
//   padding-left: 15px;
//   padding-right: 15px;
// `

const SectionText = styled(TitleText)`
  text-align: center;
  height: 35px;
  color: #374572;
  font-family: PoppinsLight;
  font-size: 2em;
  font-weight: 700;
  line-height: 48px;
  letter-spacing: -0.36px;
`
const SectionSubtext = styled.p`
/* Style for "team subtext" */
width: 669px;
height: 48px;
color: #334a5f;
font-family: PoppinsLight;
font-size: 18px;
font-weight: 400;
line-height: 30px;
text-align: center;
@media screen and (max-width: 660px) {
  width: 80%;
  padding-top: 20px;
  font-size: 15px;
}
`

const RoadmapRow = styled(PageRowWhite)`
  position: relative;
`

const TeamRow = styled(PageRowWhite)`
  position: relative;
  background-image: url(${TeamBgLeftImg});
  background-position: 0 90%;
  background-repeat: no-repeat;
  background-size: content;
  @media(max-width:660px){
    background-image: none;
  }
`

const TeamAdvisorRow = styled(PageRowWhite)`
  position: relative;
  background-image: url(${TeamBgRightImg});
  background-position: 100% 80%;
  background-repeat: no-repeat;
  background-size: 25%;
  @media(max-width:660px){
    background-image: none;
  }
`

const RoadmapBubble = styled(BubbleImageCointainer)`
  top: -89px;
  left: 0;
  opacity:0.45;
  height: 170%;
  @media(max-width:660px){
    display:none;
  }
`

const GridImageContainer = styled.div`
  position: absolute;
  top: 20%;
  right: 30%;
  z-index: -10000;
  img {
      height: 50px;
    }
  @media(max-width:660px) {
    display:none;
  }
`

@inject("stores")
@observer
export default class LandingPage extends Component<IStoreProps> {
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

  render() {
    return (
      <FlexColumn>
        <Body>
          <Header />
          <GridImageContainer>
            <img src={GridImage} />
          </GridImageContainer>
          <BlueWater />
          <BubbleImageCointainer>
            <img src={BubbleImage} />
          </BubbleImageCointainer>
          <FirstLandingRow>
            <MainPageLandingRowInner>
              <LandingGrid>
                <LandingContent />
                <ScreenshotsComponent />
              </LandingGrid>
            </MainPageLandingRowInner>
          </FirstLandingRow>
          <LandingRow>
            <KeyPointComponent />
          </LandingRow>
          <PageRow>
            <AboutChintai />
          </PageRow>
          <ProductsRow>
            <PageRowMaxWidth>
              <SectionText>
                {this.props.stores!.langStore.safeGetLocalizedString("products.title")}
              </SectionText>
              <Products />
            </PageRowMaxWidth>
          </ProductsRow>
          <Industry />
          <RoadmapRow>
            <RoadmapBubble>
              <img src={BubbleImage} />
            </RoadmapBubble>
            <PageRowMaxWidth>
              <SectionText>
                {this.props.stores!.langStore.safeGetLocalizedString("roadmap.sectionTitle")}
              </SectionText>
              <Roadmap />
            </PageRowMaxWidth>
          </RoadmapRow>
          <TeamRow>
            <PageRowMaxWidth>
              <SectionText>
                {this.props.stores!.langStore.safeGetLocalizedString("team.chintaiCoreTeam")}
              </SectionText>
              <SectionSubtext>
                {this.props.stores!.langStore.safeGetLocalizedString("team.TeamSubtext")}
              </SectionSubtext>
              <TeamList advisors={false} />
            </PageRowMaxWidth>
          </TeamRow>
          <TeamAdvisorRow>
            <PageRowMaxWidth>
              <SectionText>
                {this.props.stores!.langStore.safeGetLocalizedString("team.chintaiAdvisors")}
              </SectionText>
              <TeamList advisors={true} />
            </PageRowMaxWidth>
          </TeamAdvisorRow>
          {/* <SecondRow>
            <PageRowMaxWidth>
              <SectionText>
                {this.props.stores!.langStore.safeGetLocalizedString("partners.title")}
              </SectionText>
              <Partner />
            </PageRowMaxWidth>
          </SecondRow> */}
        </Body >
        <Footer />
        <PageDimmer dimmerVisible={this.props.stores!.appStore.pageDimmerVisible} onClick={() => this.props.stores!.appStore.handlePageDimmerClick()} />
        <TeamViewExpanded />
        <ProductItemViewExpanded />
        <IndustryItemViewExpanded />
        <ToastContainer transition={Slide} className={"toastContainer"} toastClassName={"notifyContainer"} bodyClassName={"notifyBody"} progressClassName={"notifyProgress"} draggable={false} closeOnClick={false} />
      </FlexColumn >
    )
  }
}
