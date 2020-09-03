import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { FlexColumn, CTALink, ContactLink, CTASection, ItemExpandedContainer, ModalBoxLeftColumn, ModalBoxInnerContent, ModalBoxMainContent, ModalBoxRightColumn, XButton, XButtonSection, ColorBlue, TitleText } from "lib/GlobalStyles"
import ChintaiImg from "./chintai.png"
import ChintaiBackgroundImg from "./blackring-background.png"
import WhiteImg from "./whiteShadow.png"
import BlueImg from "./blueShadow.png"
import BackgroundImg from "./background.svg"
import YouTubePlayer from "react-player/lib/players/YouTube"


const SectionText = styled(TitleText)`
  text-align: center;
  height: 35px;
  color: #fff;
  font-family: PoppinsLight;
  font-size: 2em;
  font-weight: 700;
  line-height: 48px;
  letter-spacing: -0.36px;
  padding-top: 100px;
`

export interface IndustryItem {
  name: string
  subtitle: string,
  image: string,
  imageHover: string,
  imageLarge: string,
  position: string,
  content: Array<string>,
  contactUs: string,
  ctaLink: string,
  ctaText: string,
  videoLink?: string
}

const IndustryBox = styled(FlexColumn)`
  background-image: url(${BackgroundImg});
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  z-index:3;
`

const IndustryContainer = styled.div`
    z-index: 2;
    justify-content: center;
    width:100%;
    display: grid;
    grid-gap: 0;
    align-items: center;
    grid-template-areas: ". leftContainer chintaiImg rightContainer .";
    grid-template-columns: 30% 2fr auto 2fr 30%;
    @media (max-width: 660px) {
      grid-template-columns: auto;
      grid-gap: 10px;
        grid-template-areas:
        "chintaiImg chintaiImg"
        "leftContainer rightContainer";
    }
    padding-top: 50px;
    h1 {
      color: white;
    }

`

const LeftContainer = styled.div`
  grid-area: leftContainer;
  /* Style for "item164" */
  position: relative;
  margin: 50px auto;
  color: blue;
`

const ChintaiImgContainer = styled.div`
  grid-area: chintaiImg;
  background: url(${ChintaiBackgroundImg});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  width: 200px;
  height: 200px;
  margin-bottom: 50px;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media (max-width: 660px) {
    margin: 10px;
    padding: 10px;
    justify-self: center;
  }
`

const RightContainer = styled.div`
  grid-area: rightContainer;
  /* Style for "item164" */
  position: relative;
  margin: 50px auto;
  color: blue;
`

const ItemContainer = styled.div`
  background-image: url(${WhiteImg});
  background-repeat: no-repeat;
  background-size: 140px 160px;
  background-position: center;
  position: relative;
  top: 0;
  left: 0;
  width: 160px;
  height: 180px;
  ::before {
    z-index: -999; 
    content: '';
    width: 160px;
    height: 180px;
    background-color: black;
    position: absolute;
    top: 0;
    left: 0;
    clip-path: polygon(0 25%, 50% 0, 50% 100%, 0 75%);
    transition: clip-path .2s .5s, width .2s .2s, left .2s .2s;
  };
  ::after {
    z-index: -999; 
    content: '';
    width: 160px;
    height: 180px;
    background-color: black;
    position: absolute;
    top: 0;
    left: 0;
    clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%);
    transition: clip-path .2s .5s, width .2s .2s, left .2s .2s;
  };
  &:hover {
    background-image: url(${BlueImg});
    transition: 0.2s;
    p {
      color: white;
      font-size: 12px;
    };
  }
  cursor: grab;
`
const LeftItemContainer = styled(ItemContainer)`
    &:nth-of-type(2) {
      top: -50px;
      left: -74px;
    }
    &:nth-of-type(3) {
      top: -100px;
      left: 0;
    }
    &:nth-of-type(4) {
      top: -150px;
      left: -74px;
    }
    @media (max-width: 660px) {
      &:nth-of-type(2), &:nth-of-type(3), &:nth-of-type(4) {
        top: 0;
        left: 0;
      }
    }
  }
  `

const RightItemContainer = styled(ItemContainer)`
  &:nth-of-type(2) {
    top: -50px;
    left: 74px;
  }
  &:nth-of-type(3) {
    top: -100px;
    left: 0;
  }
  &:nth-of-type(4) {
    top: -150px;
    left: 74px;
  }
  @media (max-width: 660px) {
    &:nth-of-type(2), &:nth-of-type(3), &:nth-of-type(4) {
      top: 0;
      left: 0;
    }
  }
`

const IndustryModalBoxLeftColumn = styled(ModalBoxLeftColumn)`
  @media(max-width: 660px) {
    padding-top: 10px;
    min-height: 250px;
  }
  @media(max-width : 320px) and (orientation : portrait) {
    padding-top: 20px;
    min-height: 200px;
    margin-bottom: 5px;
  }
  // for iphone landscape
  @media (min-width : 320px) and (max-width : 568px) 
  and (orientation : landscape) {
    padding-top: 30px;
    margin-bottom: 20px;
    min-height: 150px;
  }
`

const Icon = styled.div`
    position: absolute;
    top: 27%;
    left: 36%;
  img {
    width: 50px;
  }
`

const SubText = styled.p`
  text-align: center;
  font-family: PoppinsLight;
  position: absolute;
  top: 60%;
  left: 50%;
  width: 95%;
  transform: translate(-50%, -50%) rotate(0);
  color: ${ColorBlue};
  font-size: 0.9em;
  transition: .3s;
`

