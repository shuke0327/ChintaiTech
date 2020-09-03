import React, { Component } from "react"
import IStoreProps from "lib/Props"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import { FlexColumn, ItemTitle, FlexRow } from "lib/GlobalStyles"
import { FaQuestionCircle } from "react-icons/fa"


const ReservedValueContainer = styled(FlexColumn)`
    min-width: 100px;
    align-content: flex-start;
    align-items: flex-start;
    margin: 0 10px;
`

const ValueRow = styled(FlexRow)`
    font-size: 12px;
`

// const ContentRow = styled(FlexRow)`
//     align-items: start;
// `

@inject("stores")
@observer
export default class ReservedValue extends Component<IStoreProps> {

    render() {
        return (
            <ReservedValueContainer>
                <ItemTitle>
                    {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.reserve")}
                    <FaQuestionCircle />
                </ItemTitle>
                <ValueRow>
                    {!this.props.stores!.appStore.currentAutomatedresPayerChexReserves || this.props.stores!.appStore.currentAutomatedresPayerChexReserves === undefined ? 0 : this.props.stores!.appStore.currentAutomatedresPayerChexReserves} CHEX
                </ValueRow>
                <ValueRow>
                    {!this.props.stores!.appStore.currentAutomatedresPayerEosReserves || this.props.stores!.appStore.currentAutomatedresPayerEosReserves === undefined ? 0 : this.props.stores!.appStore.currentAutomatedresPayerEosReserves} EOS
                </ValueRow>
            </ReservedValueContainer>
        )
    }
}


