/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { IslandContainer, IslandContent, ColorDarkGrayText, FlexRow, FlexColumn, TitleText, Button } from "lib/GlobalStyles"
import styled from "styled-components"
import { FaCopy, FaArrowRight, FaExclamationTriangle } from "react-icons/fa"
import logoScatter from "./scatter_badge_transparent.png"
import logoEos from "./eos.png"
import { EWalletTxState } from "stores/WalletStore"
import { PulseLoader } from "react-spinners"
import commaNum from "comma-number"
import { Link } from "react-router-dom"
import { LoginButton } from "SharedComponents/Header"
import ReactGA from "react-ga"

const HeadWarningContainer = styled.div`
  grid-area: headWarning / headWarning / headWarning / headWarning;
  align-self: center;

  span {
    line-height: 1.3;
  }

  ${FlexRow} {
    align-items: center;
  }

  a {
    color: blue;
  }
`

const BidConfigContainer = styled.div`
  grid-area: bidConfig / bidConfig / bidConfig / bidConfig;
  span {
    line-height: 1.3;
  }

  h3 {
    margin: 0;
  }

  select {
    padding: 5px;
    background: #fff;
    border-radius: 3px;
    border: 1px solid #324b5660;
    outline: none;
    font-size: 1em;
    color: #324b56;
  }

  @media (max-width: 830px) {
    span, h1, form {
      text-align: center;
    }
  }
`

const BidChexAssistedContainer = styled(IslandContainer)`
  grid-area: bidChexAssisted / bidChexAssisted / bidChexAssisted / bidChexAssisted;
  padding-bottom: 30px;
  height: fit-content;

  span {
    line-height: 1.3;
  }

  ${Button} {
    display: flex;
    align-items: center;

    svg {
      font-size: 1.2em;
      margin-left: 5px;
    }
  }

  h3 {
    margin: 0;
  }

  input {
    outline: none;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid #d4e1f3;
    padding: 5px 7px 3px;
    font-size: 1em;
    color: ${ColorDarkGrayText}
  }

  select {
    outline: none;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid #d4e1f3;
    border-radius: 3px;
    padding: 5px 5px;
    font-size: 0.87em;
    color: ${ColorDarkGrayText};
  }

  @media (max-width: 830px) {
    span, h1, h3 {
      text-align: center;
    }
  }
`

const BidChexManualContainer = styled(IslandContainer)`
  grid-area: bidChexManual / bidChexManual / bidChexManual / bidChexManual;
  padding-bottom: 30px;

  span {
    line-height: 1.3;
  }

  h3 {
    margin: 0;
  }

  p {
    text-align: justify;
  }

  @media (max-width: 830px) {
    text-align: center;
  }
`

const BidRow = styled(FlexRow)`
  justify-content: space-evenly;
  align-items: center;
  margin-top: 5px;
`

const ScatterLogo = styled.div`
  width: 38px;
  position: absolute;
  top: -4px;
  right: 0;

  @media (max-width: 830px) {
    position: initial;
    top: initial;
    right: initial;
  }

  img {
    width: 100%;
  }
`

const BidItems = styled(FlexColumn)`
  margin-right: 10px;

  &:last-of-type {
    margin-right: 0;
  }
`

const BidItemsLoginFirst = styled(BidItems)`
  text-align: center;

  p {
    margin-top: 15px;
  }
`

const BidRowAssisted = styled(BidRow)`
`

const BidItemsManual = styled(BidItems)`
  @media (max-width: 830px) {
    align-items: center;
  }
`

const WarningIsland = styled(IslandContainer)`
  ${FlexRow} {
    margin-bottom: 15px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  h3 {
    margin: 0;
  }

  span {
    margin: 0;
    font-size: 1em;
  }

  svg {
      margin-right: 10px;
      font-size: 25px;
    }
`

const WarningIcon = styled(FlexColumn)`
  flex: 0 0 auto;
  color: #324b56;
`

const CriticalWarningIcon = styled(WarningIcon)`
  color: orange;
`

const EosLogo = styled.div`
`

const CopyButton = styled.div`
`

