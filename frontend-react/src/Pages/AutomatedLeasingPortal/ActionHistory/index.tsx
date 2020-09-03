import React, { Component } from "react"
import IStoreProps from "lib/Props"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
    IslandContainer,
    ColorLeasingPortalPanels,
    ColorLeasingPortalPanelTrim,
    TableHeader
} from "lib/GlobalStyles"
import "react-tabs/style/react-tabs.css";
import Configure from "./Configure"
import Blacklist from "./Blacklist"


const ActionHistoryContainer = styled(IslandContainer)`
    grid-area: actionHistory;
    background: ${ColorLeasingPortalPanels}; 
    border: 1px solid ${ColorLeasingPortalPanelTrim};
    border-radius: 0;
`

const TabsLeasing = styled(Tabs)`
    margin-top: 10px;
    padding-top: 10px;
`

@inject("stores")
@observer
export default class ActionHistory extends Component<IStoreProps> {

    render() {
        return (
            <ActionHistoryContainer>
                <TableHeader>{this.props.stores!.langStore.safeGetLocalizedString("leasingTables.accountsTable.title")}</TableHeader>
                <TabsLeasing>
                    <TabList>
                        <Tab>{this.props.stores!.langStore.safeGetLocalizedString("leasingTables.accountsTable.registered")}</Tab>
                        <Tab>{this.props.stores!.langStore.safeGetLocalizedString("leasingTables.accountsTable.blacklist")}</Tab>
                    </TabList>
                    <TabPanel>
                        <Configure />
                    </TabPanel>
                    <TabPanel>
                        <Blacklist />
                    </TabPanel>
                </TabsLeasing>
            </ActionHistoryContainer>
        )
    }
}
