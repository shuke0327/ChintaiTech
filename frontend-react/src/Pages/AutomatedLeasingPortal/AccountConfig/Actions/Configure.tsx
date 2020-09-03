import React, { Component } from "react"
import IStoreProps from "lib/Props"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import { FiXCircle } from "react-icons/fi"
import { TiInputChecked } from "react-icons/ti"


import Toggle from "react-toggle"
import "react-toggle/style.css"
import {
    IslandContainer,
    ColorLeasingPortalPanels,
    ColorLeasingPortalPanelTrim,
    ColorDarkGrayText,
    ItemTitle,
    DataCell,
    DataTitle,
    ConfigRow,
    RemoveRow,
    ColorWhite,
    // FlexRow,
    // ColorInputBackgroundGray,
    // ColorInputBackgroundLightGray,
    Gray,
    ColorRed
} from "lib/GlobalStyles"
import { FaQuestionCircle } from "react-icons/fa"
import { IConfigItem, IConfigFormItem } from "stores/AppStore"


const ConfigureContainer = styled(IslandContainer)`
    grid-area: txHistory;
    background: ${ColorLeasingPortalPanels}; 
    border: 1px solid ${ColorLeasingPortalPanelTrim};
    padding: 0;
    border-radius: 0;
    display: flex;
    flex-direction: column;
`

// const ConfigTableContent = styled.tr`
//     background-color: ${ColorLeasingPortalPanels};
//     color: black;
//     // overflow-y:scroll;
//     height: 100%;
//     /* height: -webkit-fill-available; */
//     // scrollbar-color: ${Gray} ${ColorLeasingPortalPanels};
//     // ::-webkit-scrollbar {
//     //     width: 2px;
//     //     height: 3px;
//     // }

//     // ::-webkit-scrollbar-track {
//     //     -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
//     //     box-shadow: 0 0 6px rgba(0,0,0,0.3);
//     //     border-radius: 10px;
//     // }

//     // ::-webkit-scrollbar-thumb {
//     //     border-radius: 10px;
//     //     -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
//     //     box-shadow: 0 0 6px rgba(0,0,0,0.5);
//     // }
//     // ::-webkit-scrollbar-corner {
//     //     -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
//     //     box-shadow: 0 0 6px rgba(0,0,0,0.3);   
//     // }
//     p {
//         border-bottom: 2px dashed;
//         text-align: center;
//         color: black;
//     }    
// `
const ConfigureTable = styled.table`
    width: 95%;
    margin: 10px;
    border-collapse: collapse;
`

const TableHeadTitle = styled.tr`
    width: 100%;
    height: 50px;
    align-content: space-evenly;
    align-items: center;
    border-bottom: 1px solid ${ColorDarkGrayText};
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
const Remove = styled(FiXCircle)`
    width: 30px;
    height: 30px;
    margin: 5px;
    color: ${ColorRed};
`

const RoundRemove = styled(TiInputChecked)`
    width: 30px;
    height: 30px;
    margin: 5px;
    color: ${ColorWhite};
    background-color: ${ColorRed};
`

// const InputContainer = styled.tr`
//     margin: 5px 0;
//     display: flex;
//     justify-content: space-between;
//     input {
//         background: ${ColorInputBackgroundLightGray};
//         border: none;
//         border-bottom: 1px solid ${ColorInputBackgroundGray};
//         text-align: left;
//           /* Mobile views */
//         @media( max-width: 465px) {
//             /* 1. Dashboard view */
//             width: 90px;
//         }
//         height: 28px;
//         :invalid {
//             background-color: ${ColorRed};
//         }
//     }
// `


@inject("stores")
@observer
export default class Config extends Component<IStoreProps> {

    handleDeleteMode(index: number, key: string) {
        this.props.stores!.appStore.setDelMode(index)
        this.props.stores!.appStore.addDelRecord(key)
        this.props.stores!.appStore.resetFormItemChange(index)
    }

    //  Add Table Items Change to Update Array
    handleItemChange(index: number, type: string, value: number | boolean | string) {
        this.props.stores!.appStore.updateFormItemChange(index, type, value)
        // const newState = this.props.stores!.appStore.configFormToUpdate.map((item, i) => {
        //     if (i === index) {
        //         // console.log(...item.configItem)
        //         return {
        //             key: item.key,
        //             configItem: item.configItem + ({ [type]: value }),
        //             enable_delete: item.enable_delete,
        //             enable_edit: item.enable_edit
        //         }
        //     }
        //     return item
        // })
        // this.props.stores!.appStore.configFormToUpdate.replace(newState)
    }

