/*****************
 * Andrew Diedrich
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { Gray, TitleText, IslandContainer, IslandContent, PageRow, WhiteBlueButton, FlexRow } from "lib/GlobalStyles"
import { Link } from "react-router-dom"
import ChintaiArrowGreen from "../../../lib/chintai_arrow_green.svg"
import ChintaiLogo from "../../../lib/chintai-logo-lightblue.svg"
import { Events, Link as ScrollLink } from "react-scroll"
import { FaUserCheck, FaCogs, FaFolderPlus } from "react-icons/fa";

const LandingContentContainer = styled(IslandContainer)`
  grid-area: landingContent / landingContent / landingContent / landingContent;
  z-index: 1;
  width:100vw;
  height:40vh;
  padding: 0;
  box-shadow: none;

  h4 {
    color: #fff;
    font-weight: 100;
    font-family: Catamaran;
    font-size: 1.65em;
    margin: 0;
  }
`

const LandingContentBanner = styled(IslandContainer)`
  grid-area: landingContent / landingContent / landingContent / landingContent;
  z-index: 1;
  padding: 0;
  background: #0d78ca;
  width:100vw;
  height:45vh;
  border-bottom-left-radius:50%;
  border-bottom-right-radius:50%;
  background-image: url(${ChintaiLogo});
  background-repeat: no-repeat;
  background-size: 1500px;
  background-attachment: fixed;
  background-position: 50% 50%; 
  overflow: hidden;

  h4 {
    color: #fff;
    font-weight: 100;
    font-family: Catamaran;
    font-size: 1.65em;
    margin: 0;
  }

  ${TitleText} {
    color: #fff;
    text-transform: inherit;
    font-family: Catamaran;
    /* margin-bottom: 35px; */
    font-size: 2.5em;
    line-height: 1.1;
    letter-spacing: 1px;

  }

  @media(max-width: 1020px) {
    height: 55vh;
  }

  /* Mobile views */
  @media( max-width: 440px) {
  /* 1. Dashboard view */
  background-size: 500px;
  }
`

const WhyList = styled.ul`
  padding: 0;
    
  li {
    color: ${Gray};
    text-transform: inherit;
    font-family: Catamaran;
    margin-bottom: 5px;
    font-size: 1.2em;
    line-height: 1.1;
    letter-spacing: 1px;
    display: block;
  }
`

const LandingButtonsContainer = styled(FlexRow)`
  justify-content: center;
  flex-wrap: wrap;
  padding: .5em;

  a {
    padding: 12.5px 25px;
  }
`

const LandingContentIsland = styled(IslandContent)`
  margin-bottom: 13px;
  text-align: center;
  padding-top: 25px;


  h1 {
    padding: 0px 135px;

    @media (max-width: 615px) {
      padding: initial;
    }
  }

  @media (max-width: 420px) {
    margin-bottom: 25px;
    font-size: 0.75em;
  }
`

const LandingContentNextSection = styled(IslandContent)`
  margin-top: 45px;
  text-align: center;
  padding: 15px;

  img {
    cursor: pointer;
    width: 3em;
  }

  h1 {
    padding: 0px 135px;

    @media (max-width: 615px) {
      padding: initial;
    }
  }

  @media (max-width: 420px) {
    margin: 25px;
    font-size: 0.75em;
  }
`

export const PageRowContent = styled(PageRow)`
  padding-top: 20px;

  &:last-of-type {
    padding-bottom: 100px;
  }

  @media (max-width: 830px) {
   padding-top: 10px; 
  }
`

const CenterRow = styled(FlexRow)`
  justify-content: space-evenly;
  flex-wrap: wrap;
`

export const BulletList = styled.ul`
  padding: 1px;

  li::after {
    content: "•";
    padding: 5px;
  }
  li:last-child::after {
    content: none;
  }
  li {
    list-style-type: none;
    float: left;
    font-weight: bold;
  }
`

const UserCheck = styled(FaUserCheck)`
  font-size: 2em;
  color: ${Gray};
`
const Cogs = styled(FaCogs)`
  font-size: 2em;
  color: ${Gray};
`
const FolderPlus = styled(FaFolderPlus)`
  font-size: 2em;
  color: ${Gray};
`

@inject("stores")
@observer
export default class LandingContent extends Component<IStoreProps> {

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

  render() {
    return (
      <LandingContentContainer>

        <LandingContentBanner>
          <LandingContentIsland>
            <TitleText>{this.props.stores!.langStore.safeGetLocalizedString("leasingLandingTitle")}</TitleText>
            <CenterRow>
              <BulletList>
                <li key="b1">{this.props.stores!.langStore.safeGetLocalizedString("leasingLandingContent.bullet1")}</li>
                <li key="b2">{this.props.stores!.langStore.safeGetLocalizedString("leasingLandingContent.bullet2")}</li>
                <li key="b3">{this.props.stores!.langStore.safeGetLocalizedString("leasingLandingContent.bullet3")}</li>
              </BulletList>
            </CenterRow>
            {/* <ContentImage src={ChintaiLogo} alt="gold chintai logo"/> */}
            <LandingButtonsContainer>
              <Link to={`/automatedleasing/portal`}>
                <WhiteBlueButton style={{ width: "150px" }}>{this.props.stores!.langStore.safeGetLocalizedString("leaseButton")}</WhiteBlueButton>
              </Link>
            </LandingButtonsContainer>
          </LandingContentIsland>
        </LandingContentBanner>

        <LandingContentNextSection>
          <TitleText style={{ color: "#0d78ca" }}>{this.props.stores!.langStore.safeGetLocalizedString("leasingLandingAdvantages.title")}</TitleText>
          <CenterRow>
            <WhyList>
              <UserCheck />
              <li key="text1">{this.props.stores!.langStore.safeGetLocalizedString("leasingLandingAdvantages.text1")}</li>
              <Cogs />
              <li key="text2">{this.props.stores!.langStore.safeGetLocalizedString("leasingLandingAdvantages.text2")}</li>
              <FolderPlus />
              <li key="text3">{this.props.stores!.langStore.safeGetLocalizedString("leasingLandingAdvantages.text3")}</li>
            </WhyList>
          </CenterRow>
          <ScrollLink activeClass="active" className="test6" to="anchor" spy={true} smooth={true} duration={500} >
            <span>
              <img src={ChintaiArrowGreen} />
            </span>
          </ScrollLink>
        </LandingContentNextSection>

      </LandingContentContainer>
    )
  }
}