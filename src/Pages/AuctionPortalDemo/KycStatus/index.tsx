/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { IslandContainer, IslandContent, FlexRow, Button } from "lib/GlobalStyles"
import styled from "styled-components"
import { FaCheck, FaFile, FaArrowRight, FaQuestion } from "react-icons/fa"
import { PulseLoader } from "react-spinners"
import { EKycApproved } from "stores/AppStore"
import ReactGA from "react-ga"

const KycStatusContainer = styled(IslandContainer)`
  grid-area: kycStatus / kycStatus / kycStatus / kycStatus;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 450px;

  ${Button} {
    display: flex;
    align-items: center;

    svg {
      font-size: 1.2em;
      margin-left: 5px;
    }
  }

  a {
    text-decoration: none;
  }
`

const IconBorder = styled.div`
  border-radius: 50%;
  border: ${(props: { kycApproved: EKycApproved }) => props.kycApproved === EKycApproved.completed ? "4px solid #00cc81" : "4px solid #324b56"};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin: 30px;
  }
`

const IconRow = styled(FlexRow)`
  justify-content: center;
  font-size: 3em;
  color: ${(props: { kycApproved: EKycApproved }) => props.kycApproved === EKycApproved.completed ? "#00cc81" : "#324b56"};
  margin-bottom: 5px;
`

const KycContent = styled(IslandContent)`
  align-items: center;
  text-align: center;

  span {
    font-size: 1.65em;
    margin-bottom: 10px;
  }

  ${Button} {
    margin-top: 10px;
  }
`

const LoginMsg = styled.div`
  margin-top: 5px;
`

@inject("stores")
@observer
export default class KycStatus extends Component<IStoreProps> {
  getKycIcon = () => this.props.stores!.appStore.kycApproved === EKycApproved.completed ? <FaCheck /> : <FaFile />

  render() {
    if (this.props.stores!.walletStore.userLoggedIn) {
      if (this.props.stores!.appStore.kycApproved === EKycApproved.pendingFirstCheck) {
        return (
          <KycStatusContainer>
            <KycContent>
              <PulseLoader color={"#0d78ca"} />
              <span>{this.props.stores!.langStore.safeGetLocalizedString("kycCheck.verifying")}</span>
            </KycContent>
          </KycStatusContainer>
        )
      } else {
        return (
          <KycStatusContainer>
            <KycContent>
              <IconRow kycApproved={this.props.stores!.appStore.kycApproved}>
                <IconBorder kycApproved={this.props.stores!.appStore.kycApproved}>
                  {this.getKycIcon()}
                </IconBorder>
              </IconRow>
              <span>{this.props.stores!.appStore.kycApproved === EKycApproved.completed ? this.props.stores!.langStore.safeGetLocalizedString("kycCheck.completed") : this.props.stores!.langStore.safeGetLocalizedString("kycCheck.notCompleted")}</span>
              <p>{this.props.stores!.appStore.kycApproved === EKycApproved.completed ? this.props.stores!.langStore.safeGetLocalizedString("kycCheck.makeChanges") : this.props.stores!.langStore.safeGetLocalizedString("kycCheck.pleaseComplete")}</p>
              <ReactGA.OutboundLink
                eventLabel={"Kyc_openAltcoinomy: UserIsLoggedIn"}
                to={this.props.stores!.appStore.kycApproved === EKycApproved.completed ? process.env.REACT_APP_KYC_PORTAL_RETURNING_LINK || "" : this.props.stores!.appStore.affiliateReferral ? `${process.env.REACT_APP_KYC_PORTAL_ONBOARDING_LINK}&bi=${this.props.stores!.appStore.affiliateReferral}` || "" : process.env.REACT_APP_KYC_PORTAL_ONBOARDING_LINK || ""}
                target={"_blank"}
              >
                <Button>{this.props.stores!.langStore.safeGetLocalizedString("kycCheck.visitAltcoinomy")} <FaArrowRight /></Button>
              </ReactGA.OutboundLink>
            </KycContent>
          </KycStatusContainer>
        )
      }
    } else {
      return (
        <KycStatusContainer>
          <KycContent>
            <IconRow kycApproved={this.props.stores!.appStore.kycApproved}>
              <IconBorder kycApproved={this.props.stores!.appStore.kycApproved}>
                <FaQuestion />
              </IconBorder>
            </IconRow>
            <LoginMsg>{this.props.stores!.langStore.safeGetLocalizedString("kycCheck.pleaseLogin")}</LoginMsg>
            <ReactGA.OutboundLink
              eventLabel={"Kyc_openAltcoinomy: UserIsLoggedOut"}
              to={this.props.stores!.appStore.kycApproved === EKycApproved.completed ? process.env.REACT_APP_KYC_PORTAL_RETURNING_LINK || "" : this.props.stores!.appStore.affiliateReferral ? `${process.env.REACT_APP_KYC_PORTAL_ONBOARDING_LINK}&bi=${this.props.stores!.appStore.affiliateReferral}` || "" : process.env.REACT_APP_KYC_PORTAL_ONBOARDING_LINK || ""}
              target={"_blank"}
            >
              <Button>{this.props.stores!.langStore.safeGetLocalizedString("kycCheck.visitAltcoinomy")} <FaArrowRight /></Button>
            </ReactGA.OutboundLink>
          </KycContent>
        </KycStatusContainer>
      )
    }
  }
}