    renderTableHead() {
        return (
            <TableHeadTitle>
                <DataTitle>
                    <ItemTitle>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.configure.label1")}
                        <FaQuestionCircle />
                    </ItemTitle>
                </DataTitle>
                <DataTitle>
                    <ItemTitle>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.configure.label2")}
                        <FaQuestionCircle />
                    </ItemTitle>
                </DataTitle>
                <DataTitle>
                    <ItemTitle>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.configure.label3")}
                        <FaQuestionCircle />
                    </ItemTitle>
                </DataTitle>
                <DataTitle>
                    <ItemTitle>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.configure.label4")}
                        <FaQuestionCircle />
                    </ItemTitle>
                </DataTitle>
                <DataTitle>
                    <ItemTitle>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.configure.label5")}
                        <FaQuestionCircle />
                    </ItemTitle>
                </DataTitle>
                <DataTitle>
                    <ItemTitle>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.configure.label6")}
                        <FaQuestionCircle />
                    </ItemTitle>
                </DataTitle>
                <DataTitle>
                    <ItemTitle>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.configure.label7")}
                        <FaQuestionCircle />
                    </ItemTitle>
                </DataTitle>
                <DataTitle>
                    <ItemTitle>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.configure.label8")}
                        <FaQuestionCircle />
                    </ItemTitle>
                </DataTitle>
                <DataTitle>
                    <ItemTitle>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.configure.label9")}
                        <FaQuestionCircle />
                    </ItemTitle>
                </DataTitle>
                <DataTitle>
                    <ItemTitle>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.configure.label10")}
                        <FaQuestionCircle />
                    </ItemTitle>
                </DataTitle>
                <DataTitle>
                    <ItemTitle>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.configure.label11")}
                        <FaQuestionCircle />
                    </ItemTitle>
                </DataTitle>
                <DataTitle>
                    <ItemTitle>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.configure.delete")}
                        <FaQuestionCircle />
                    </ItemTitle>
                </DataTitle>
            </TableHeadTitle>
        )
    }
    renderEditableField(index: number, dataType: string, data: number | string | boolean, editable: boolean, delState: boolean) {
        if (editable && !delState) {
            return (
                <input
                    id={`record-${dataType}-${index.toString()}`}
                    type={dataType === 'max_price_per_eos' ? 'text' : 'number'}
                    step="1"
                    value={this.props.stores!.appStore.configFormToUpdate[index].configItem[dataType].toString()}
                    onChange={
                        (e) => this.handleItemChange(
                            index, dataType, e.target.value)
                    } />
            )
        }
        else {
            return data
        }
    }

