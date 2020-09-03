/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { IslandContainer, IslandContent, SmallContentTitle, FlexColumn } from "lib/GlobalStyles"
import { CountdownRow, CountdownColumn, FlipUnitContainerDiv, CountdownFooter } from "SharedComponents/Countdown"
import * as moment from "moment"

const CountdownContainer = styled(IslandContainer)`
  grid-area: countdown / countdown / countdown / countdown;

  ${SmallContentTitle} {
    text-align: center;
  }
`

const CountdownIslandContent = styled(IslandContent)`
  height: 100%;
`

const FinishedContainer = styled(FlexColumn)`
  justify-content: center;
  align-items: center;
  height: 100%;

  svg {
    font-size: 5em;
    margin-top: 15px;
    color: #00cc81;
  }

  span {
    font-weight: bold;
  }
`

@inject("stores")
@observer
export default class Countdown extends Component<IStoreProps> {
  render() {
    if (this.props.stores!.appStore.isAuctionEnded) { // Auction is over
      return (
        <CountdownContainer>
          <CountdownIslandContent>
            <FinishedContainer>
              <span>{this.props.stores!.langStore.safeGetLocalizedString("countdown.auctionEnded")}</span>
            </FinishedContainer>
          </CountdownIslandContent>
        </CountdownContainer>
      )
    } else {
      return (
        <CountdownContainer>
          <IslandContent>
            <SmallContentTitle>{this.props.stores!.langStore.safeGetLocalizedString("liveRoundOverview.title")}</SmallContentTitle>
            <CountdownRow>
              <CountdownColumn>
                <FlipUnitContainerDiv>{this.props.stores!.appStore.countDownCurrentRound.hours}</FlipUnitContainerDiv>
                <span>{this.props.stores!.langStore.safeGetLocalizedString("countdown.hours")}</span>
              </CountdownColumn>
              <CountdownColumn>
                <FlipUnitContainerDiv>{this.props.stores!.appStore.countDownCurrentRound.minutes}</FlipUnitContainerDiv>
                <span>{this.props.stores!.langStore.safeGetLocalizedString("countdown.minutes")}</span>
              </CountdownColumn>
              <CountdownColumn>
                <FlipUnitContainerDiv>{this.props.stores!.appStore.countDownCurrentRound.seconds}</FlipUnitContainerDiv>
                <span>{this.props.stores!.langStore.safeGetLocalizedString("countdown.seconds")}</span>
              </CountdownColumn>
            </CountdownRow>
            <CountdownFooter>
              {this.props.stores!.langStore.safeGetLocalizedString("liveRoundOverview.endingOn")}: {moment.utc(this.props.stores!.appStore.currentRoundEndTime).format("MM/DD/YY HH:mm:ss")}
            </CountdownFooter>
          </IslandContent>
        </CountdownContainer>
      )
    }
  }
}