/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { FlexRow, FlexColumn, Button, Filler } from "lib/GlobalStyles"
import styled, { createGlobalStyle } from "styled-components"
import logo from "./logo.svg"
import scatterLogo from "lib/scatter.png"
import { EWalletState } from "stores/WalletStore"
import { PulseLoader } from "react-spinners"
import { FaBars, FaTimes, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import ReactGA from "react-ga"
import { LangSelector } from "./LangSelector"


interface INavItem {
  text: string
  url: string
  type: string
}

const HeaderContainer = styled(FlexRow)`
  max-height: 50px;
  z-index: 11;
  width: 100%;
  margin: 2rem 0;
  background-color:transparent;
  color: white;
  filter: drop-shadow(0px 2px 2px #00000020);
	font-family: PoppinsLight;
	font-size: 12px;
	font-weight: bold;
	font-stretch: normal;
	line-height: 1em;
	letter-spacing: 0vw;
  color: #ffffff;
  @media(max-width:660px) {
    margin: 10vw 0;
  }
`

const HeaderButton = styled(Button)`
  background: ${(props: MyProps) => props.background};
  color: ${(props: MyProps) => props.color};
  white-space: nowrap;
  display: flex;
  align-items: center;
  min-width: 188px;
  justify-content: space-between;

  span {
    width: 100%;
  }
`

const ImageContainer = styled(FlexColumn)`
  justify-content: center;
  flex: 0 0 205px;
  margin-left: 12vw;

  a {
    display: flex;
  }

  @media (max-width: 352px) {
    flex: 0 0 45vw;
  }
  @media (max-width: 660px) {
    margin-left: 50px;
  }
`

const HeaderButtonContainer = styled(FlexRow)`
  align-items: center;
  white-space: nowrap;
  img {
    width: 25px;
    margin-left: 10px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
  @media(max-width:1112px) {
    white-space: pre-wrap;
  }
`

const NavItem = styled.div`
  position: relative;
  cursor: pointer;
  padding: 0 15px;
  transition: 0.1s;
  will-change: color;

  &:hover {
    color: #687d86;
  }
`

export const HamburgerButtonContainer = styled(FlexColumn)`
  font-size: 2em;
  user-select: none;
  justify-content: center;
  margin-right: 1vw;
  color: black;
  &:hover {
    cursor: pointer;
  }

  &:active {
    transform: scale(0.95);
  }
`

const MobileMenuInner = styled(FlexColumn)`
  display: table;
  z-index: 3;
	font-family: PoppinsLight;
  background-color: #f7f9ff;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  box-shadow: 3px 4px 8px rgba(14,44,62,0.05);
  /* top: 70px; */
  transition: 0.3s;
  margin: 20px 10px;


  a {
    color: inherit;
    text-decoration: none;
  }
`

const MobileMenuItem = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  flex-direction: row-reverse;
  align-items: center;
  width: 70vw;
  padding: 15px 0px;
  line-height: 1;
  font-size: 1em;


  &:active {
    font-weight: bold;
  }
`

const GlobalStyle = createGlobalStyle`
  html {
    overflow: ${(props: { pageDimmerVisible: boolean }) => props.pageDimmerVisible ? "hidden" : null};
  }
`

const MobileMenuOuter = styled.div`
  max-height: calc(100vh - 70px);
  position: fixed;
  right: 0px;
  z-index: 12;
  overflow: ${(props: { mobileMenuOpen: boolean, shouldScroll: boolean }) => props.shouldScroll ? "scroll" : null};
  -webkit-overflow-scrolling: touch;
  top: 70px;
  transform: ${(props: { mobileMenuOpen: boolean }) => props.mobileMenuOpen ? "translateY(0)" : "translateY(-500px)"};
  visibility: ${(props: { mobileMenuOpen: boolean }) => props.mobileMenuOpen ? "visible" : "hidden"};
  transition: 0.3s;
`

const DashboardNavItemsContainer = styled.div`
  border-bottom: 2px solid #324b5680;
`

const ActiveIndicator = styled.div`
  display: ${(props: { isActive: boolean }) => props.isActive ? "initial" : "none"};
  width: 15px;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #0d78ca;
`

const NavContainer = styled(FlexRow)`
  justify-content: space-evenly;
  align-items: center;
  @media(max-width:1112px) {
    font-size: 9px;
  }
  @media(min-width:660px) and (max-width: 1112px) {
    color: black;
  }
`

interface MyProps {
  color: string
  background: string
}

@inject("stores")
@observer
export class LoginButton extends Component<IStoreProps & MyProps> {
  render() {
    return (
      <HeaderButtonContainer>
        <HeaderButton
          background={this.props.background}
          color={this.props.color}
          onMouseOver={() => this.props.stores!.appStore.setLoginButtonMousedOver(true)}
          onMouseLeave={() => this.props.stores!.appStore.setLoginButtonMousedOver(false)}
          onClick={() => {
            if (this.props.stores!.walletStore.userLoggedIn) {
              this.props.stores!.walletStore.setWalletState(EWalletState.loggingOut)
            } else {
              this.props.stores!.walletStore.setWalletState(EWalletState.loggingInProcessing)
            }
          }}
        >
          <span>
            {this.props.stores!.walletStore.userLoggingIn ?
              <PulseLoader color={"#fff"} /> :
              this.props.stores!.walletStore.userLoggedIn ?
                this.props.stores!.appStore.loginButtonMousedOver ?
                  this.props.stores!.langStore.safeGetLocalizedString("header.logout") :
                  this.props.stores!.walletStore.accountName :
                this.props.stores!.langStore.safeGetLocalizedString("header.login")}
          </span>
          {!this.props.stores!.walletStore.userLoggedIn ? <img src={scatterLogo} /> : <FaUser />}
        </HeaderButton>
      </HeaderButtonContainer>
    )
  }
}

@inject("stores")
@observer
class NavItems extends Component<IStoreProps> {
  getNavItem = (e: INavItem, isMobile: boolean) => {
    let WrapperComponent = MobileMenuItem
    if (!isMobile) { WrapperComponent = NavItem }

    // Don't display the Get CHEX
    if (e.url === "/auction") { return null }

    // If it's the whitepaper link, add the current selectedy to it
    if (e.url === "/whitepaper") {
      // No german translation for the whitepaper is available
      e.url = `/whitepaper?lang=${this.props.stores!.langStore.currentSelectedLang === "de" ? "en" : this.props.stores!.langStore.currentSelectedLang}`
    }

    if (e.type === "external") {
      return (
        <ReactGA.OutboundLink
          eventLabel={`headerLink: ${e.text}`}
          to={e.url}
          target={"_blank"}
          key={e.text.replace(/\s/g, "").toLowerCase()}
        >
          <WrapperComponent onClick={() => { if (this.props.stores!.appStore.isMobile) { this.props.stores!.appStore.toggleMobileMenu() }; if (this.props.stores!.routerStore.location.pathname !== "/") { this.props.stores!.routerStore.push("/") }; }}>
            {e.text}
          </WrapperComponent>
        </ReactGA.OutboundLink>
      )
    } else {
      return (
        <Link to={e.url} key={e.text.replace(/\s/g, "").toLowerCase()}>
          <WrapperComponent onClick={() => { if (this.props.stores!.appStore.isMobile) { this.props.stores!.appStore.toggleMobileMenu() }; if (this.props.stores!.routerStore.location.pathname !== "/") { this.props.stores!.routerStore.push("/") }; }}>
            {e.text}
          </WrapperComponent>
        </Link>
      )
    }
  }

  getAuctionPortalNavItem = (e: INavItem) => {
    return (
      <Link to={e.url} key={e.text.replace(/\s/g, "").toLowerCase()}>
        <MobileMenuItem onClick={() => this.props.stores!.appStore.toggleMobileMenu()}>
          {e.text}
          <ActiveIndicator isActive={this.props.stores!.routerStore.location.pathname === e.url} />
        </MobileMenuItem>
      </Link>
    )
  }

  render() {
    try {
      if (this.props.stores!.routerStore.location.pathname.includes("/auction") && this.props.stores!.appStore.isMobile) {
        return (
          <React.Fragment>
            <DashboardNavItemsContainer>
              {(this.props.stores!.langStore.safeGetLocalizedString("header.auctionPortalNavItems") as unknown as Array<INavItem>).map((e: INavItem) => this.getAuctionPortalNavItem(e))}
            </DashboardNavItemsContainer>

            {(this.props.stores!.langStore.safeGetLocalizedString("header.landingPageNavItems") as unknown as Array<INavItem>).map((e: INavItem) => this.getNavItem(e, this.props.stores!.appStore.isMobile))}
          </React.Fragment>
        )
      } else {
        return (
          (this.props.stores!.langStore.safeGetLocalizedString("header.landingPageNavItems") as unknown as Array<INavItem>).map((e: INavItem) => this.getNavItem(e, this.props.stores!.appStore.isMobile))
        )
      }
    } catch (e) {
      return null
    }
  }
}

@inject("stores")
@observer
class NavBar extends Component<IStoreProps> {
  render() {
    try {
      if (this.props.stores!.appStore.isMobile) { // Activate hamburger menu
        return (
          <HamburgerButtonContainer onClick={() => this.props.stores!.appStore.toggleMobileMenu()}>
            {this.props.stores!.appStore.mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </HamburgerButtonContainer>
        )
      } else {
        return (
          <HeaderButtonContainer>
            <NavItems />
          </HeaderButtonContainer >
        )
      }
    } catch (e) {
      // console.log(e)
      return null
    }

  }
}

@inject("stores")
@observer
export default class Header extends Component<IStoreProps> {
  render() {
    if (this.props.stores!.appStore.isMobile) {
      return (
        <React.Fragment>
          <HeaderContainer>
            <ImageContainer>
              <a href={"/"}>
                <img src={logo} width={"100%"} />
              </a>
            </ImageContainer>
            <Filler />
            <NavBar />
            <LangSelector />
          </HeaderContainer>
          <MobileMenuOuter mobileMenuOpen={this.props.stores!.appStore.mobileMenuOpen} shouldScroll={this.props.stores!.appStore.windowHeight < 575}>
            <MobileMenuInner>
              <NavItems />
            </MobileMenuInner>
          </MobileMenuOuter>
          <GlobalStyle pageDimmerVisible={this.props.stores!.appStore.pageDimmerVisible} />
        </React.Fragment>
      )
    } else {
      return (
        <HeaderContainer>
          <ImageContainer>
            <a href={"/"}>
              <img src={logo} width={"100%"} />
            </a>
          </ImageContainer>
          <Filler />
          <NavContainer>
            <NavBar />
          </NavContainer>
          <LangSelector />
        </HeaderContainer>
      )
    }
  }
}