    renderTableRow() {
        return (this.props.stores!.appStore.configFormToUpdate as unknown as Array<IConfigFormItem>).map((item: IConfigFormItem, index: number) => {
            return (
                <ConfigRow key={item.key}>
                    <DataCell>{item.configItem.account_to_watch}</DataCell>
                    <DataCell>
                        <a href="javascript:void(0)" onClick={() => this.props.stores!.appStore.setFormItemEditable(item)}>
                            {this.renderEditableField(index, 'cpu_threshold_low_us', item.configItem.cpu_threshold_low_us, item.enable_edit, item.enable_delete)}
                        </a>
                    </DataCell>
                    <DataCell>
                        <a href="javascript:void(0)" onClick={() => this.props.stores!.appStore.setFormItemEditable(item)}>
                            {this.renderEditableField(index, 'cpu_threshold_high_us', item.configItem.cpu_threshold_high_us, item.enable_edit, item.enable_delete)}
                        </a>
                    </DataCell>
                    <DataCell>
                        <a href="javascript:void(0)" onClick={() => this.props.stores!.appStore.setFormItemEditable(item)}>
                            {this.renderEditableField(index, 'net_threshold_low_bytes', item.configItem.net_threshold_low_bytes, item.enable_edit, item.enable_delete)}
                        </a>
                    </DataCell>
                    <DataCell>
                        <a href="javascript:void(0)" onClick={() => this.props.stores!.appStore.setFormItemEditable(item)}>
                            {this.renderEditableField(index, 'net_threshold_high_bytes', item.configItem.net_threshold_high_bytes, item.enable_edit, item.enable_delete)}
                        </a>
                    </DataCell>
                    <DataCell>
                        <a href="javascript:void(0)" onClick={() => this.props.stores!.appStore.setFormItemEditable(item)}>
                            {this.renderEditableField(index, 'ram_threshold_low_bytes', item.configItem.ram_threshold_low_bytes, item.enable_edit, item.enable_delete)}
                        </a>
                    </DataCell>
                    <DataCell>
                        <a href="javascript:void(0)" onClick={() => this.props.stores!.appStore.setFormItemEditable(item)}>
                            {this.renderEditableField(index, 'ram_threshold_high_bytes', item.configItem.ram_threshold_high_bytes, item.enable_edit, item.enable_delete)}
                        </a>
                    </DataCell>
                    <DataCell>
                        <a href="javascript:void(0)" onClick={() => this.props.stores!.appStore.setFormItemEditable(item)}>
                            {this.renderEditableField(index, 'max_price_per_eos', item.configItem.max_price_per_eos, item.enable_edit, item.enable_delete)}
                        </a>
                    </DataCell>
                    <DataCell>
                        <Toggle
                            checked={item.configItem.notify_payer}
                            icons={false}
                            onChange={
                                (e) => {
                                    this.props.stores!.appStore.toggleFormItemChange(item, 'notify_payer')
                                    e.target.checked = item.configItem.notify_payer
                                }}
                        />
                    </DataCell>
                    <DataCell>
                        <Toggle
                            checked={item.configItem.notify_account}
                            icons={false}
                            onChange={
                                (e) => {
                                    this.props.stores!.appStore.toggleFormItemChange(item, 'notify_account')
                                    e.target.checked = item.configItem.notify_account
                                }}
                        />
                    </DataCell>
                    <DataCell>
                        <Toggle
                            checked={item.configItem.active}
                            icons={false}
                            onChange={
                                (e) => {
                                    this.props.stores!.appStore.toggleFormItemChange(item, 'active')
                                    e.target.checked = item.configItem.active
                                }}
                        />
                    </DataCell>
                    <DataCell>
                        <RemoveRow
                            type="submit" form="depositForm" value="Submit"
                            onClick={
                                () => {
                                    this.handleDeleteMode(index, item.configItem.account_to_watch)
                                }}
                        >
                            {item.enable_delete ?
                                <RoundRemove /> : <Remove />}
                        </RemoveRow>
                    </DataCell>
                </ConfigRow >
            )
        })
    }

    renderTableRowMobile() {
        return (this.props.stores!.appStore.currentAutomatedresConfigs as unknown as Array<IConfigItem>).map((e: IConfigItem) => {
            return (
                <ConfigRow key={e.account_to_watch}>
                    <DataCell>{e.account_to_watch}</DataCell>
                    <DataCell>{e.cpu_threshold_low_us}</DataCell>
                    <DataCell>{e.cpu_threshold_high_us}</DataCell>
                    <DataCell>{e.net_threshold_low_bytes}</DataCell>
                    <DataCell>{e.net_threshold_high_bytes}</DataCell>
                    <DataCell>{e.ram_threshold_low_bytes}</DataCell>
                    <DataCell>{e.ram_threshold_high_bytes}</DataCell>
                    <DataCell>{e.max_price_per_eos}</DataCell>
                    <DataCell>{e.notify_payer}</DataCell>
                    <DataCell>{e.notify_account}</DataCell>
                    <DataCell>{e.active}</DataCell>
                    <RemoveRow
                        type="submit" form="depositForm" value="Submit"
                        onClick={() => this.props.stores!.walletStore.submitAutomatedresDeleteConfigure(e.account_to_watch)}>
                        <Remove />
                    </RemoveRow>
                </ConfigRow>
            )
        })
    }

