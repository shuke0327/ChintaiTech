/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { IslandContainer, IslandContent, SmallContentTitle, FlexRow, FlexColumn, ToolTip, SmallContentTitleTooltip } from "lib/GlobalStyles"
import styled from "styled-components"
import * as moment from "moment"
import commaNum from "comma-number"
import Toggle from "react-toggle"
import ReactTooltip from "react-tooltip"

const ContributionsContainer = styled(IslandContainer)`
  grid-area: contributions / contributions / contributions / contributions;
  padding: 50px;

  table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    font-size: 1em;

    th {
      padding: 0 10px 0 0;
      border-bottom: 1px solid #324b5630;

      &:first-of-type {
        text-align: center;
      }
    }

    thead {
      text-align: left;
    }

    td {
      padding: 10px 10px 10px 0;
      border-bottom: 1px solid #324b5630;

      &:first-of-type {
        text-align: center;
      }
    }

    tr {
      &:last-of-type {
        td {
          border-bottom: none;
        }
      }
    }

    @media (max-width: 830px) {
      min-width: 975px;
      width: inherit;
    }
  }

  @media (max-width: 830px) {
    padding: 15px;
  }
`

const StatusInProgress = styled.span`
  font-size: 0.9em;
  padding: 3px 10px;
  background-color: #0d78ca;
  color: #fff;
  border-radius: 3px;
`

const StatusComplete = styled(StatusInProgress)`
  background-color: #00cc81;
`

const StatusPending = styled(StatusInProgress)`
  background-color: #324b5690;
`

const TrWithOpacity = styled.tr`
  opacity: ${(props: { futureRound: boolean }) => props.futureRound ? 0.5 : 1};
`

const SummaryRow = styled(FlexRow)`
  margin-bottom: 50px;
  justify-content: space-around;
  flex-wrap: wrap;

  ${FlexColumn} {
    justify-content: center;
    line-height: 1.35;
    margin: 25px;
  }

  h1 {
    margin: 0;
    font-size: 1.6em;
  }

  h3 {
    margin: 0;
    font-weight: normal;
  }
`

const Number = styled.div`
  font-weight: bold;
`

const SettingRow = styled(FlexRow)`
  cursor: ${(props: { toolTip: boolean }) => props.toolTip ? "help" : null};
  flex-direction: row-reverse;
  flex-wrap: wrap;
  justify-content: center;
`

const NoRowsMsg = styled.span`
  margin-top: 25px;
  text-align: center;
`

const ToolTipLabel = styled.div`
  position: relative;
  margin-right: 10px;

  ${ToolTip} {
    bottom: 2px;
  }
`

const TableContainerInner = styled.div`
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 830px) {
    width: calc(100vw - 50px);
  }
`

