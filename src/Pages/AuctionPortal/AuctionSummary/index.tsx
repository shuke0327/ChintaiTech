/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { IslandContainer, IslandContent, SmallContentTitle } from "lib/GlobalStyles"
import styled from "styled-components"
import * as moment from "moment"
import commaNum from "comma-number"

const RoundsSummaryContainer = styled(IslandContainer)`
  grid-area: roundsSummary / roundsSummary / roundsSummary / roundsSummary;
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

const Number = styled.div`
  font-weight: bold;
`

const NoRowsMsg = styled.span`
  margin-top: 25px;
  text-align: center;
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
export default class RoundsSummary extends Component<IStoreProps> {
  getRows = () => {
    if (!this.props.stores!.appStore.allRoundsSummaryUnfiltered.length) { return null }
    return (
      this.props.stores!.appStore.allRoundsSummaryUnfiltered.map((e) => {
        if (e.endTime === "Invalid date") { e.endTime = moment.utc(0).format() } // Edge case where there's no round entry
        if (e.chexPrice === "NaN") { e.chexPrice = "0" }
        if (e.totalRaised === null) { e.totalRaised = 0 }

        const getStatusInProgress = () => <StatusInProgress>{this.props.stores!.langStore.safeGetLocalizedString("myContributions.inProgress")}</StatusInProgress>
        const getStatusFutureRound = () => <StatusPending>{this.props.stores!.langStore.safeGetLocalizedString("myContributions.pending")}</StatusPending>
        const getStatusCompleted = () => <StatusComplete>{this.props.stores!.langStore.safeGetLocalizedString("myContributions.completed")}</StatusComplete>
        const currentRound = this.props.stores!.appStore.currentRoundNumber
        const auctionEnded = this.props.stores!.appStore.isAuctionEnded

        return (
          <TrWithOpacity key={e.roundNum} futureRound={e.roundNum > this.props.stores!.appStore.currentRoundNumber}>
            <td>{e.roundNum}</td>
            <td>
              <div><b>{moment.utc(e.endTime || 0).format("MM/DD/YYYY")}</b></div>
              <div>{moment.utc(e.endTime || 0).format("HH:mm:ss")} </div>
            </td>
            <td>
              <Number>{commaNum(e.totalRaised.toFixed(4))}</Number>
              <div>EOS</div>
            </td>
            <td>
              <Number>{commaNum(this.props.stores!.appStore.chexIssuedPerRound.toFixed(0))}</Number>
              <div>CHEX</div>
            </td>
            <td>
              <Number>~ {parseFloat(e.chexPrice).toFixed(8)}</Number>
              <div>CHEX/EOS</div>
            </td>
            <td>{(e.roundNum === currentRound && auctionEnded) || e.roundNum < currentRound ? getStatusCompleted() : e.roundNum === currentRound ? getStatusInProgress() : getStatusFutureRound()}</td>
          </TrWithOpacity>
        )
      })
    )
  }

  getTotalContributions = () => this.props.stores!.appStore.currentFutureContributionsCalculation ? this.props.stores!.appStore.sumEosContributionsAll : this.props.stores!.appStore.sumEosContributionsNoFuture
  getTotalChexReceived = () => this.props.stores!.appStore.currentFutureContributionsCalculation ? this.props.stores!.appStore.sumChexReceivedAll : this.props.stores!.appStore.sumChexReceivedNoFuture
  getWeightedAvgChexPrice = () => this.props.stores!.appStore.currentFutureContributionsCalculation ? this.props.stores!.appStore.sumEosChexPriceAll / this.props.stores!.appStore.sumEosContributionsAll : this.props.stores!.appStore.sumEosChexPriceNoFuture / this.props.stores!.appStore.sumEosContributionsNoFuture

  render() {
    return (
      <RoundsSummaryContainer>
        <IslandContent>
          <TableContainerInner>
            <table>
              <thead>
                <tr>
                  <th>
                    <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("roundsSummary.roundNum")}</SmallContentTitle>
                  </th>
                  <th>
                    <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("roundsSummary.date")}</SmallContentTitle>
                  </th>
                  <th>
                    <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("roundsSummary.totalContributions")}</SmallContentTitle>
                  </th>
                  <th>
                    <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("roundsSummary.chexIssued")}</SmallContentTitle>
                  </th>
                  <th>
                    <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("roundsSummary.chexPrice")}</SmallContentTitle>
                  </th>
                  <th>
                    <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("roundsSummary.status")}</SmallContentTitle>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.stores!.appStore.allRoundsSummaryUnfiltered.length ? this.getRows() : null}
              </tbody>
            </table>
          </TableContainerInner>
          {this.props.stores!.appStore.allRoundsSummaryUnfiltered.length ? null : <NoRowsMsg>{this.props.stores!.langStore.safeGetLocalizedString("roundsSummary.noRounds")}</NoRowsMsg>}
        </IslandContent>
      </RoundsSummaryContainer>
    )
  }
}
