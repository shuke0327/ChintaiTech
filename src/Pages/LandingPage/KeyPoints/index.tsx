/*****************
 * Kai
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { FlexRow, FlexColumn } from "lib/GlobalStyles"
// import { Link } from "react-router-dom"
// import ArrowImg from "./arrow.svg"
import LeaseImg from "./lease.png"
import LaunchImg from "./launch.png"
import TradeImg from "./trade.png"

const KeyPointContainer = styled(FlexRow)`
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    position: relative;
    box-shadow: initial;
    background: initial;
    margin-top: 5em;
    margin-bottom: 5vw;
    width: 100vw;
    @media (max-width: 1024px) {
      margin-top: 5vw;
      flex-direction: column;
      align-items: center;
    }
  `

// const ArrowBox = styled.div`
//   padding: 2vw 10px;
//   margin: 0px 0vw;
//   img {
//     width: 4vw;
//     height: 1vw;
//   }
//   @media (max-width: 660px) {
//     display: none;
//   }
// `

const KeyPointBox = styled(FlexColumn)`
  max-width: 19vw;
  color: black;
  border-radius: 50px;
  margin: 0 25px;
  padding: 20px 12px;
  min-height: 23em;
  align-items: flex-start;
  background-color: rgb(255,255,255,0.5);
  border: 1px solid rgb(0,0,0,0.1);
  color: black;
  h4 {
    color: #222b2c;
    font-family: PoppinsLight;
    font-size: 24px;
    font-weight: bold;
    line-height: 32px;
    height: 20px;
    text-align: start;
    margin-top: 1em;
    margin-bottom: 1em;
  }

  p {
    /* Style for "First Dece" */
    text-align: start;
    font-family: PoppinsLight;
    font-size: 1em;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0;
    color: #8393a7;
  }
  @media (max-width: 1024px) {
    margin-bottom: 5vw;
    max-width: 50vw;
    align-items: center;
    border: 1px solid rgb(0,0,0,0.1);
    min-height: 15em;
    h4 {
      text-align: center;
      margin: 1.4em;
    }
    p{
      font-size: 16px;
    }
  }
  @media (max-width: 660px) {
    max-width: 80vw;
  }
`

const IconBox = styled.div`
justify-content: start;
`

const ContentBox = styled(FlexColumn)`
  align-content: flex-start;
  @media (max-width: 660px) {
    align-content: center;
  }
`

const ImgContainer = styled.div`
  z-index: 1;
  width: 80px;
  height: 80px;
  justify-content: center;
  background-color: #0d78ca;
  line-height:0;
  border-radius:50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 48px;
    height: 48px;
  }
`

@inject("stores")
@observer

export default class KeyPointComponent extends Component<IStoreProps> {
  render() {
    return (
      <KeyPointContainer>
        <KeyPointBox>
          <IconBox>
            <ImgContainer>
              <img src={LeaseImg} />
            </ImgContainer>
          </IconBox>
          <ContentBox>
            <h4>
              {this.props.stores!.langStore.safeGetLocalizedString("keyPonts.point1")}
            </h4>
            <p>
              {this.props.stores!.langStore.safeGetLocalizedString("keyPonts.detail1")}
            </p>
          </ContentBox>
        </KeyPointBox>
        <KeyPointBox>
          <IconBox>
            <ImgContainer>
              <img src={TradeImg} />
            </ImgContainer>
          </IconBox>
          <ContentBox>
            <h4>
              {this.props.stores!.langStore.safeGetLocalizedString("keyPonts.point2")}
            </h4>
            <p>
              {this.props.stores!.langStore.safeGetLocalizedString("keyPonts.detail2")}
            </p></ContentBox>
        </KeyPointBox>
        <KeyPointBox>
          <IconBox>
            <ImgContainer>
              <img src={LaunchImg} />
            </ImgContainer>
          </IconBox>
          <ContentBox>
            <h4>
              {this.props.stores!.langStore.safeGetLocalizedString("keyPonts.point3")}
            </h4>
            <p>
              {this.props.stores!.langStore.safeGetLocalizedString("keyPonts.detail3")}
            </p>
          </ContentBox>
        </KeyPointBox>
      </KeyPointContainer >
    )
  }
}