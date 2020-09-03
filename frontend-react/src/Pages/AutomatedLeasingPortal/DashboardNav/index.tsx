/*****************
 * Andrew Diedrich
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import {
  IslandContainer,
  IslandContent,
  FlexRow,
  TitleText,
  ColorLeasingPortalPanels,
  ColorLeasingPortalPanelTrim
} from "lib/GlobalStyles"
import { LoginButton } from "SharedComponents/Header"

const DashboardHeaderContainer = styled(IslandContainer)`
  grid-area: navBar;
  background-color: ${ColorLeasingPortalPanels};
  border: 1px solid ${ColorLeasingPortalPanelTrim};
  width: auto;


  h1 {
    margin: 0;
    line-height: 1;
  }

  svg {
    margin-right: 10px;
    font-size: 1.5em;
  }
`

const SpacedRow = styled(FlexRow)`
  justify-content: space-between;
  align-items: center;
`

// const NavRow = styled(FlexRow)`
//   justify-content: space-around;
//   /* flex: 1 1 auto; */

//   h3 {
//     color: #324b56;
//   }

//   a {
//     text-decoration: none;
//   }
// `

const LoginButtonRow = styled(FlexRow)`
  /* flex: 0 1 230px;  */
  justify-content: center;
  /* padding: 10px 0px; */
  margin: auto;
`

const TitleTextWhite = styled(TitleText)`
  color: black;
  margin-left: 20px;
  justify-content: center;
  font-size: 1.6em;
  border-right: 1px solid white;
  margin-right: 5px;
  padding-right: 15px;
`

const BrandTitle = styled.div`
  font-size: 0.6em;

  img {
    width: 20%;
  }
`


@inject("stores")
@observer
export default class NavBar extends Component<IStoreProps & { activeView: string }> {
  render() {
    if (this.props.stores!.appStore.isMobile) {
      return (
        <DashboardHeaderContainer>
          <IslandContent>
            <LoginButtonRow>
              <LoginButton />
            </LoginButtonRow>
          </IslandContent>
        </DashboardHeaderContainer >
      )
    } else {
      return (
        <DashboardHeaderContainer>
          <IslandContent>
            <SpacedRow>
              <FlexRow>
                <TitleTextWhite>
                  <BrandTitle>
                    {this.props.stores!.langStore.safeGetLocalizedString("leasingPortalSubTitle")}
                  </BrandTitle>
                  {this.props.stores!.langStore.safeGetLocalizedString("leasingPortalTitle")}
                </TitleTextWhite>
              </FlexRow>
              <LoginButton />
            </SpacedRow>
          </IslandContent>
        </DashboardHeaderContainer >
      )
    }
  }
}
