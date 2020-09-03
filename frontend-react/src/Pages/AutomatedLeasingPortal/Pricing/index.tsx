import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { FlexRow } from "lib/GlobalStyles"
import styled from "styled-components"

interface IFeeItem {
    symbol: string;
    title: string;
    fee: string;
    text: string;
    link: string;
}

const PriceRow = styled(FlexRow)`
    margin: 5px;
    padding: 2px;
    text-align: center;
    size: 25px;
    img {
        width: 27px;
        height: 30px;
    }
`
const PriceContainer = styled(FlexRow)`
    margin-left: 5px;
    width: auto;
`

const TokenRow = styled(FlexRow)`
    align-items: center;
    margin-right: 5px;
`
const FeeRow = styled(FlexRow)`
    margin: 5px;
    padding: 3px;
`


@inject("stores")
@observer
export default class LandingContent extends Component<IStoreProps> {

    renderFeeSchedule() {
        return (this.props.stores!.langStore.safeGetLocalizedString("feeSchedule") as unknown as Array<IFeeItem>).map((e: IFeeItem) => {
            return (
                <PriceRow key={`asset-${e.title}`}>
                    <TokenRow>
                        <img src={require(`${e.symbol}`)} alt="asset symbol" />
                        {e.title}
                    </TokenRow>
                    <FeeRow>
                        Fee: {e.fee}
                    </FeeRow>
                </PriceRow>
            )
        })
    }

    render() {
        return (
            <PriceContainer>
                {this.renderFeeSchedule()}
            </PriceContainer>
        )
    }
}