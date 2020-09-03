import React, { Component } from "react"
import IStoreProps from "lib/Props"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import {
    IslandContainer,
    ColorLeasingPortalPanels,
    ColorLeasingPortalPanelTrim,
    FlexRow, ColorBlue, Gray,
    TableHeader
} from "lib/GlobalStyles"
import { ILeaseModel } from "stores/AppStore"

const TxHistoryContainer = styled(IslandContainer)`
    grid-area: txHistory;
    background: ${ColorLeasingPortalPanels}; 
    border: 1px solid ${ColorLeasingPortalPanelTrim};
    border-radius: 0;
`

const TxTableContent = styled.div`
    background-color: ${ColorLeasingPortalPanels};
    color: black;
    // overflow-y:scroll;
    height: 100%;
    /* height: -webkit-fill-available; */
    // scrollbar-color: ${Gray} ${ColorLeasingPortalPanels};
    // ::-webkit-scrollbar {
    //     width: 2px;
    //     height: 3px;
    // }
    
    // ::-webkit-scrollbar-track {
    //     -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
    //     box-shadow: 0 0 6px rgba(0,0,0,0.3);
    //     border-radius: 10px;
    // }
    
    // ::-webkit-scrollbar-thumb {
    //     border-radius: 10px;
    //     -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    //     box-shadow: 0 0 6px rgba(0,0,0,0.5);
    // }
    // ::-webkit-scrollbar-corner {
    //     -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
    //     box-shadow: 0 0 6px rgba(0,0,0,0.3);   
    // }
    p {
        border-bottom: 2px dashed;
        text-align: center;
        color: black;
    }    
`

const DataTitle = styled.div`
    font-size: 1em;
    font-weight: normal;
    width: 15%;
`

const DateColumnTitle = styled(DataTitle)`
    width: 25%;
`

const DataCell = styled.div`
    font-size: 1em;
    width: 15%;
`

const ColorDataCell = styled(DataCell)`
    color: ${ColorBlue};
`

const DateColumnCell = styled(DataCell)`
    width: 25%;
`


const TxHistoryTable = styled.div`
    width: 95%;
    margin: 10px;
    border-collapse: collapse;
`

const TableHeadTitle = styled(FlexRow)`
    width: 100%;
    align-content: space-evenly;
`

const TxRow = styled(FlexRow)`
    width: 100%;
    align-content: space-evenly;
    border-bottom: 1px solid #324b56;
`


@inject("stores")
@observer
export default class TxHistory extends Component<IStoreProps> {

    renderTableRow() {
        return (this.props.stores!.appStore.currentAutomatedresTxHistory as unknown as Array<ILeaseModel>).map((e: ILeaseModel) => {
            return (
                <TxRow key={`autores-${e.txIds[0]}`}>
                    <DateColumnCell>{e.timestampOpen}</DateColumnCell>
                    <DataCell>betdiceone</DataCell>
                    <ColorDataCell>{e.quantity} EOS(CPU)</ColorDataCell>
                    <ColorDataCell>{e.quantity}</ColorDataCell>
                    <ColorDataCell>{e.quantity} EOS</ColorDataCell>
                    <ColorDataCell>{e.totalInterest} EOS</ColorDataCell>
                    <DataCell>
                        <a href={`https://bloks.io/transaction/${e.txIds[0]}`} target="_blank">{e.txIds[0].slice(0, 8)}...</a>
                    </DataCell>
                </TxRow>
            )
        })
    }

    renderMockTableRow() {
        return (
            <>
                <TxRow key={`autores-1`}>
                    <DateColumnCell>Oct-10-2019, 02:40:28 PM</DateColumnCell>
                    <DataCell>betdiceone</DataCell>
                    <ColorDataCell>0.0001 EOS(CPU)</ColorDataCell>
                    <ColorDataCell>0.0001 EOS</ColorDataCell>
                    <ColorDataCell>0.01 EOS</ColorDataCell>
                    <ColorDataCell>0.01 EOS</ColorDataCell>
                    <DataCell>
                        <a href={`https://bloks.io/transaction/123456212222222`} target="_blank">12345621...</a>
                    </DataCell>
                </TxRow>
                <TxRow key={`autores-2`}>
                    <DateColumnCell>Oct-12-2019, 02:40:28 PM</DateColumnCell>
                    <DataCell>betdiceone</DataCell>
                    <ColorDataCell>0.0001 EOS(CPU)</ColorDataCell>
                    <ColorDataCell>0.0001 EOS</ColorDataCell>
                    <ColorDataCell>0.01 EOS</ColorDataCell>
                    <ColorDataCell>0.01 EOS</ColorDataCell>
                    <DataCell>
                        <a href={`https://bloks.io/transaction/123456212222222`} target="_blank">12345621...</a>
                    </DataCell>
                </TxRow>
                <TxRow key={`autores-3`}>
                    <DateColumnCell>Oct-13-2019, 02:42:28 PM</DateColumnCell>
                    <DataCell>betdiceone</DataCell>
                    <ColorDataCell>0.0001 EOS(CPU)</ColorDataCell>
                    <ColorDataCell>0.0001 EOS</ColorDataCell>
                    <ColorDataCell>0.01 EOS</ColorDataCell>
                    <ColorDataCell>0.01 EOS</ColorDataCell>
                    <DataCell>
                        <a href={`https://bloks.io/transaction/123456212222222`} target="_blank">12345621...</a>
                    </DataCell>
                </TxRow>
            </>
        )
    }

    render() {
        return (
            <TxHistoryContainer>
                <TableHeader>{this.props.stores!.langStore.safeGetLocalizedString("leasingTables.delegationHistory.title")}</TableHeader>
                {/* {this.props.stores!.appStore.currentAutomatedresTxHistory.length < 1 ?
                        <p>*{this.props.stores!.langStore.safeGetLocalizedString("leasingTables.delegationHistory.underDevelopment")}*</p>
                        : this.renderTableRow()
                    } */}
                <TxHistoryTable>
                    <TableHeadTitle>
                        <DateColumnTitle>Date</DateColumnTitle>
                        <DataTitle>Account</DataTitle>
                        <DataTitle>Resources</DataTitle>
                        <DataTitle>Rex Interest Paid</DataTitle>
                        <DataTitle>Chintai Fee</DataTitle>
                        <DataTitle>Total Paid</DataTitle>
                        <DataTitle>Tx</DataTitle>
                    </TableHeadTitle>
                    <TxTableContent>
                        {/* {this.renderMockTableRow()} */}
                        {`*History data under maintenance*`}
                    </TxTableContent>
                </TxHistoryTable>
            </TxHistoryContainer >
        )
    }
}