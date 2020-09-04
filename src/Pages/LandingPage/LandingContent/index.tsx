/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { FlexColumn, TitleText, BlueButton, FlexRow } from "lib/GlobalStyles"
// import { Link } from "react-router-dom"

const LandingContentContainer = styled(FlexColumn)`
  align-items: flex-start;
  grid-area: landingContent;
  box-shadow: initial;
  background: initial;
  margin-right: 1vw;
  padding-left: 0vw;
  h4 {
    margin: 10px 0;
    text-align: left;
    width: 30vw;
    font-family: PoppinsLight;
    font-size: 1em;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0vw;
    color: #8392a5;
  }
  @media(max-width:1112px) {
    align-items: center;
    height: auto;
    padding-right:0;
    width: 100vw;
    font-size: 14px;
    padding-bottom: 30px;
  }
`

const LandingButtonsContainer = styled(FlexRow)`
  justify-content: flex-left;
  flex-wrap: wrap;
  border-radius:30px;
  a {
    padding: 12.5px 35px 12.5px 0;
  }
  @media(max-width:1112px) {
    justify-content: center;
    a {
      padding: 0 12.5px;
    }
  }
`

const LandingContentIsland = styled(FlexColumn)`
  margin-bottom: 13px;
  align-items: flex-start;
  text-align: left;
  h1 {
    width: 32vw;
    text-transform: inherit;
    letter-spacing: 0vw;
    white-space:  normal;
    font-family: PoppinsBold;
    font-size: 2em;
    font-weight: bold;
    font-stretch: normal;
    color: #3d3d3d;
    overflow: hidden;
  }
  @media (max-width: 1112px) {
    padding: initial;
    text-align:center;
    align-items:center;
    h1 {
      width: 85vw;
      padding-top: 10px;
      font-size: 3em;
      line-height:1.5em;
    }
    h4 {
      text-align: center;
      width:80vw;
    }
  }
  @media (max-width: 660px) {
    padding: initial;
    text-align:center;
    align-items:center;
    h1 {
      width: 85vw;
      height: 40vw;
      padding-top: 5px;
      font-size: 6vw;
      line-height:1.5em;
    }
    h4 {
      text-align: center;
      width:80vw;
    }
  }
`

@inject("stores")
@observer
export default class LandingContent extends Component<IStoreProps> {
  render() {
    return (
      <LandingContentContainer>
        <LandingContentIsland>
          <TitleText>{this.props.stores!.langStore.safeGetLocalizedString("landingContent.title")}</TitleText>
          <h4> {this.props.stores!.langStore.safeGetLocalizedString("landingContent.subtitle")}</h4>
        </LandingContentIsland>
        <LandingButtonsContainer>
          <a href={"mailto:hello@chintaitech.com"} target="_blank">
            <BlueButton>{this.props.stores!.langStore.safeGetLocalizedString("landingContent.contactUs")}</BlueButton>
          </a>
          {/* <a href={this.props.stores!.langStore.safeGetLocalizedString("landingContent.link2")} target="_blank">
            <BlueBorderButton>{this.props.stores!.langStore.safeGetLocalizedString("landingContent.viewDemo")}</BlueBorderButton>
          </a> */}
        </LandingButtonsContainer>
      </LandingContentContainer >
    )
  }
}
