/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { FlexRow, FlexColumn } from "lib/GlobalStyles"
import styled from "styled-components"
import ChintaiLogo from "../../../lib/chintai-logo-lightblue.svg"

const FlowBoxContainer = styled(FlexColumn)`
  position: relative;
  text-align: left;
  flex: 0 1 500px;
  margin-right: 35px;

  p {
    font-size: 1.2em;
    margin: 0;
    z-index: 1;

  }

  h2 {
    font-size: 1.5em;
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
  background-image: url(${ChintaiLogo});
  background-repeat: no-repeat;
  background-size: 475px;
  background-attachment: fixed;
  background-position: 50% 50%;
  overflow: hidden;

  img {
    width: 220px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: .85;
  }

  h2 {
    color: #fff;
  }

  a {
    color: gold;
  }

  /* Mobile views */
  @media( max-width: 1200px) {
    background-image: none;
  }
`

@inject("stores")
@observer
export default class LeasingFAQ extends Component<IStoreProps> {
  render() {
    return (
      <AboutContent>
        <AboutContentRow>
          <FlowBoxContainer>
            <h2>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.q1")}</h2>
            <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer1")}</p>
          </FlowBoxContainer>

          <FlowBoxContainer>
            <h2>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.q5")}</h2>
            <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer5")}</p>
          </FlowBoxContainer>
        </AboutContentRow>
        <AboutContentRow>
          <FlowBoxContainer>
            <h2>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.q3")}</h2>
            <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer31")} <a href={`/auction`} target="_blank">{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer32")}</a></p>
          </FlowBoxContainer>
          <FlowBoxContainer>
            <h2>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.q7")}</h2>
            <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer7")}</p>
          </FlowBoxContainer>
        </AboutContentRow>
        <AboutContentRow>
          <FlowBoxContainer>
            <h2>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.q2")}</h2>
            <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer2")}</p>
          </FlowBoxContainer>
          <FlowBoxContainer>
            <h2>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.q6")}</h2>
            <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer6")}</p>
          </FlowBoxContainer>
        </AboutContentRow>
        <AboutContentRow>
          <FlowBoxContainer>
            <h2>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.q4")}</h2>
            <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer41")} <a href={this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer43")} target="_blank">{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer42")}</a></p>
          </FlowBoxContainer>
          <FlowBoxContainer>
            <h2>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.q8")}</h2>
            <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer81")}<a href={this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer83")} target="_blank">{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer82")}</a>{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer84")}<a href={`mailto:${this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer85")}`} target="_blank">{this.props.stores!.langStore.safeGetLocalizedString("leasingFAQ.answer85")}</a></p>
          </FlowBoxContainer>
        </AboutContentRow>
      </AboutContent>
    )
  }
}
