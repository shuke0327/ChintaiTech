import React, { Component } from "react"
import IStoreProps from "lib/Props"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import {
    IslandContainer,
    ColorLeasingPortalPanels,
    ColorLeasingPortalPanelTrim,
    FlexRow,
    FlexColumn,
    TableHeader
} from "lib/GlobalStyles"
import DepositWithdraw from "./Actions/DepositWithdraw";
import ReservedValue from "./Actions/ReservedValue";
import LockedRam from "./Actions/LockedRam";
import { NewLoginButton } from "SharedComponents/Header";


const ActionFormsContainer = styled(IslandContainer)`
    grid-area: actionForms;
    background: ${ColorLeasingPortalPanels}; 
    border: 1px solid ${ColorLeasingPortalPanelTrim};
    border-radius: 0;
`

const FirstColumn = styled(FlexColumn)`
    align-items: left;
    align-content: space-evenly;
    padding: 5px;
`

const ActionFormsContent = styled(FlexRow)`
    align-content: space-evenly;
    align-items: flex-start;
    padding: 10px 0;
`

@inject("stores")
@observer
export default class ActionForm extends Component<IStoreProps> {

    render() {
        if (this.props.stores!.walletStore.userLoggedIn) {
            return (
                <ActionFormsContainer>
                    <TableHeader>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.setup")}
                    </TableHeader>
                    <ActionFormsContent>
                        <FirstColumn>
                            <NewLoginButton />
                        </FirstColumn>
                        <ReservedValue />
                        <LockedRam />
                        <DepositWithdraw />
                    </ActionFormsContent>
                </ActionFormsContainer>
            )
        }
        else {
            return (
                <ActionFormsContainer>
                    <TableHeader>
                        {this.props.stores!.langStore.safeGetLocalizedString("leasingForms.setup")}
                    </TableHeader>
                    <ActionFormsContent>
                        <NewLoginButton />
                    </ActionFormsContent>
                </ActionFormsContainer>
            )

        }
    }
}
