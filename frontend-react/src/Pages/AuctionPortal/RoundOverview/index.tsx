/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { IslandContainer, IslandContent, SmallContentTitle, FlexRow, FlexColumn } from "lib/GlobalStyles"

const RoundOverviewContainer = styled(IslandContainer)`
  grid-area: roundStats / roundStats / roundStats / roundStats;
  display: flex;
  align-items: center;

  ${FlexRow} {
    justify-content: center;
  }

  ${IslandContent} {
    flex: 1 1 auto;
  }
`

const StatOverviewContainer = styled(FlexColumn)`
  flex: 1 1 auto;
  align-items: center;
  border-right: 1px solid #324b5630;

  h4 {
    margin: 0;
    color: #324b56;
  }

  &:last-of-type {
    border-right: none;
  }
`

const LiveRoundOverviewRow = styled(FlexRow)`
  @media (max-width: 520px) {
    flex-wrap: wrap;
    font-size: 1.2em;

    ${StatOverviewContainer} {
      border: none;
      flex: 1 1 250PX;
      margin-bottom: 20px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
`

const ChexPriceStatOverviewContainer = styled(StatOverviewContainer)`
  color: ${(props: { priceChanged: boolean }) => props.priceChanged ? "#00cc81" : "inherit"};
  font-weight: ${(props: { priceChanged: boolean }) => props.priceChanged ? "bold" : "inherit"};
`

@inject("stores")
@observer
export default class RoundOverview extends Component<IStoreProps> {
  render() {
    return (
      <RoundOverviewContainer>
        <IslandContent>
          <LiveRoundOverviewRow>
            <StatOverviewContainer>
              <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("liveRoundOverview.roundNum")}</SmallContentTitle>
              {this.props.stores!.appStore.currentRoundNumber} / {this.props.stores!.appStore.totalAuctionRounds}
            </StatOverviewContainer>

            <ChexPriceStatOverviewContainer priceChanged={this.props.stores!.appStore.chexEosPriceUpdated}>
              <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("liveRoundOverview.chexPriceEos")}</SmallContentTitle>
              {this.props.stores!.appStore.currentRoundChexPrice.toFixed(8)} {this.props.stores!.langStore.safeGetLocalizedString("liveRoundOverview.chexEos")}
              {/* <h4>1 EOS = ~{(1 / this.props.stores!.appStore.currentRoundChexPrice).toFixed(0)} CHEX</h4> */}
            </ChexPriceStatOverviewContainer>

            <ChexPriceStatOverviewContainer priceChanged={this.props.stores!.appStore.chexEosPriceUpdated}>
              <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("liveRoundOverview.chexPriceUsd")}</SmallContentTitle>
              <div>
                ~ $ {(this.props.stores!.appStore.currentRoundChexPrice * this.props.stores!.appStore.currentEosPrice).toFixed(6)}
              </div>
            </ChexPriceStatOverviewContainer>
          </LiveRoundOverviewRow>
        </IslandContent>
      </RoundOverviewContainer>
    )
  }
}