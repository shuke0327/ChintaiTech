import React, { Component } from "react"
import IStoreProps from "lib/Props"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import { FlexColumn, FlexRow, ItemTitle } from "lib/GlobalStyles"
import { FaQuestionCircle } from "react-icons/fa"

const LockedRamContainer = styled(FlexColumn)`
    align-items: flex-start;
    margin: 0 10px;
`

const ValueRow = styled(FlexRow)`

`

@inject("stores")
@observer
export default class DepositWithdraw extends Component<IStoreProps> {

    render() {
        return (
            <LockedRamContainer>
                <ItemTitle>
                    {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.lockedRam")}
                    <FaQuestionCircle />
                </ItemTitle>
                <ValueRow>
                    {!this.props.stores!.appStore.currentAutomatedresPayerLockedRam || this.props.stores!.appStore.currentAutomatedresPayerLockedRam === undefined ? 0 : this.props.stores!.appStore.currentAutomatedresPayerLockedRam}</ValueRow>
            </LockedRamContainer>
        )
    }
}
