/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { FlexRow, FlexColumn } from "lib/GlobalStyles"
import styled from "styled-components"
import ChintaiIcon from "./icon-blue-transparent-bg.png"

const FlowBoxContainer = styled(FlexColumn)`
  position: relative;
  text-align: center;
  flex: 0 1 475px;
  margin-right: 35px;

  p {
    margin: 0;
    z-index: 1;
  }

  h2 {
    text-align: center;
  }

  &:last-of-type {
    margin-right: 0;
  }

  @media (max-width: 900px) {
    margin-right: 0;
  }
`



const AboutContentRow = styled(FlexRow)`
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 0px 15px;
`

const AboutContent = styled.div`
  position: relative;

  img {
    width: 200px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.15;
  }

  h2 {
    color: #01777d;
  }

  a {
    color: blue;
  }
`

@inject("stores")
@observer
export default class About extends Component<IStoreProps> {
  render() {
    return (
      <AboutContent>
        <AboutContentRow>
          <FlowBoxContainer>
            <h2>{this.props.stores!.langStore.safeGetLocalizedString("about.chintaiVision.title")}</h2>
            <p>{this.props.stores!.langStore.safeGetLocalizedString("about.chintaiVision.content")}</p>
          </FlowBoxContainer>
          <FlowBoxContainer>
            <h2>{this.props.stores!.langStore.safeGetLocalizedString("about.provenUseCase.title")}</h2>
            <p>{this.props.stores!.langStore.safeGetLocalizedString("about.provenUseCase.content")}</p>
          </FlowBoxContainer>
        </AboutContentRow>
        <img src={ChintaiIcon} />
        <AboutContentRow>
          <FlowBoxContainer>
            <h2>{this.props.stores!.langStore.safeGetLocalizedString("about.chexToken.title")}</h2>
            <p>{this.props.stores!.langStore.safeGetLocalizedString("about.chexToken.content1")} <a href={`/whitepaper?lang=${this.props.stores!.langStore.currentSelectedLang}`} target="_blank">{this.props.stores!.langStore.safeGetLocalizedString("about.chexToken.content2")}</a> {this.props.stores!.langStore.safeGetLocalizedString("about.chexToken.content3")}</p>
          </FlowBoxContainer>
          <FlowBoxContainer>
            <h2>{this.props.stores!.langStore.safeGetLocalizedString("about.leaseEverything.title")}</h2>
            <p>{this.props.stores!.langStore.safeGetLocalizedString("about.leaseEverything.content")}</p>
          </FlowBoxContainer>
        </AboutContentRow>
      </AboutContent>
    )
  }
}
