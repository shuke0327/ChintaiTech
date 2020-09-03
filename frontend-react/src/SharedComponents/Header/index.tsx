/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { FlexRow, FlexColumn, Button, Filler } from "lib/GlobalStyles"
import { ColorWhite } from "lib/colors"
import styled, { createGlobalStyle } from "styled-components"
import scatterLogo from "lib/scatter.png"
import chintaiPowered from  "lib/powered-chintai.svg"
import logo from "./logo.svg"
import tokenPocket from "lib/tockenPocker.jpg"
import meetOne from "lib/meetOne.png"
import lynx from "lib/lynxLogo.png"
import trezor from "lib/trezor.jpg"
import ledger from "lib/ledger.png"
import { EWalletState, EWalletType } from "stores/WalletStore"
import { PulseLoader } from "react-spinners"
import { FaBars, FaTimes, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { LangSelector } from "./LangSelector"
import ReactGA from "react-ga"
import MyntLogo from "lib/mynt-logo.svg"
import colorScatterLogo from "lib/scatter.png"

interface INavItem {
  text: string
  url: string
  type: string
}

const HeaderContainer = styled(FlexRow)`
  z-index: 4;
  position: fixed;
  height: ${(props: { auction: boolean }) => props.auction ? "95px" : "75px"};;
  background-color: ${ColorWhite};
  width: 100%;
  filter: drop-shadow(0px 2px 2px #00000020);
`

const HeaderButton = styled(Button)`
  white-space: nowrap;
  display: flex;
  align-items: center;
  min-width: 148px;
  justify-content: space-between;

  span {
    width: 100%;
  }
`

const ScatterButton = styled(HeaderButton)`
  /* border: 3px solid #0D78CA; */
  border-radius: 10px;
  font-size: 14px;
  width: 180px;

`

const ImageContainer = styled(FlexColumn)`
  margin-left: 15px;
  justify-content: center;
  flex: 0 0 205px;

  a {
    display: flex;
  }

  @media (max-width: 352px) {
    flex: 0 0 45vw;
  }
`

const HeaderButtonContainer = styled(FlexRow)`
  align-items: center;
  white-space: nowrap;
  position: relative;

  img {
    width: 25px;
    margin-left: 5px;
    margin-right: 5px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`

const ScatterButtonContainer = styled(HeaderButtonContainer)`
flex-direction:column;
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
  font-size: 2.5em;
  user-select: none;
  justify-content: center;
  margin-right: 15px;

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
  background-color: #f7f9ff;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  box-shadow: 3px 4px 8px rgba(14,44,62,0.05);
  /* top: 70px; */
  transition: 0.3s;


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
  width: 100vw;
  padding: 15px 0px;
  line-height: 1;
  font-size: 1.6em;

  &:active {
    font-weight: bold;
  }
`

const GlobalStyle = createGlobalStyle`
  html {
    overflow: ${(props: { pageDimmerVisible: boolean }) => props.pageDimmerVisible ? "hidden" : null};
  }
`

// const LaunchButtonDiv = styled.div`
//   padding-right: 15px;
//   display: flex;
//   align-items: center;
//   white-space: nowrap;
// `

const MobileMenuOuter = styled.div`
  max-height: calc(100vh - 70px);
  position: fixed;
  z-index: 3;
  overflow: ${(props: { mobileMenuOpen: boolean, shouldScroll: boolean }) => props.shouldScroll ? "scroll" : null};
  -webkit-overflow-scrolling: touch;
  top: 90px;
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
`

const LoginProviderBox = styled.div`
  background: #2A2B3C;
  height: 50px;
  width: 220px;
  border-radius: 120px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
`;

const LoginProviderImage = styled.img`
  height: 40px;
  width: 40px !important;
  object-fit: cover;
  margin: 0px !important;
  margin-left: 5px !important;
  border-radius: 20px;
`;

const LoginProviderText = styled.p`
  margin: 0px;
  color: #fff;
  font-size: 18px;
  margin-left: 7px !important;
`;

const Popover = styled.div<State>`
  background: white;
  height: auto;
  width: 240px;
  position: absolute;
  z-index: 9;
  border-radius: 12px;
  top: 0;
  margin-top: 37px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 15px;
  flex-wrap: wrap;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.3);
  transition: 0.5s opacity ease;
  opacity: ${p => p.isOpen ? 1 : 0};
  margin-left: -130px;
  @media (max-width: 830px) {
    margin-left: -70px;
  }
`

interface State {
  isOpen?: boolean
}

@inject("stores")
@observer
export class LoginButton extends Component<IStoreProps & State> {

  state = {
    isOpen: false,
  }

  handleScatterLogin = () => {
    this.props.stores!.walletStore.setWalletState(EWalletState.loggingInProcessing);
    this.setState({ isOpen: !this.state.isOpen })
  }

  handleTokenPocketLogin = () => {
    this.props.stores!.walletStore.setCurrentSelectedWalletApp(EWalletType.tokenPocket)
    this.props.stores!.walletStore.setWalletState(EWalletState.loggingInProcessing);
    this.setState({ isOpen: !this.state.isOpen })
  }

  handleMeetOneLogin = () => {
    this.props.stores!.walletStore.setCurrentSelectedWalletApp(EWalletType.meetOne)
    this.props.stores!.walletStore.setWalletState(EWalletState.loggingInProcessing);
    this.setState({ isOpen: !this.state.isOpen })
  }

  handleLynxLogin = () => {
    this.props.stores!.walletStore.setCurrentSelectedWalletApp(EWalletType.lynx)
    this.props.stores!.walletStore.setWalletState(EWalletState.loggingInProcessing);
    this.setState({ isOpen: !this.state.isOpen })
  }


  render() {
    return (
      <HeaderButtonContainer>
        <HeaderButton
          onMouseOver={() => this.props.stores!.appStore.setLoginButtonMousedOver(true)}
          onMouseLeave={() => this.props.stores!.appStore.setLoginButtonMousedOver(false)}
          onClick={() => {
            if (this.props.stores!.walletStore.userLoggedIn) {
              this.props.stores!.walletStore.setWalletState(EWalletState.loggingOut)
            } else {
              this.setState({ isOpen: !this.state.isOpen });
            }
          }}
        >
          <span>
            {this.props.stores!.walletStore.userLoggingIn ?
              <PulseLoader /> :
              this.props.stores!.walletStore.userLoggedIn ?
                this.props.stores!.appStore.loginButtonMousedOver ?
                  this.props.stores!.langStore.safeGetLocalizedString("header.logout") :
                  this.props.stores!.walletStore.accountName :
                this.props.stores!.langStore.safeGetLocalizedString("header.login")}
          </span>
          {!this.props.stores!.walletStore.userLoggedIn ? null : <FaUser />}
        </HeaderButton>
        <Popover isOpen={this.state.isOpen}>
          <LoginProviderBox onClick={this.handleScatterLogin}>
            <LoginProviderImage src={scatterLogo} />
            <LoginProviderText>Scatter</LoginProviderText>
          </LoginProviderBox>
          <LoginProviderBox onClick={this.handleScatterLogin}>
            <LoginProviderImage src={ledger} />
            <LoginProviderText>Ledger</LoginProviderText>
          </LoginProviderBox>
          <LoginProviderBox onClick={this.handleMeetOneLogin}>
            <LoginProviderImage src={meetOne} />
            <LoginProviderText>Meet one</LoginProviderText>
          </LoginProviderBox>
          <LoginProviderBox onClick={this.handleLynxLogin}>
            <LoginProviderImage src={lynx} />
            <LoginProviderText>Lynx</LoginProviderText>
          </LoginProviderBox>
          <LoginProviderBox onClick={this.handleTokenPocketLogin}>
            <LoginProviderImage src={tokenPocket} />
            <LoginProviderText>Token Pocket</LoginProviderText>
          </LoginProviderBox>
          <LoginProviderBox onClick={this.handleScatterLogin}>
            <LoginProviderImage src={trezor} />
            <LoginProviderText>Trezor</LoginProviderText>
          </LoginProviderBox>
        </Popover>
      </HeaderButtonContainer>
    )
  }
}


@inject("stores")
@observer
export class NewLoginButton extends Component<IStoreProps> {
  render() {
    return (
      <ScatterButtonContainer>
        <ScatterButton
          // background={this.props.background}
          // color={this.props.color}
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
          {this.props.stores!.walletStore.userLoggedIn ? <img src={colorScatterLogo} /> : null}
          <span>
            {this.props.stores!.walletStore.userLoggingIn ?
              <PulseLoader color={"#fff"} /> :
              this.props.stores!.walletStore.userLoggedIn ?
                this.props.stores!.appStore.loginButtonMousedOver ?
                  this.props.stores!.langStore.safeGetLocalizedString("header.logout") :
                  this.props.stores!.walletStore.accountName :
                this.props.stores!.langStore.safeGetLocalizedString("header.scatterLogin")}
          </span>
        </ScatterButton>
      </ScatterButtonContainer>
    )
  }
}

@inject("stores")
@observer
class NavItems extends Component<IStoreProps> {
  getNavItem = (e: INavItem, isMobile: boolean) => {
    let WrapperComponent = MobileMenuItem
    if (!isMobile) { WrapperComponent = NavItem }

    // Don't display the Get CHEX link on the desktop landing page because we have the big green button for it in the header instead
    if (e.url === "/auction" && !isMobile) { return null }

    // If it's the whitepaper link, add the current selectedy to it
    if (e.url === "/whitepaper") {
      // No german translation for the whitepaper is available
      e.url = `/whitepaper?lang=en`
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
          <HeaderContainer auction={this.props.stores!.routerStore.location.pathname.includes("/auction")}>
            <ImageContainer>
              <a href={"/"}>
                {this.props.stores!.routerStore.location.pathname.includes("/auction") ? <img src={MyntLogo} width={"100%"} /> : <img src={logo} width={"100%"} />}
              </a>
            </ImageContainer>
            {/* <ImageContainer>
              <a href={"/"}>
                <img src={chintaiPowered} width={"40%"} />
              </a>
            </ImageContainer> */}
            <Filler />
            <LangSelector />
            <NavBar />
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
        <HeaderContainer auction={this.props.stores!.routerStore.location.pathname.includes("/auction")}>
          <ImageContainer>
            <a href={"/"}>
              {this.props.stores!.routerStore.location.pathname.includes("/auction") ? <img src={MyntLogo} width={"100%"} /> : <img src={logo} width={"100%"} />}
            </a>
          </ImageContainer>
          <ImageContainer style={{margin: "0px"}}>
            <a href={"/"} style={{margin: "auto 0 10px 0"}}>
              {this.props.stores!.routerStore.location.pathname.includes("/auction") ? <img src={chintaiPowered} width={"40%"} /> : null}
            </a>
          </ImageContainer>
          <Filler />
          <NavContainer>
            <NavBar />
            <LangSelector />
            {/* <LaunchButtonDiv>
              <Link to={`/auction`}>
                <GreenButton>{this.props.stores!.langStore.safeGetLocalizedString("auctionNav.getChex")}</GreenButton>
              </Link>
            </LaunchButtonDiv> */}
          </NavContainer>
        </HeaderContainer>
      )
    }
  }
}