    renderNewConfigForm() {
        return (
            // <form action="#" method="push" id="newConfigureForm">
            // <InputContainer>
            <ConfigRow key="newConfiguration">
                {/* Account to Watch */}
                <DataCell>
                    <input id="accountToWatch" type="text" placeholder="Account Name" value={this.props.stores!.appStore.currentAutomatedresAccountToWatch} onChange={(e) => this.props.stores!.appStore.setCurrentAutomatedresAccountToWatch(e.target.value)} />
                </DataCell>
                {/* CPU low value */}
                <DataCell>
                    <input id="CpuThresholdLow" type="number" value={this.props.stores!.appStore.currentCpuThresholdLow} onChange={(e) => this.props.stores!.appStore.setCurrentCpuThresholdLow(e.target.valueAsNumber)} />
                </DataCell>
                {/* CPU high value */}
                <DataCell>
                    <input id="CpuThresholdHigh" type="number" value={this.props.stores!.appStore.currentCpuThresholdHigh} onChange={(e) => this.props.stores!.appStore.setCurrentCpuThresholdHigh(e.target.valueAsNumber)} />
                </DataCell>
                {/* NET low value */}
                <DataCell>
                    <input id="NetThresholdLow" type="number" value={this.props.stores!.appStore.currentNetThresholdLow} onChange={(e) => this.props.stores!.appStore.setCurrentCpuThresholdLow(e.target.valueAsNumber)} />
                </DataCell>
                {/* NET high value */}
                <DataCell>
                    <input id="NetThresholdHigh" type="number" value={this.props.stores!.appStore.currentNetThresholdHigh} onChange={(e) => this.props.stores!.appStore.setCurrentNetThresholdHigh(e.target.valueAsNumber)} />
                </DataCell>
                {/* RAM low value */}
                <DataCell>
                    <input id="RamThresholdLow" type="number" value={this.props.stores!.appStore.currentRamThresholdLow} onChange={(e) => this.props.stores!.appStore.setCurrentRamThresholdLow(e.target.valueAsNumber)} />
                </DataCell>
                {/* RAM high value */}
                <DataCell>
                    <input id="RamThresholdHigh" type="number" value={this.props.stores!.appStore.currentRamThresholdHigh} onChange={(e) => this.props.stores!.appStore.setCurrentRamThresholdHigh(e.target.valueAsNumber)} />
                </DataCell>
                {/* Max EOS Price */}
                <DataCell>
                    <input id="MaxEosPrice" type="text" placeholder="Input Max" value={this.props.stores!.appStore.currentMaxEosPrice} onChange={(e) => this.props.stores!.appStore.setCurrentMaxEosPrice(e.target.value)} />
                </DataCell>
                {/* Notify Payer */}
                <DataCell>
                    <Toggle
                        checked={this.props.stores!.appStore.currentNotifyPayer}
                        icons={false}
                        onChange={(e) => {
                            this.props.stores!.appStore.toggleCurrentNotifyPayer()
                            e.target.checked = this.props.stores!.appStore.currentNotifyPayer
                        }}
                    />
                </DataCell>
                {/* Notify Account */}
                <DataCell>
                    <Toggle
                        checked={this.props.stores!.appStore.currentNotifyAccount}
                        icons={false}
                        onChange={(e) => {
                            this.props.stores!.appStore.toggleCurrentNotifyAccount()
                            e.target.checked = this.props.stores!.appStore.currentNotifyAccount
                        }}
                    />
                </DataCell>
                {/* set Account Active */}
                <DataCell>
                    <Toggle
                        checked={this.props.stores!.appStore.currentAccountActive}
                        icons={false}
                        onChange={(e) => {
                            this.props.stores!.appStore.toggleCurrentAccountActive()
                            e.target.checked = this.props.stores!.appStore.currentAccountActive
                        }}
                    />
                </DataCell>
            </ConfigRow>
            // </InputContainer>
            // </form>
        )
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
                    {/* {this.props.stores!.appStore.currentAutomatedresTxHistory.length < 1 ?
                                <p>*{this.props.stores!.langStore.safeGetLocalizedString("leasingTables.delegationHistory.underDevelopment")}*</p>
                                : this.renderTableRow()
                            } */}
                    <ConfigureTable>
                        {this.renderTableHead()}
                        {/* <ConfigTableContent> */}
                        <tbody>
                            {this.renderTableRow()}
                            {/* </ConfigTableContent> */}
                            {/* add new config row */}
                            {this.props.stores!.appStore.showNewConfigRow ?
                                this.renderNewConfigForm() : ''
                            }
                        </tbody>
                    </ConfigureTable>
                </ConfigureContainer >
            )
        }
    }
}
