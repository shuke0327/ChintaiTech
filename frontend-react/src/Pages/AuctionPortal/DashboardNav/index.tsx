/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { IslandContainer, IslandContent, FlexRow, ColorRed } from "lib/GlobalStyles"
import { LoginButton } from "SharedComponents/Header"
import { 
  FaCoins, 
  FaExchangeAlt, 
  FaProjectDiagram, 
  FaIdCard, 
  FaExclamationCircle, 
  FaChartLine, 
  FaHandshake, 
  } from "react-icons/fa"
import { Link } from "react-router-dom"
import { EKycApproved } from "stores/AppStore"

const DashboardHeaderContainer = styled(IslandContainer)`
  grid-area: navBar / navBar / navBar / navBar;
  padding: 0px 15px;

  h1 {
    margin: 0;
    line-height: 1;
  }

  svg {
    margin-right: 10px;
    font-size: 1.5em;
  }
`

const SpacedRow = styled(FlexRow)`
  justify-content: space-between;
  align-items: center;
`

const NavRow = styled(FlexRow)`
  justify-content: space-around;
  flex: 1 1 auto;

  h3 {
    color: #324b56;
  }

  a {
    text-decoration: none;
  }
`

const NavButton = styled(FlexRow)`
  align-items: center;
  color: #0d78ca;
  position: relative;
  cursor: pointer;
  transition: 0.1s;
  padding: 15px 0px;

  &:hover {
    color: ${(props: { isActive: boolean }) => props.isActive ? null : "#70addc"};
  }

  h3 {
    margin: 0;
    font-weight: normal;
    line-height: 1;
    font-size: 1.1em;
  }

  @media (max-width: 1175px) {
    flex-direction: column;
    svg {
      margin-bottom: 10px;
    }
  }
`

const ActiveIndicator = styled.div`
  display: ${(props: { isActive: boolean }) => props.isActive ? "initial" : "none"};
  width: 100%;
  position: absolute;
  bottom: -3px;
  border-bottom: 3px solid #0d78ca;

  @media (max-width: 1175px) {
    bottom: 0;
  }
`

const LoginButtonRow = styled(FlexRow)`
  /* flex: 0 1 230px; */
  justify-content: center;
  padding: 10px 0px;
`

const KycErrorIndicator = styled.div`
  position: absolute;
  top: 10px;
  left: -12px;
  font-size: 0.8em;
  display: ${(props: { kycIncomplete: boolean }) => props.kycIncomplete ? "initial" : "none"};

  svg {
    color: ${ColorRed};
  }

  @media (max-width: 1175px) {
    left: 12px;
  }
`

@inject("stores")
@observer
export default class NavBar extends Component<IStoreProps & { activeView: string }> {

  render() {
    if (this.props.stores!.appStore.isMobile) {
      return (
        <DashboardHeaderContainer>
          <IslandContent>
            <LoginButtonRow>
              <LoginButton />
            </LoginButtonRow>
          </IslandContent>
        </DashboardHeaderContainer >
      )
    } else {
      return (
        <DashboardHeaderContainer>
          <IslandContent>
            <SpacedRow>
              <NavRow>
                <Link to={"/auction"}>
                  <NavButton isActive={this.props.activeView === "dashboard"}>
                    <FaChartLine />
                    <h3>{this.props.stores!.langStore.safeGetLocalizedString("auctionNav.dashboard")}</h3>
                    <ActiveIndicator isActive={this.props.activeView === "dashboard"} />
                  </NavButton>
                </Link>

                <Link to={"/auction/bid"}>
                  <NavButton isActive={this.props.activeView === "bid"}>
                    <FaCoins />
                    <h3>{this.props.stores!.langStore.safeGetLocalizedString("auctionNav.getChex")}</h3>
                    <ActiveIndicator isActive={this.props.activeView === "bid"} />
                  </NavButton>
                </Link>

                <Link to={"/auction/kyc"}>
                  <NavButton isActive={this.props.activeView === "kyc"}>
                    <FaIdCard />
                    <h3>{this.props.stores!.langStore.safeGetLocalizedString("auctionNav.kycStatus")}</h3>
                    <ActiveIndicator isActive={this.props.activeView === "kyc"} />
                    <KycErrorIndicator kycIncomplete={this.props.stores!.appStore.kycApproved === EKycApproved.NotYetCompleted && this.props.stores!.walletStore.userLoggedIn}><FaExclamationCircle /></KycErrorIndicator>
                  </NavButton>
                </Link>

                <Link to={"/auction/contributions"}>
                  <NavButton isActive={this.props.activeView === "contributions"}>
                    <FaExchangeAlt />
                    <h3>{this.props.stores!.langStore.safeGetLocalizedString("auctionNav.myContributions")}</h3>
                    <ActiveIndicator isActive={this.props.activeView === "contributions"} />
                  </NavButton>
                </Link>

                <Link to={"/auction/rounds"}>
                  <NavButton isActive={this.props.activeView === "rounds"}>
                    <FaProjectDiagram />
                    <h3>{this.props.stores!.langStore.safeGetLocalizedString("auctionNav.auctionSummary")}</h3>
                    <ActiveIndicator isActive={this.props.activeView === "rounds"} />
                  </NavButton>
                </Link>

                <Link to={"/auction/referral"}>
                  <NavButton isActive={this.props.activeView === "referral"}>
                    <FaHandshake />
                    <h3>{this.props.stores!.langStore.safeGetLocalizedString("auctionNav.referralLink")}</h3>
                    <ActiveIndicator isActive={this.props.activeView === "referral"} />
                  </NavButton>
                </Link>

              </NavRow>

              <LoginButtonRow>
                <LoginButton />
              </LoginButtonRow>
            </SpacedRow>
          </IslandContent>
        </DashboardHeaderContainer >
      )
    }
  }
}
