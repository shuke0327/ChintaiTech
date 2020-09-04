import React, { Component } from "react"
import IStoreProps from "lib/Props"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import { FiXCircle } from "react-icons/fi"
import {
    IslandContainer,
    ColorLeasingPortalPanels,
    ColorLeasingPortalPanelTrim,
    TableRowLeasing,
    PayerRowLeasing,
    PayeeRowLeasing,
    PayForRowLeasing,
    BufferRowLeasing,
    RemoveRow,
    ColorWhite,
    Gray,
} from "lib/GlobalStyles"
import { IConfigItem } from "stores/AppStore"

const ConfigureContainer = styled(IslandContainer)`
    grid-area: configureHistory;
    background: ${ColorLeasingPortalPanels};
    border: 1px solid ${ColorLeasingPortalPanelTrim};
    padding: 0;
    border-radius: 0;
    display: flex;
    flex-direction: column;
`

const Table = styled.div`
    background-color: ${ColorLeasingPortalPanels};
    color: ${Gray};
    overflow-y: scroll;
    height: 100%;
    /* height: -webkit-fill-available; */
    scrollbar-color: ${Gray} ${ColorLeasingPortalPanels};
    ::-webkit-scrollbar {
        width: 2px;
        height: 2px;
    }
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        box-shadow: 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
        box-shadow: 0 0 6px rgba(0,0,0,0.5);
    }
    ::-webkit-scrollbar-corner {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        box-shadow: 0 0 6px rgba(0,0,0,0.3);
    }
    p {
        border-bottom: 2px dashed;
        text-align: center;
        color: ${Gray};
    }
`

const DataTitle = styled.div`
    font-size: 1em;
    font-weight: normal;
    border-bottom: 1px solid ${ColorWhite};
    margin: auto;
`

// const Compass = styled(FiCompass)`
//     width: auto;
//     height: 30px;
//     display: block;
//     margin: 0 auto;
//     cursor: pointer;
// `

const Remove = styled(FiXCircle)`
    width: auto;
    height: 25px;
    margin: 0;
    padding:0;
    color: ${ColorWhite};
`

@inject("stores")
@observer
export default class ConfigureHistory extends Component<IStoreProps> {
    renderTableRow() {
        return (this.props.stores!.appStore.currentAutomatedresConfigs as unknown as Array<IConfigItem>).map((e: IConfigItem) => {
            return (
                <TableRowLeasing key={e.account_to_watch}>
                    <PayeeRowLeasing>
                        <DataTitle>
                            {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.configTable.header4")}
                        </DataTitle>
                        {e.account_to_watch}
                    </PayeeRowLeasing>
                    <PayForRowLeasing>
                        <DataTitle>
                            {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.configTable.header5")}
                        </DataTitle>
                        {e.notify_account}
                    </PayForRowLeasing>
                    <BufferRowLeasing>
                        <DataTitle>
                            {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.configTable.header6")}
                        </DataTitle>
                        {e.ram_threshold_low_bytes}
                    </BufferRowLeasing>
                    <RemoveRow
                        type="submit" form="depositForm" value="Submit"
                        onClick={() => this.props.stores!.walletStore.submitAutomatedresDeleteConfigure(e.account_to_watch)}>
                        <DataTitle>
                            {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.configTable.remove")}
                        </DataTitle>
                        <Remove />
                    </RemoveRow>
                </TableRowLeasing>
            )
        })
    }

    renderTableRowMobile() {
        return (this.props.stores!.appStore.currentAutomatedresConfigs as unknown as Array<IConfigItem>).map((e: IConfigItem) => {
            return (
                <TableRowLeasing key={e.account_to_watch}>
                    <PayerRowLeasing>
                        <DataTitle>
                            {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.configTable.header3")}
                        </DataTitle>
                        {this.props.stores!.walletStore.currentUserAccountName}
                    </PayerRowLeasing>
                    <PayeeRowLeasing>
                        <DataTitle>
                            {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.configTable.header4")}
                        </DataTitle>
                        {e.account_to_watch}
                    </PayeeRowLeasing>
                    <RemoveRow
                        type="submit" form="depositForm" value="Submit"
                        onClick={() => this.props.stores!.walletStore.submitAutomatedresDeleteConfigure(e.account_to_watch)}>
                        <DataTitle>
                            {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.configTable.remove")}
                        </DataTitle>
                        <Remove />
                    </RemoveRow>
                </TableRowLeasing>
            )
        })
    }

    render() {
        if (this.props.stores!.appStore.windowWidth <= 465) {
            return (
                <ConfigureContainer>
                    <Table>
                        {this.props.stores!.appStore.currentAutomatedresConfigs.length < 1 ?
                            <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingTables.configTable.noData")}</p>
                            : this.renderTableRowMobile()
                        }
                    </Table>
                </ConfigureContainer>
            )
        } else {
            return (
                <ConfigureContainer>
                    <Table>
                        {this.props.stores!.appStore.currentAutomatedresConfigs.length < 1 ?
                            <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingTables.configTable.noData")}</p>
                            : this.renderTableRow()
                        }
                    </Table>
                </ConfigureContainer>
            )
        }
    }
}
