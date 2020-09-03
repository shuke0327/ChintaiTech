import React, { Component } from "react"
import IStoreProps from "lib/Props"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import { 
    ColorRed,
    FlexRow,
    FlexColumn,
    ColorWhite,
    ColorBlue,
    ColorInputBackgroundGray,
    ColorInputBackgroundLightGray,
    ItemTitle,
    ColorGreenLight
} from "lib/GlobalStyles"
import { EWalletTxState } from "stores/WalletStore"
import { PulseLoader } from "react-spinners"
import { LoginButton } from "SharedComponents/Header"


const DepositWithdrawContainer = styled(FlexColumn)`
    width: auto;
    margin: 0 10px;
`

const Label = styled.label`
    display: block;
    margin-bottom: 5px;
`

const InputContainer = styled.div`
    margin: 0 0 5px 0;
    display: flex;
    justify-content: space-between;

    input {
        padding:  0 5px 0 0;
        background: ${ColorInputBackgroundLightGray};
        border: none;
        border-bottom: 1px solid ${ColorInputBackgroundGray};
        text-align: right;
          /* Mobile views */
        @media( max-width: 465px) {
            /* 1. Dashboard view */
            width: 90px;
        }
    }
    select {
        border-top: 0;
        border-bottom: 0;
        color: ${ColorWhite};
        background-color: ${ColorBlue};
    }
    input, select {
        height: 28px;
        :invalid {
            background-color: ${ColorRed};
        }
    }
`

const LandingButtonsContainer = styled(FlexColumn)`
  align-items: center;
  flex-wrap: wrap;
  padding: .5em;
  padding-left: 0px;
  margin-left: 0px;

  a {
    padding: 12.5px 25px;
  }
`

const DepositButton = styled.button`
    background: #fff;
    width: 120px;
    border: 2px solid ${ColorGreenLight};
    border-radius:  5px;
    color: ${ColorGreenLight};
    margin:10px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 10px;
    text-align: center;
    letter-spacing: 0.02em;
    cursor: pointer;
    margin-left: 0;
    @media( max-width: 465px) {
            /* 1. Dashboard view */
            width: 130px;
        }
`

const WithdrawButton = styled.button`
    margin:10px;
    width: 120px;
    background: #fff;
    border-radius: 5px;
    border: 2px solid ${ColorRed};
    color: ${ColorRed};
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

@inject("stores")
@observer
export default class DepositWithdraw extends Component<IStoreProps> {
    render() {
        return (
            <DepositWithdrawContainer>
                <form action="#" method="push" id="configureForm">
                    <InputContainer>
                        <FlexColumn>
                            <Label>
                                <ItemTitle>
                                    {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.deposit.label2")}:
                                </ItemTitle>
                            </Label>
                            <div>
                                <input id="assistedQuantity" type="text" placeholder="0.0000" value={this.props.stores!.appStore.currentAutomatedresDepositWithdrawQuantity} onChange={(e) => this.props.stores!.appStore.setCurrentAutomatedresQuantity(e.target.value)} step="0.001" />
                                <select name="resources" value={this.props.stores!.appStore.currentAutomatedresDepositWithdrawTokenAccount} onChange={(e) => this.props.stores!.appStore.setCurrentAutomatedresTokenAccount(e.target.value)} >
                                    {/* <option style={{display: "none"}}>select</option> */}
                                    <option key="CHEX" value="chexchexchex">CHEX</option>
                                    <option key="EOS" value="eosio.token">EOS</option>
                                </select>
                            </div>
                        </FlexColumn>
                    </InputContainer>
                </form>
                <LandingButtonsContainer>
                    {this.props.stores!.walletStore.userLoggedIn ?
                        <>
                            <FlexRow>
                                <DepositButton onClick={() => this.props.stores!.walletStore.submitAutomatedresDeposit()}>{this.props.stores!.walletStore.walletTxState === EWalletTxState.pending ? <PulseLoader color={ColorBlue} /> : this.props.stores!.langStore.safeGetLocalizedString("leasingForms.deposit.title")} </DepositButton>
                                <WithdrawButton onClick={() => this.props.stores!.walletStore.submitAutomatedresWithdraw()}>{this.props.stores!.walletStore.walletTxState === EWalletTxState.pending ? <PulseLoader color={ColorBlue} /> : this.props.stores!.langStore.safeGetLocalizedString("leasingForms.withdraw.title")} </WithdrawButton>
                            </FlexRow>
                            {/* <FlexRow>
                                    <EmergencyCpuButton onClick={() => this.props.stores!.walletStore.submitEmergencyCpuAction()}>
                                        <Exclamation />
                                        {this.props.stores!.walletStore.walletTxState === EWalletTxState.pending ? "Processing" : this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.cpuButton")}
                                        <Exclamation />
                                    </EmergencyCpuButton>
                                </FlexRow> */}
                            {/* <FlexRow>*{this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.emergencyCpu")}</FlexRow> */}
                        </>
                        : <LoginButton />
                    }
                </LandingButtonsContainer>
            </DepositWithdrawContainer>
        )
    }
}


