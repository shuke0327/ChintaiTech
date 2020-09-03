/*****************
 * Kai
 * 2019
 *****************/

import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import {
  FlexRow,
  TitleText,
} from "lib/GlobalStyles"
import Pricing from "../Pricing";


const PortalTitleContainer = styled(FlexRow)`
  grid-area: portalTitle;
  background-color: none;
  width: auto;
  align-items: left;
  svg {
    margin-right: 10px;
    font-size: 1.5em;
  }
`

const PortalTitleText = styled(TitleText)`
  font-size: 24px;
`

const SpacedRow = styled(FlexRow)`
  justify-content: space-between;
  align-items: center;
`

@inject("stores")
@observer
export default class PortalTitle extends Component<IStoreProps> {
  render() {
    return (
      <PortalTitleContainer>
        <SpacedRow>
          <FlexRow>
            <PortalTitleText style={{fontFamily: "PoppinsSemiBold"}}>
              {this.props.stores!.langStore.safeGetLocalizedString("leasingPortalTitle")}
            </PortalTitleText>
          </FlexRow>
          <Pricing />
        </SpacedRow>
      </PortalTitleContainer >
    )
  }
}
