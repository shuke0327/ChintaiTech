/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import Background from "./background.png"
import Chintai from "./chintai.svg"
import Defi from "./defi.svg"

const FlowBoxContainer = styled.div`
  position: relative;
  p {
    font-family: PoppinsLight;
    font-size: 1em;
    font-weight: normal;
    font-stretch: normal;
    line-height: 30px;
    letter-spacing: 0px;
    color: #ffffff;
  }

  h1 {
    font-family: PoppinsBold;
    font-size: 2.4em;
    font-weight: normal;
    font-stretch: normal;
    line-height: 2em;
    letter-spacing: 0px;
    color: #ffffff;
  }
  img {
    height: 300px;
    width: 300px;
  }
  @media(max-width: 660px) {
    img {
      height: 150px;
      width: auto;
      margin: auto;
    }
    h1 {
      font-size: 20px;
      font-weight: 400;
      line-height: 30px;
      margin: auto;
      text-align: center;
      padding-bottom: 20px;
    }
    p {
      font-size: 15px;
      font-weight: 200;
      line-height: 30px;
      padding:10px;
      text-align: center;

    }
    padding: 15px;
  }
`

const FlowBoxLeftContainer = styled(FlowBoxContainer)`
  h1, p {
    text-align:right;
  }
  margin-left: auto;
  @media(max-width:660px) {
    h1, p {text-align: center;}
    margin: auto;
  }
`
const ChintaiContentBox = styled(FlowBoxLeftContainer)`
  grid-area: chintaiContent;

`

const DefiImgBox = styled(FlowBoxLeftContainer)`
  grid-area: defiImg;

`

const FlowBoxRightContainer = styled(FlowBoxContainer)`
  h1, p {
    text-align: left;
  }
  margin-right: auto;
  @media(max-width:660px) {
    h1, p {text-align: center;}
    margin: auto;
  }
`

const ChintaiImgBox = styled(FlowBoxRightContainer)`
  grid-area: chintaiImg;
`

const DefiContentBox = styled(FlowBoxRightContainer)`
  grid-area: defiContent;
`

const AboutContent = styled.div`
  justify-content: center;
  align-content: center;
  display: grid;
  grid-gap: 0 6%;
  align-items: center;
  grid-template-areas: ". chintaiContent chintaiImg ."
                       ". defiImg defiContent .";
  grid-template-columns: 10% 2fr 2fr 10%;
  grid-template-rows: 2fr 2fr;
  position: relative;
  background-image: url(${Background});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-top: 100px;
  padding-bottom: 100px;
  height: auto;
  width: 100%;
  color: white;
  h2 {
    color: #01777d;
  }

  a {
    color: blue;
  }
  @media (max-width: 660px) {
    align-items: center;
    grid-template-areas: "chintaiImg"
                         "chintaiContent"
                         "defiImg"
                         "defiContent";
    grid-template-columns: 2fr;
    grid-template-rows: 2fr;
    h2, p {text-align: center;}
    img {
      width: 150px;
      height: auto;
      margin: auto;
    }
    background-image: url(${Background});
    background-size: cover;
    background-repeat: no-repeat;
    padding-top: 200px;
    padding-bottom: 20vw;
}
`

@inject("stores")
@observer
export default class AboutChintai extends Component<IStoreProps> {
  render() {
    return (
      <AboutContent>
        <ChintaiContentBox>
          <h1>{this.props.stores!.langStore.safeGetLocalizedString("aboutChintai.chintai.title")}</h1>
          <p>{this.props.stores!.langStore.safeGetLocalizedString("aboutChintai.chintai.content.p1")}</p>
          <p>{this.props.stores!.langStore.safeGetLocalizedString("aboutChintai.chintai.content.p2")}</p>
        </ChintaiContentBox>
        <ChintaiImgBox>
          <img src={Chintai} />
        </ChintaiImgBox>
      </AboutContent>
    )
  }
}