const IndustryItemExpandedContainer = styled(ItemExpandedContainer)`
  transform: ${(props: { industryItemBoxOpen: boolean }) => props.industryItemBoxOpen ? "scale(1)" : "scale(0)"};
  width: 50%;
  left: 25vw;
`

const IndustryInnerContent = styled(ModalBoxInnerContent)`
  position: relative;
`

const VideoSection = styled.div`
  position: relative;
  padding-top: 56.3%;
  height: 100%;
  margin-bottom: 10px;
  width: 100%;
`
const ResponsivePlayer = styled(YouTubePlayer)`
  position: absolute;
  top: 0;
  left:0;
`


@inject("stores")
@observer
export class IndustryItemViewExpanded extends Component<IStoreProps> {
  getVideoSection = (item: IndustryItem) => {
    if (item.videoLink) {
      return (
        <VideoSection>
          <ResponsivePlayer
            url={item.videoLink}
            playing
            light
            width="100%"
            height="100%"
            preloading
          />
        </VideoSection>
      )
    } else {
      return null
    }
  }
  getCTASection = (item: IndustryItem) => {
    if (item.contactUs && item.ctaText) {
      return (
        <CTASection>
          <ContactLink target="_blank" href="mailto:hello@chintai.io">
            {item.contactUs}
          </ContactLink>
          <CTALink target="_blank" href={item.ctaLink}>
            {item.ctaText}
          </CTALink>
        </CTASection>
      )
    } else if (item.contactUs) {
      return (
        <CTASection>
          <ContactLink target="_blank" href="mailto:hello@chintai.io">
            {item.contactUs}
          </ContactLink>
        </CTASection>
      )
    } else if (item.ctaText) {
      return (
        <CTASection>
          <CTALink target="_blank" href={item.ctaLink}>
            {item.ctaText}
          </CTALink>
        </CTASection>
      )
    } else {
      return null
    }
  }
  render() {
    try {
      const currentSelectedIndustryItem = this.props.stores!.appStore.currentSelectedIndustryItemObject!
      // Now get that user's data from the lang JSON to parse it out
      const industryItemData = (this.props.stores!.langStore.safeGetLocalizedString('industry.industryData') as unknown as Array<IndustryItem>).find((f: IndustryItem) => f.name === currentSelectedIndustryItem.name)!
      if (!industryItemData) { return null } // If user isn't found, don't try to render anything

      return (
        <IndustryItemExpandedContainer industryItemBoxOpen={this.props.stores!.appStore.industryItemBoxOpen}>
          <IndustryInnerContent>
            <XButtonSection onClick={() => this.props.stores!.appStore.closeIndustryItemBox()}>
              <XButton>
                <span>&#x2716;</span>
              </XButton>
            </XButtonSection>
            <ModalBoxMainContent>
              <IndustryModalBoxLeftColumn>
                <img src={`./images/industry/${industryItemData.imageLarge}`} />
                <h1>{industryItemData.name}</h1>
                {/* <h2>{industryItemData.subtitle}</h2>  */}
              </IndustryModalBoxLeftColumn>
              <ModalBoxRightColumn>
                {this.getVideoSection(industryItemData)}
                {
                  (industryItemData.content as unknown as Array<string>).map((e: string) => {
                    return (
                      <p>{e}</p>
                    )
                  })
                }
                {this.getCTASection(industryItemData)}
              </ModalBoxRightColumn>
            </ModalBoxMainContent>
          </IndustryInnerContent>
        </IndustryItemExpandedContainer >
      )
    } catch (e) {
      return null
    }
  }
}

@inject("stores")
@observer
export default class Industry extends Component<IStoreProps> {

  getIndustryList = (position: string) => {
    try {
      const items = (this.props.stores!.langStore.safeGetLocalizedString("industry.industryData") as unknown as Array<IndustryItem>).filter((f: IndustryItem) => f.position === position)!
      if (!items) { return null }
      return items.map((e: IndustryItem, index: number) => {
        const currentImg = e.image
        const hoverImg = e.imageHover
        if (position === "left") {
          return (
            <LeftItemContainer key={e.name.replace(/\s/g, "").toLowerCase()}
              onClick={() => this.props.stores!.appStore.openIndustryItemBox(e.name)}
            >
              <Icon>
                <img src={`/images/industry/${e.image}`}
                  onMouseOver={e => (e.currentTarget.src = `/images/industry/${hoverImg}`)}
                  onMouseOut={e => (e.currentTarget.src = `/images/industry/${currentImg}`)} />
              </Icon>
              <SubText>
                {e.name}
              </SubText>
            </LeftItemContainer>
          )
        } else {
          return (
            <RightItemContainer key={e.name.replace(/\s/g, "").toLowerCase()}
              onClick={() => this.props.stores!.appStore.openIndustryItemBox(e.name)}>
              <Icon>
                <img src={`/images/industry/${e.image}`}
                  onMouseOver={e => (e.currentTarget.src = `/images/industry/${hoverImg}`)}
                  onMouseOut={e => (e.currentTarget.src = `/images/industry/${currentImg}`)} />
              </Icon>
              <SubText>
                {e.name}
              </SubText>
            </RightItemContainer>
          )
        }
      })
    } catch (e) {
      return null
    }
  }

  render() {
    return (
      <IndustryBox>
        <SectionText>
          {this.props.stores!.langStore.safeGetLocalizedString("industry.title")}
        </SectionText>
        <IndustryContainer id="industry">
          <LeftContainer>
            {this.getIndustryList('left')}
          </LeftContainer>
          <ChintaiImgContainer><img src={ChintaiImg} /></ChintaiImgContainer>
          <RightContainer>
            {this.getIndustryList('right')}
          </RightContainer>
        </IndustryContainer >
      </IndustryBox>
    )
  }
}