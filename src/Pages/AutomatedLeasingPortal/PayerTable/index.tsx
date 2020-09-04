import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { FlexRow, FlexColumn, TitleTooltipLeasingPortal, ToolTipLeasingPortal, ColorGreen } from "lib/GlobalStyles"
import { FaUser } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";
import ReactTooltip from "react-tooltip"
import AccountInfo from "../AccountInfo"
import EOSCHEXConvert from "../EOSCHEXConvert"
// import BancorWidget from "SharedComponents/BancorWidget"
// import BancorIcon from "./bancor_icon.png"

const PayerTableContainer = styled.div`
    font-size: 0.9em;
`

const PayerRow = styled(FlexRow)`
    justify-content: space-between;
    margin: 15px 0;
`

const BorderRow = styled(FlexRow)`
  box-shadow: 4px 7px 15px rgba(48, 198, 168, 0.3);
  background-color: ${ColorGreen};
  border: none;
  border-radius: 8px;
  justify-content: center;
  font-weight: bold;
`

const BalanceTitle = styled(FlexColumn)`
    justify-content: flex-end;
    width: calc(100% / 5 + 10px );
    text-transform: uppercase;
    font-size: 0.8em;
`

const Balance = styled(FlexColumn)`
    border-bottom: 1px dashed #fff;
    width: calc(100% / 5 * 2 - 10px);
    text-align: right;
    margin: 0 5px;
    font-weight: bold;
`

const Symbol = styled.div`
    font-size: 0.8em;
`

const Account = styled.div`
    font-size: 1.1em;
    font-weight: bold;
`

@inject("stores")
@observer
export default class PayerTable extends Component<IStoreProps> {

    componentDidMount() {
        ReactTooltip.rebuild() // Ensure tooltips will work
    }

    render() {
        return (
            <PayerTableContainer>
                {this.props.stores!.walletStore.userLoggedIn
                    ?
                    <div>
                        <BorderRow>
                            {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.convertChex")}
                        </BorderRow>
                        <PayerRow style={{marginTop: "0"}}>
                            <EOSCHEXConvert />
                        </PayerRow>
                        <PayerRow>
                            <FlexColumn>
                                <TitleTooltipLeasingPortal data-tip={this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.description.h1")} data-place={"top"}>
                                    {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.header1")}<FaQuestion />
                                    <ToolTipLeasingPortal />
                                </TitleTooltipLeasingPortal>
                            </FlexColumn>
                            <Account>
                                {this.props.stores!.walletStore.accountName} <FaUser />
                            </Account>
                        </PayerRow>

                        <AccountInfo />

                        <PayerRow>
                            <BalanceTitle>
                                <TitleTooltipLeasingPortal data-tip={this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.description.h2")} data-place={"top"}>
                                    {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.header2")}<FaQuestion />
                                    <ToolTipLeasingPortal />
                                </TitleTooltipLeasingPortal>
                            </BalanceTitle>
                            <Balance>
                                <Symbol>
                                    CHEX
                                </Symbol>
                                {!this.props.stores!.appStore.currentAutomatedresPayerChexReserves || this.props.stores!.appStore.currentAutomatedresPayerChexReserves === undefined ? 0 :this.props.stores!.appStore.currentAutomatedresPayerChexReserves}
                            </Balance>
                            <Balance>
                                <Symbol>
                                    EOS
                                </Symbol>
                                {!this.props.stores!.appStore.currentAutomatedresPayerEosReserves || this.props.stores!.appStore.currentAutomatedresPayerEosReserves === undefined ? 0 : this.props.stores!.appStore.currentAutomatedresPayerEosReserves}
                            </Balance>
                        </PayerRow>
                        {/* <PayerRow>
                            <BalanceTitle>
                            <TitleTooltipLeasingPortal data-tip={this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.description.h3")} data-place={"top"}>
                                    {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.header3")}<FaQuestion />
                                    <ToolTipLeasingPortal />
                                </TitleTooltipLeasingPortal>
                            </BalanceTitle>
                            <Balance>
                                {!this.props.stores!.appStore.currentAutomatedresPayerChexLiquid ? 0 : this.props.stores!.appStore.currentAutomatedresPayerChexLiquid}
                            </Balance>
                            <Balance>
                                {!this.props.stores!.appStore.currentAutomatedresPayerEosLiquid ? 0 : this.props.stores!.appStore.currentAutomatedresPayerEosLiquid}
                            </Balance>
                        </PayerRow> */}
                    </div>
                    :
                    <div>
                        <BorderRow>
                            {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.convertChex")}
                        </BorderRow>
                        {/* <PayerRow style={{marginTop: "0"}}>
                            <BancorWidget />
                        </PayerRow> */}
                        <PayerRow>
                            <FlexColumn>
                            <TitleTooltipLeasingPortal data-tip={this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.description.h1")} data-place={"top"}>
                                {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.header1")}<FaQuestion />
                                <ToolTipLeasingPortal />
                            </TitleTooltipLeasingPortal>
                            </FlexColumn>
                            <FlexColumn>
                                {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.loginTips")}
                            </FlexColumn>
                        </PayerRow>
                        <PayerRow>
                            <BalanceTitle>
                                <TitleTooltipLeasingPortal data-tip={this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.description.h2")} data-place={"top"}>
                                    {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.header2")}<FaQuestion />
                                    <ToolTipLeasingPortal />
                                </TitleTooltipLeasingPortal>
                            </BalanceTitle>
                            <Balance>
                                <Symbol>
                                    CHEX
                                </Symbol>
                                0.0000
                            </Balance>
                            <Balance>
                                <Symbol>
                                    EOS
                                </Symbol>
                                0.0000
                            </Balance>
                        </PayerRow>
                        {/* <PayerRow>
                            <BalanceTitle>
                                <TitleTooltipLeasingPortal data-tip={this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.description.h3")} data-place={"top"}>
                                    {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.payerTable.header3")}<FaQuestion />
                                    <ToolTipLeasingPortal />
                                </TitleTooltipLeasingPortal>
                            </BalanceTitle>
                            <Balance>
                                0.0000
                            </Balance>
                            <Balance>
                                0.0000
                            </Balance>
                        </PayerRow> */}
                    </div>
                }
            </PayerTableContainer>
        )
    }
}