const ContractBox = styled.div`
  position: relative;
  padding-right: 40px;

  ${EosLogo} {
    width: 18px;
    position: absolute;
    left: 8px;
    top: 7px;
    pointer-events: none;
  }

  input {
    padding: 11px 11px 11px 40px;
    font-size: 1.2em;
    border-radius: 3px;
    background-color: #324b5615;
    border: 1px solid #324b5660;
    color: #324b56;
    outline: none;
    width: 100%;
    font-family: monospace;
  }

  ${CopyButton} {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 9px;
    right: -4px;
    font-size: 1.5em;
    cursor: pointer;
    transition: 0.2s;

    :hover {
      color: #0d78ca;
    }

    :active {
      transform: scale(0.95);
    }
  }
`

const MemoTip = styled(FlexRow)`
  margin-bottom: 5px;

  ${FlexColumn} {
    justify-content: center;
    align-items: center;
    margin-right: 5px;
  }

  svg {
    font-size: 1.3em;
  }
`

const ManualBidRow = styled(FlexRow)`
  margin-top: 10px;

  @media (max-width: 830px) {
    justify-content: center;
  }
`

const MemoBox = styled(ContractBox)`
  padding-right: 50px;
  max-width: 280px;

  input {
    padding: 11px 50px 11px 11px;
  }
`

const BidTypeForm = styled.form`
  display: flex;
  flex-direction: column;

  label {
    cursor: pointer;
  }
`

const QuantityUnit = styled.div`
  height: calc(100% - 10px);
  position: absolute;
  border-left: 1px solid #324b5660;
  right: 29px;
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin: 0;
  font-size: 1.2em;
  right: 0;
`

const BidQuantityRow = styled(FlexRow)`
  position: relative;
  align-items: center;
  justify-content: center;

  input {
    padding: 5px 50px 5px 5px;
    border: 1px solid #324b5660;
    border-radius: 3px;
    outline: none;
    font-size: 1em;
    color: #324b56;
  }

  @media (max-width: 830px) {
    text-align: center;
  }
`

const BidConfigRow = styled(FlexRow)`
  margin-top: 15px;

  h3 {
    white-space: nowrap;
  }

  @media (max-width: 830px) {
    justify-content: center;
    text-align: center;
  }
`

const BidRoundSelectContainer = styled(FlexColumn)`
  &:nth-of-type(2) {
    margin-left: 35px;
  }

  @media (max-width: 830px) {
    text-align: center;

    &:nth-of-type(2) {
      margin-left: 15px;
    }
  }
`

const ExchangeWarningSpan = styled.span`
  font-weight: bold;
`

@inject("stores")
@observer
export class HeadWarning extends Component<IStoreProps> {
  render() {
    return (
      <HeadWarningContainer>
        <WarningIsland>
          <IslandContent>
            <FlexRow>
              <CriticalWarningIcon>
                <FaExclamationTriangle />
              </CriticalWarningIcon>
              <span>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.kycWarning")} <b><Link to={"/auction/kyc"}>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.kycWarningLink")}</Link></b>.</span>
            </FlexRow>
          </IslandContent>
        </WarningIsland>
      </HeadWarningContainer>
    )
  }
}

@inject("stores")
@observer
export class AssistedBid extends Component<IStoreProps> {
  getRoundItems = () => {
    const optionsArray = []
    const roundsRemaining = this.props.stores!.appStore.totalAuctionRounds - this.props.stores!.appStore.currentRoundNumber
    for (let i = 0; i <= roundsRemaining; i++) {
      optionsArray.push(
        <option key={`round-${i}`}>{i + this.props.stores!.appStore.currentRoundNumber} {!i ? "(Current)" : null}</option>
      )
    }
    return optionsArray
  }

