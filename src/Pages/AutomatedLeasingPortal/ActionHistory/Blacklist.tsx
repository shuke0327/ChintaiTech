import React, { Component } from "react"
import IStoreProps from "lib/Props"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import { FiXCircle } from "react-icons/fi";
import {
    IslandContainer,
    ColorLeasingPortalPanels,
    ColorLeasingPortalPanelTrim,
    ColorWhite,
    Gray,
    TableRowLeasingBlacklist,
    PayerRowLeasing,
    PayeeRowLeasing,
    RemoveRow
} from "lib/GlobalStyles"
import { IBlacklistItem } from "stores/AppStore"

const BlacklistContainer = styled(IslandContainer)`
    grid-area: blacklistHistory;
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
    /* scrollbar-color: ${Gray} ${ColorLeasingPortalPanels}; */
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
`

const Remove = styled(FiXCircle)`
    width: auto;
    height: 30px ; 
`

@inject("stores")
@observer
export default class BlacklistHistory extends Component<IStoreProps> {

    renderTableRow() {
        return (this.props.stores!.appStore.currentAutomatedresBlacklists as unknown as Array<IBlacklistItem>).map((e: IBlacklistItem) => {
            return (
                <TableRowLeasingBlacklist key={e.account}>
                    <PayerRowLeasing>
                        <DataTitle>
                            {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.blacklistTable.header3")}
                        </DataTitle>
                        {this.props.stores!.walletStore.currentUserAccountName}
                    </PayerRowLeasing>
                    <PayeeRowLeasing>
                        <DataTitle>
                            {this.props.stores!.langStore.safeGetLocalizedString("leasingTables.blacklistTable.header4")}
                        </DataTitle>
                        {e.account}
                    </PayeeRowLeasing>
                    <RemoveRow
                        type="submit" form="depositForm" value="Submit"
                        onClick={() => this.props.stores!.walletStore.submitAutomatedresRemoveBlacklist(e.account)}>
                        <Remove />
                    </RemoveRow>
                </TableRowLeasingBlacklist>
            )
        })
    }

    render() {
        return (
            <BlacklistContainer>
                <Table>
                    {this.props.stores!.appStore.currentAutomatedresBlacklists.length < 1 ?
                        <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingTables.blacklistTable.noData")}</p>
                        : this.renderTableRow()
                    }
                </Table>
            </BlacklistContainer>
        )
    }
}