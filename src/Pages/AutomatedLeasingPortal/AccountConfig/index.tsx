import React, { Component } from "react"
import IStoreProps from "lib/Props"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import {
    IslandContainer,
    ColorLeasingPortalPanels,
    ColorLeasingPortalPanelTrim,
    TableHeader,
    ColorGreenLight,
    ColorWhite,
    FlexColumn,
    FlexRow,
    ColorRed,
} from "lib/GlobalStyles"
import Configure from "./Actions/Configure"
import AddNewConfig from "./Actions/AddNewConfig"


const AccountConfigContainer = styled(IslandContainer)`
    grid-area: accountConfig;
    background: ${ColorLeasingPortalPanels}; 
    border: 1px solid ${ColorLeasingPortalPanelTrim};
    border-radius: 0;
`

const SubmitButton = styled.button`
  background-color: ${ColorGreenLight};
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 5px;
  margin: 10px;
  min-height: 30px;
  width: auto;
  color: ${ColorWhite};
`

const ClearButton = styled(SubmitButton)`
    background-color: ${ColorRed};
`

const ControlRow = styled(FlexColumn)`

justify-content: flex-end;

`

@inject("stores")
@observer
export default class ActionHistory extends Component<IStoreProps> {

    render() {
        return (
            <AccountConfigContainer>
                <FlexRow style={{justifyContent: "space-between"}}>
                    <FlexColumn>
                        <TableHeader>{this.props.stores!.langStore.safeGetLocalizedString("leasingTables.accountsTable.title")}</TableHeader>
                    </FlexColumn>
                    <ControlRow>
                        <FlexRow>
                            <SubmitButton
                                type="submit"
                                form="configUpdates"
                                value="Submit"
                                onClick={() => {
                                    this.props.stores!.walletStore.submitBatchAutomatedresConfigure()
                                }}
                            >
                        Submit
                            </SubmitButton>
                            <ClearButton
                                type="submit"
                                form="configUpdates"
                                value="clear"
                                onClick={() => this.props.stores!.appStore.clearCurrentArmConfigUpdates()}
                            >
                                Clear Change
                            </ClearButton>
                        </FlexRow>
                    </ControlRow>
                </FlexRow>
                <Configure />
                {<AddNewConfig />}
            </AccountConfigContainer>
        )
    }
}
