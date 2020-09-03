/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { FlexRow, FlexColumn, ColorRed, ColorBlue, ColorWhite } from "lib/GlobalStyles"
import { FaMicrochip } from "react-icons/fa"
import ReactTooltip from "react-tooltip"


const ItemRow = styled(FlexRow)`
  margin-bottom: 15px;

  img {
    margin-right: 10px;
    align-self: center;
    pointer-events: none;
  }

  svg {
    width: 25px;
    margin-right: 5px;
    align-self: center;
  }

  &:last-of-type {
    margin-bottom: initial;
  }
`

const ResourceTitle = styled.div`
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 3px;
`

const ResourceUtilization = styled.div`
  font-size: 1em;
`

const ResourceTitleRow = styled(FlexRow)`
  justify-content: space-between;
`

const ResourceDetailColumn = styled(FlexColumn)`
  width: 100%;
`

export const ProgressOuter = styled.div`
    border: 1px solid #fff;
  position: relative;
  background-color: ${ColorWhite};
  height: 7px;
`

// Use attrs here because the values of data-tip will change every time a user's BW utilization changes which will
// quickly hit the 200 class limit for styled-components.
// https://www.styled-components.com/docs/api#attrs
export const ProgressInner = styled.div.attrs((props: { utilization: number }) => ({
  style: {
    width: `${props.utilization > 100 ? 100 : props.utilization}%`,
  },
}))`
  position: absolute;
  left: 0;
  background-color: ${(props: { utilization: number }) => props.utilization > 85 ? ColorRed : props.utilization > 60 ? "orange" : ColorBlue};
  height: 7px;
`

const WarningIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
`

const BwStatusIcon = styled(WarningIndicator)`
  background-color: ${(props: { utilization: number }) => props.utilization > 85 ? ColorRed : props.utilization > 60 ? "orange" : "transparent"};
  display: ${(props: { utilization: number }) => props.utilization > 60 ? "initial" : "none"};
`

const BwIconContainer = styled(FlexColumn)`
  position: relative;
  align-items: center;
  justify-content: center;
`

@inject("stores")
@observer
class AccountInfo extends Component<IStoreProps> {
  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  render() {
      return (
        // <ItemRow data-tip={`${parseTimeValue(this.props.stores!.appStore.userAccountInfo.cpu_limit.limit)} ${parseTimeUnit(this.props.stores!.walletStore.accountInfo.accStats_cpu_limit_used)} / ${parseTimeValue(this.props.stores!.walletStore.accountInfo.accStats_cpu_limit_max)} ${parseTimeUnit(this.props.stores!.walletStore.accountInfo.accStats_cpu_limit_max)}`} data-place={"left"}>
       <ItemRow>
       <BwIconContainer>
        <FaMicrochip />
        <BwStatusIcon utilization={parseFloat(this.props.stores!.appStore.userCpuUtilization.toFixed(0))} />
        </BwIconContainer>

        <ResourceDetailColumn>
        <ResourceTitleRow>
            <ResourceTitle>{this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.cpu")}</ResourceTitle>
            <ResourceUtilization>{this.props.stores!.appStore.userCpuUtilization ? this.props.stores!.appStore.userCpuUtilization.toFixed(2) : "--"} %</ResourceUtilization>
        </ResourceTitleRow>
        <ProgressOuter><ProgressInner utilization={parseFloat(this.props.stores!.appStore.userCpuUtilization.toFixed(0))} /></ProgressOuter>
        </ResourceDetailColumn>
        </ItemRow>
      )
    }
}

export default AccountInfo