@inject("stores")
@observer
export default class MyContributions extends Component<IStoreProps> {
  getRows = () => {
    if (!this.props.stores!.appStore.userContributions.length || !this.props.stores!.appStore.allRoundsSummaryUnfiltered.length) { return null }
    return (
      this.props.stores!.appStore.userContributions.map((e) => {
        const getStatusInProgress = () => <StatusInProgress>{this.props.stores!.langStore.safeGetLocalizedString("myContributions.inProgress")}</StatusInProgress>
        const getStatusFutureRound = () => <StatusPending>{this.props.stores!.langStore.safeGetLocalizedString("myContributions.pending")}</StatusPending>
        const getStatusCompleted = () => <StatusComplete>{this.props.stores!.langStore.safeGetLocalizedString("myContributions.completed")}</StatusComplete>
        const currentRound = this.props.stores!.appStore.currentRoundNumber
        const auctionEnded = this.props.stores!.appStore.isAuctionEnded
        if (!this.props.stores!.appStore.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)) { return null }

        return (
          <TrWithOpacity key={e.round} futureRound={e.round > this.props.stores!.appStore.currentRoundNumber}>
            <td>{e.round}</td>
            <td>
              <div><b>{moment.utc(this.props.stores!.appStore.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.endTime).format("MM/DD/YYYY")}</b></div>
              <div>{moment.utc(this.props.stores!.appStore.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.endTime).format("HH:mm:ss")} </div>
            </td>
            <td>
              <Number>{commaNum(e.quantity.toFixed(4))}</Number>
              <div>EOS</div>
            </td>
            <td>
              <Number>{commaNum(parseFloat((e.quantity / parseFloat(this.props.stores!.appStore.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.chexPrice)).toString().match(/^-?\d+(?:\.\d{0,8})?/)![0]).toFixed(8))}</Number>
              <div>{this.props.stores!.projectsStore.projectDetails.symbol}</div>
            </td>
            <td>
              <Number>~ {parseFloat(this.props.stores!.appStore.allRoundsSummaryUnfiltered.find((f) => f.roundNum === e.round)!.chexPrice).toFixed(8)}</Number>
              <div>{this.props.stores!.projectsStore.projectDetails.symbol}/EOS</div>
            </td>
            <td>{(e.round === currentRound && auctionEnded) || e.round < currentRound ? getStatusCompleted() : e.round === currentRound ? getStatusInProgress() : getStatusFutureRound()}</td>
          </TrWithOpacity>
        )
      })
    )
  }

  getTotalContributions = () => this.props.stores!.appStore.currentFutureContributionsCalculation ? this.props.stores!.appStore.sumEosContributionsAll : this.props.stores!.appStore.sumEosContributionsNoFuture
  getTotalChexReceived = () => this.props.stores!.appStore.currentFutureContributionsCalculation ? this.props.stores!.appStore.sumChexReceivedAll : this.props.stores!.appStore.sumChexReceivedNoFuture
  getWeightedAvgChexPrice = () => this.props.stores!.appStore.currentFutureContributionsCalculation ? this.props.stores!.appStore.sumEosChexPriceAll / this.props.stores!.appStore.sumEosContributionsAll : this.props.stores!.appStore.sumEosChexPriceNoFuture / this.props.stores!.appStore.sumEosContributionsNoFuture

  componentDidMount() {
    ReactTooltip.rebuild() // Ensure tooltips will work
  }

  render() {
    return (
      <React.Fragment>
        <ContributionsContainer>
          <IslandContent>
            <SummaryRow>
              <FlexColumn>
                <SmallContentTitleTooltip data-tip={this.props.stores!.langStore.safeGetLocalizedString("myContributions.totalContributionTooltip")} data-place={"top"}>
                  {this.props.stores!.langStore.safeGetLocalizedString("myContributions.totalContribution")}
                  <ToolTip />
                </SmallContentTitleTooltip>
                <h1>{this.props.stores!.walletStore.userLoggedIn ? commaNum(this.getTotalContributions().toFixed(4)) : "--"}</h1>
                <h3>EOS</h3>
              </FlexColumn>

              <FlexColumn>
                <SmallContentTitleTooltip data-tip={this.props.stores!.langStore.safeGetLocalizedString("myContributions.chexReceivedTooltip")} data-place={"top"}>
                  Total {this.props.stores!.projectsStore.projectDetails.symbol} Received
                  <ToolTip />
                </SmallContentTitleTooltip>
                <h1>{this.props.stores!.walletStore.userLoggedIn ? commaNum(this.getTotalChexReceived().toFixed(8)) : "--"}</h1>
                <h3>{this.props.stores!.projectsStore.projectDetails.symbol}</h3>
              </FlexColumn>

              <FlexColumn>
                <SmallContentTitleTooltip data-tip={this.props.stores!.langStore.safeGetLocalizedString("myContributions.avgPriceTooltip")} data-place={"top"}>
                  {this.props.stores!.langStore.safeGetLocalizedString("myContributions.avgPrice")}
                  <ToolTip />
                </SmallContentTitleTooltip>
                <h1>{this.props.stores!.walletStore.userLoggedIn ? this.getWeightedAvgChexPrice() ? this.getWeightedAvgChexPrice().toFixed(8) : "0.00000000" : "--"}</h1>
                <h3>{this.props.stores!.projectsStore.projectDetails.symbol}/EOS</h3>
              </FlexColumn>

              <FlexColumn>
                <SettingRow toolTip={true}>
                  <Toggle
                    checked={this.props.stores!.appStore.currentFutureContributionsCalculation}
                    icons={false}
                    onChange={() => this.props.stores!.appStore.toggleCurrentFutureContributionsCalculation()}
                  />
                  <ToolTipLabel>
                    <span data-tip={"When enabled, summary calculations will include current and future rounds as well."} data-place={"top"}>{this.props.stores!.langStore.safeGetLocalizedString("myContributions.includeFuture")}</span>
                    <ToolTip />
                  </ToolTipLabel>
                </SettingRow>
              </FlexColumn>
            </SummaryRow>
            <TableContainerInner>
              <table>
                <thead>
                  <tr>
                    <th>
                      <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("myContributions.roundNum")}</SmallContentTitle>
                    </th>
                    <th>
                      <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("myContributions.date")}</SmallContentTitle>
                    </th>
                    <th>
                      <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("myContributions.totalContribution")}</SmallContentTitle>
                    </th>
                    <th>
                      <SmallContentTitle>{this.props.stores!.projectsStore.projectDetails.symbol} Received</SmallContentTitle>
                    </th>
                    <th>
                      <SmallContentTitle>{this.props.stores!.projectsStore.projectDetails.symbol} Price</SmallContentTitle>
                    </th>
                    <th>
                      <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("myContributions.status")}</SmallContentTitle>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.stores!.walletStore.userLoggedIn ? this.props.stores!.appStore.userContributions.length ? this.getRows() : null : null}
                </tbody>
              </table>
            </TableContainerInner>
            {this.props.stores!.walletStore.userLoggedIn ? this.props.stores!.appStore.userContributions.length ? null : <NoRowsMsg>{this.props.stores!.langStore.safeGetLocalizedString("myContributions.noContributions")}</NoRowsMsg> : <NoRowsMsg>{this.props.stores!.langStore.safeGetLocalizedString("myContributions.pleaseLogin")}</NoRowsMsg>}
          </IslandContent>
        </ContributionsContainer>
      </React.Fragment>
    )
  }
}
