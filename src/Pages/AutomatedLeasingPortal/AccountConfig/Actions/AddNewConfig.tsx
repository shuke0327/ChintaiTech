import React, { Component } from "react"
import IStoreProps from "lib/Props"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import { FlexRow, FlexColumn, ColorWhite, ColorBlue, ColorRed, ColorGreen } from "lib/GlobalStyles"
import { EWalletTxState } from "stores/WalletStore"
import { PulseLoader } from "react-spinners"
import { FaPlus, FaMinus } from "react-icons/fa";


const NewConfigContainer = styled(FlexColumn)`
    width: auto;
`


const LandingButtonsContainer = styled(FlexColumn)`
  align-items: flex-start;
  flex-wrap: wrap;
  padding: .5em;
  padding-left: 0px;
  margin-left: 0px;

  a {
    padding: 12.5px 25px;
  }
`

const NewConfigButton = styled.button`
    background: ${(props: MyProps) => props.background};
    width: 120px;
    border: none;
    border-radius:  10px;
    color: ${ColorWhite};
    margin:10px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 10px;
    text-align: center;
    padding: 5px 10px;
    letter-spacing: 0.02em;
    cursor: pointer;

    @media( max-width: 465px) {
            /* 1. Dashboard view */
            width: 130px;
        }
`

const CenterIcon = styled.div`
    position: absolute;
`

interface MyProps {
    background: string
}

@inject("stores")
@observer
export default class AddNewConfig extends Component<IStoreProps> {

    render() {
        return (
            <NewConfigContainer>
                <LandingButtonsContainer>
                    <FlexRow>
                        <NewConfigButton
                            background={this.props.stores!.appStore.showNewConfigRow ? ColorRed : ColorGreen}
                            onClick={() => {
                                this.props.stores!.appStore.toggleNewConfigRow()
                            }}
                        >
                            {this.props.stores!.walletStore.walletTxState === EWalletTxState.pending ? <PulseLoader color={ColorBlue} /> :
                                (this.props.stores!.appStore.showNewConfigRow ?
                                    <><CenterIcon style={{ position: "absolute" }}><FaMinus /></CenterIcon> {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.hideRow")}</> :
                                    <><CenterIcon style={{ position: "absolute" }}><FaPlus /></CenterIcon> {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.addRow")}</>)}
                        </NewConfigButton>
                    </FlexRow>
                </LandingButtonsContainer>
            </NewConfigContainer>
        )
    }
}
