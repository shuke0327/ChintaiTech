/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { FlexRow, FlexColumn, TitleText, ColorDarkGrayText } from "lib/GlobalStyles"
import styled from "styled-components"
import { FaMedium, FaTwitter, FaTelegramPlane, FaRedditAlien, FaLinkedin } from "react-icons/fa"
import { Link } from "react-router-dom"
import ReactGA from "react-ga"
import FooterBackground from "./footer-img.png"
import logo from "./chintai-logo.png"
import "lib/fonts.css"
import arrowImg from "./arrow.svg"

const FooterContainer = styled(FlexColumn)`
  z-index: 4;
  background-image: url(${FooterBackground});
  background-repeat: round;
  position: relative;
  min-height: 350px;
  justify-content: space-around;
  overflow: visible;
  grid-area: footer;
  color: #fff;
  font-family: PoppinsLight;
  @media( max-width: 660px) {
    background: linear-gradient(135deg, #064598,#0d78ca);
 }
`

const ContainerInner = styled(FlexColumn)`
  z-index: 5;
  padding: 140px 100px 0 100px;
  color: #fff;
  @media( max-width: 830px) {
    padding: 0;
 }
`

const FooterRow = styled(FlexRow)`
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 50px;
  a {
    text-decoration: none;
  }

  &:last-of-type {
    margin-top: 10px;
  }

  @media (max-width: 615px) {
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
  }
`

const SectionContainer = styled(FlexColumn)`
  align-items: flex-start;
  flex: 0 1 35%;

  @media (max-width: 915px) {
    margin-top: 15px;
    margin-bottom: 35px;
    flex: 0 1 100%;
    align-items:center;
  }
`

const SectionHeader = styled(TitleText)`
  font-size: 1.2em;
  margin: 0;
  margin-bottom: 15px;
  cursor: pointer;
  color: #fff;
	font-family: PoppinsLight;
	font-weight: bold;
	font-stretch: normal;
	line-height: 30px;
	letter-spacing: 0px;
  img {
    width: 20%;
  }
`

const ImgHeader = styled(FlexColumn)`
  font-size: 1.4em;
  margin: 0;
  margin-bottom: 10px;
  cursor: pointer;
  color: #fff;
  align-items:left;

  img {
    display: block;
    margin-bottom:10px;
    width:80%;
  }
  @media(max-width: 660px) {
    align-items:center;
    margin: 20px;
    img {
      width: 80%;
      padding-left:10%;
    }
  }
`

const SectionContent = styled.div`
  font-family: PoppinsLight;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 35px;
  letter-spacing: 0px;
  color: #ffffff;
`


const SocialIconsContainer = styled(FlexRow)`
  font-size: 2em;
  width: 260px;
  justify-content: space-around;
`


const SocialIcon = styled(FlexColumn)`
  align-items:center;
  justify-content:center;
  color: #0d78ca;
  font-family: "Font Awesome";
  font-size: 20px;
  height: 40px;
  width: 40px;
  font-weight: 400;
  background: #fff;
  border-radius:50%;
`

const SocialLink = styled(ReactGA.OutboundLink)`
  display: flex;
  color: black;
  a {
    color: black;
    text-decoration: none;
  }
`

const Email = styled.div`
  font-size: 1.3em;

  a {
    color: #fff;
    text-decoration: none;
  }
`

// const SubscribeButton = styled(Button)`
//   padding: 5px 10px;
//   background: linear-gradient(135deg, #064598,#0d78ca);
// `

// const SubscribeButtonContainer = styled.div`
//   margin-left: 10px;

//   @media (max-width: 915px) {
//     margin-left: 0;
//     margin-top: 10px;
//   }
// `

const SubscribeOuter = styled(FlexRow)`
  align-items: center;
  position: relative;

  input {
    outline: none;
    border-radius: 30px;
    padding: 5px 7px 3px;
    font-size: 1em;
    color: ${ColorDarkGrayText}
    background-color: #eceff3;
    border: solid 1px #cad3df;
    width: 220px;
    height: 30px;
    padding-left:20px;
    &::afer {
      display: inline-block;
      border-top: 2px solid;
      border-right: 2px solid;
      width: 100px;
      height: 100px;
      border-color: #EA6000;
      transform: rotate(-135deg);
      margin: 50px auto auto 100px;
    }
  }

  span{
    position: absolute;
    right:2px;
    cursor: pointer;
    background-color: #0d78ca;
    width: 2vw;
    height: 2vw;
    border-radius:50%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    img {
      width: 1vw;
      height: 1.5vw;
    }
  }

  @media (max-width: 660px) {
    span {
      width: 8vw;
      height: 8vw;
      img {
        width: 3vw;
        height: 4vw;
      }
    }
  }
`

const CopyrightText = styled(FooterRow)`
  justify-content: flex-start;
`

const CopyrightRowItem = styled.div`
  margin-left: 30px;
  a {
    color: #fff;
  }

  &:first-of-type {
    margin-left: initial;
  }

  @media (max-width: 615px) {
      margin-left: initial;
  }
`

@inject("stores")
@observer
export default class Footer extends Component<IStoreProps> {
  render() {
    return (
      <FooterContainer>
        <ContainerInner>
          <FooterRow>
            <SectionContainer>
              <ImgHeader>
                <a href={"/"}>
                  <img src={logo} alt="Chintai Logo" />
                </a>
              </ImgHeader>
            </SectionContainer>
          </FooterRow>
          <CopyrightText>
            <CopyrightRowItem>
              {this.props.stores!.langStore.safeGetLocalizedString("footer.copyright")}
            </CopyrightRowItem>
          </CopyrightText>
        </ContainerInner>
      </FooterContainer>
    )
  }
}