  render() {
    if (this.props.stores!.walletStore.userLoggedIn) {
      return (
        <BidChexAssistedContainer>
          <IslandContent>
            <TitleText>
              {this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.assistedBid")}
            </TitleText>
            <BidRowAssisted>
              <ScatterLogo>
                <img src={logoScatter} />
              </ScatterLogo>
            </BidRowAssisted>
            <span>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.scatterDescription")}</span>
            <BidRowAssisted>
              <Button onClick={() => this.props.stores!.walletStore.submitBid()}>{this.props.stores!.walletStore.walletTxState === EWalletTxState.pending ? <PulseLoader color={"#fff"} /> : this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.submitBid")} <FaArrowRight /></Button>
            </BidRowAssisted>
          </IslandContent>
        </BidChexAssistedContainer>
      )
    } else {
      return (
        <BidChexAssistedContainer>
          <IslandContent>
            <TitleText>
              {this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.assistedBid")}
            </TitleText>
            <BidRowAssisted>
              <ScatterLogo>
                <img src={logoScatter} />
              </ScatterLogo>
            </BidRowAssisted>
            <BidRowAssisted>
              <BidItemsLoginFirst>
                <LoginButton />
                <p>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.pleaseLogin")}</p>
              </BidItemsLoginFirst>
            </BidRowAssisted>
          </IslandContent>
        </BidChexAssistedContainer>
      )
    }
  }
}

@inject("stores")
@observer
export class ManualBid extends Component<IStoreProps> {
  copyClipboard = (isMemo: boolean) => {
    const dummy = document.createElement("input")
    document.body.appendChild(dummy)
    let notifyText: string

    if (!isMemo) { // Copy the memo text
      dummy.setAttribute("value", process.env.REACT_APP_TOKEN_AUCTION_ACCOUNT || "myntdemocode")
      notifyText = "clipboardContract"

      ReactGA.event({
        category: "User",
        action: "Copy Contract to Clipboard",
        label: this.props.stores!.walletStore.accountName,
      })
    } else { // Copy the auction account
      dummy.setAttribute("value", this.props.stores!.appStore.manualBidMemo)
      notifyText = "clipboardMemo"

      ReactGA.event({
        category: "User",
        action: "Copy Memo to Clipboard",
        label: this.props.stores!.walletStore.accountName,
      })
    }

    dummy.select()
    document.execCommand("copy")
    document.body.removeChild(dummy)
    this.props.stores!.appStore.notifyInfo(this.props.stores!.langStore.safeGetLocalizedString(`notifications.app.${notifyText}`))
  }

  render() {
    return (
      <BidChexManualContainer>
        <IslandContent>
          <TitleText>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.manualBid")}</TitleText>
          <span>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.manualDescription")}</span>
          <ManualBidRow>
            <BidItemsManual>
              <h3>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.sendPaymentTo")}</h3>
              <ContractBox>
                <EosLogo>
                  <img width={"100%"} src={logoEos} />
                </EosLogo>
                <input disabled value={process.env.REACT_APP_TOKEN_AUCTION_ACCOUNT || "myntdemocode"} />
                <CopyButton onClick={() => this.copyClipboard(false)}>
                  <FaCopy />
                </CopyButton>
              </ContractBox>
            </BidItemsManual>
          </ManualBidRow>

          <ManualBidRow>
            <BidItemsManual>
              <h3>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.memoInst")}</h3>
              <MemoTip>
                <span>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.memoTip")}</span>
              </MemoTip>
              <MemoBox>
                <input disabled value={this.props.stores!.appStore.manualBidMemo} />
                <CopyButton onClick={() => this.copyClipboard(true)}>
                  <FaCopy />
                </CopyButton>
              </MemoBox>
            </BidItemsManual>
          </ManualBidRow>

          <ManualBidRow>
            <ExchangeWarningSpan>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.exchangeWarning")}</ExchangeWarningSpan>
          </ManualBidRow>
        </IslandContent>
      </BidChexManualContainer>
    )
  }
}

@inject("stores")
@observer
export class OrderConfiguration extends Component<IStoreProps> {
  getRoundItems = () => {
    const optionsArray = []
    const roundsRemaining = this.props.stores!.appStore.totalAuctionRounds - this.props.stores!.appStore.currentRoundNumber
    for (let i = 0; i <= roundsRemaining; i++) {
      optionsArray.push(
        <option key={`round-${i}`}>{i + this.props.stores!.appStore.currentRoundNumber} {!i ? "(Current)" : null}</option>
      )
    }
    return optionsArray
  }

  getRoundOptionsSingle = () => {
    return (
      <React.Fragment>
        <BidRoundSelectContainer>
          <h3>{this.props.stores!.langStore.safeGetLocalizedString("roundsSummary.roundNum")}</h3>
          <select value={this.props.stores!.appStore.selectedBidRoundSingle} onChange={(e) => this.props.stores!.appStore.setSelectedBidRound(parseInt(e.target.value, 10))} >
            {this.getRoundItems()}
          </select>
        </BidRoundSelectContainer>
      </React.Fragment>
    )
  }

  getRoundOptionsRange = () => {
    return (
      <React.Fragment>
        <BidRoundSelectContainer>
          <h3>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.roundFrom")}</h3>
          <select value={this.props.stores!.appStore.selectedBidRoundMultipleStart} onChange={(e) => this.props.stores!.appStore.setSelectedBidRoundMultipleStart(parseInt(e.target.value, 10))} >
            {this.getRoundItems()}
          </select>
        </BidRoundSelectContainer>

        <BidRoundSelectContainer>
          <h3>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.roundTo")}</h3>
          <select value={this.props.stores!.appStore.selectedBidRoundMultipleEnd} onChange={(e) => { console.log(e.target.value); this.props.stores!.appStore.setSelectedBidRoundMultipleEnd(parseInt(e.target.value, 10)) }} >
            {this.getRoundItems()}
          </select>
        </BidRoundSelectContainer>
      </React.Fragment>
    )
  }

  getBidConfigSummaryText = () => {
    if (this.props.stores!.appStore.isUsingRangeOfRounds) {
      const returnString = this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.bidSummaryMultipleRound")
      const regexRoundnumStart = new RegExp("{{roundNumStart}}", "g")
      const regexRoundnumEnd = new RegExp("{{roundNumEnd}}", "g")
      const regexQuantity = new RegExp("{{quantity}}", "g")
      return returnString.replace(regexRoundnumStart, `${this.props.stores!.appStore.selectedBidRoundMultipleStart}`).replace(regexRoundnumEnd, `${this.props.stores!.appStore.selectedBidRoundMultipleEnd}`).replace(regexQuantity, `${parseFloat(this.props.stores!.appStore.currentBidQuantity || "0.0000").toFixed(4)}`)
    } else {
      const returnString = this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.bidSummarySingleRound")
      const regexRoundnum = new RegExp("{{roundNum}}", "g")
      const regexQuantity = new RegExp("{{quantity}}", "g")
      return returnString.replace(regexRoundnum, `${this.props.stores!.appStore.selectedBidRoundSingle}`).replace(regexQuantity, `${commaNum(parseFloat(this.props.stores!.appStore.currentBidQuantity || "0.0000").toFixed(4))}`)
    }
  }

  render() {
    return (
      <BidConfigContainer>
        <IslandContainer>
          <IslandContent>
            <TitleText>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.configureBid")}</TitleText>
            <span>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.configureBidDescription")}</span>
            <BidConfigRow>
              <FlexColumn>
                <h3>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.submitBidTo")}</h3>
                <BidTypeForm>
                  <label>
                    <input type={"radio"} name={"roundType"} value={"one"} checked={!this.props.stores!.appStore.isUsingRangeOfRounds} onChange={() => this.props.stores!.appStore.togglIsUsingRangeOfRounds()} />
                    {this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.singleRound")}
                  </label>
                  <label>
                    <input type={"radio"} name={"roundType"} value={"multiple"} checked={this.props.stores!.appStore.isUsingRangeOfRounds} onChange={() => this.props.stores!.appStore.togglIsUsingRangeOfRounds()} />
                    {this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.rangeRounds")}
                  </label>
                </BidTypeForm>
              </FlexColumn>
            </BidConfigRow>

            <BidConfigRow>
              {this.props.stores!.appStore.isUsingRangeOfRounds ? this.getRoundOptionsRange() : this.getRoundOptionsSingle()}
            </BidConfigRow>

            <BidConfigRow>
              <FlexColumn>
                <h3>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.quantity")}</h3>
                <BidQuantityRow>
                  <input id="assistedQuantity" type="text" placeholder="0.0000" value={this.props.stores!.appStore.currentBidQuantity} onChange={(e) => this.props.stores!.appStore.setCurrentBidQuantity(e.target.value)} />
                  <QuantityUnit>EOS</QuantityUnit>
                </BidQuantityRow>
              </FlexColumn>
            </BidConfigRow>

            <BidConfigRow>
              <FlexColumn>
                <h3>{this.props.stores!.langStore.safeGetLocalizedString("bidOnChex.summary")}</h3>
                <span>{this.getBidConfigSummaryText()}</span>
              </FlexColumn>
            </BidConfigRow>
          </IslandContent>
        </IslandContainer>
      </BidConfigContainer>
    )
  }
}
