/*****************
 * Andrew Coutts
 * 2019
 * Root page which hosts the sidebar and lazy loads the content pages
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import Header from "SharedComponents/Header"
import Footer from "SharedComponents/Footer"
import styled from "styled-components"
// import { BarLoader } from "react-spinners"
import { FlexColumn, FlexRow, Button, LandingRowInner, IslandContent, IslandContainer } from "lib/GlobalStyles"
// import ReactTooltip from "react-tooltip"
import { ToastContainer, Flip } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Link } from "react-router-dom"
import { FaGlobeAmericas, FaQuestionCircle } from "react-icons/fa"
// import PieChart from "./token-distribution-piechart.png"

const Body = styled(FlexColumn)`
  margin-top: 70px;
  min-height: calc(100vh - 215px);
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(80% 70% at 75%, #e3ecf9 0%, #b1c5e0 100%);
`

const PageColumn = styled(FlexColumn)`
  flex: 0 0 500px;
  z-index: 2;

  @media (max-width: 800px) {
    flex: 0 0 100%;
  }
`

const PageRow = styled(FlexRow)`
  z-index: 1;
  justify-content: center;
`

const LandingRow = styled(PageRow)`
  position: relative;
`

const RowInner = styled(LandingRowInner)`
  justify-content: center;
`

const ErrorContent = styled(IslandContent)`
  align-items: center;
  text-align: center;

  ${Button} {
    margin-top: 10px;
  }

  h1 {
    margin: 0;
  }
`

const IconColumn = styled(FlexColumn)`
  justify-content: center;
  align-items: center;
  font-size: 10em;
`

const RestrictedContainer = styled(IslandContainer)`
  grid-area: tosContent / tosContent / tosContent / tosContent;
  min-height: 450px;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;

  ${Button} {
    margin-top: 10px;
  }

  @media (max-width: 830px) {
    min-height: initial;
  }
`

@inject("stores")
@observer
export class RegionRestricted extends Component<IStoreProps> {
  render() {
    return (
      <RestrictedContainer>
        <IconColumn>
          <FaGlobeAmericas />
        </IconColumn>
        <ErrorContent>
          <h1>{this.props.stores!.langStore.safeGetLocalizedString("errorPage.restrictedTitle")}</h1>
          <p>{this.props.stores!.langStore.safeGetLocalizedString("errorPage.restrictedContent1")} <Link to={"/terms-and-conditions"}>{this.props.stores!.langStore.safeGetLocalizedString("errorPage.termsConditions")}</Link> {this.props.stores!.langStore.safeGetLocalizedString("errorPage.restrictedContent2")}</p>
          <Link to={`/auction`}>
            <Button>{this.props.stores!.langStore.safeGetLocalizedString("errorPage.returnToDashboard")}</Button>
          </Link>
        </ErrorContent>
      </RestrictedContainer>
    )
  }
}

@inject("stores")
@observer
export default class ErrorPage extends Component<IStoreProps> {
  render() {
    return (
      <FlexColumn>
        <Header />
        <Body>
          <LandingRow>
            <RowInner>
              <PageColumn>
                <IslandContainer>
                  <IconColumn>
                    <FaQuestionCircle />
                  </IconColumn>
                  <ErrorContent>
                    <h1>{this.props.stores!.langStore.safeGetLocalizedString("errorPage.error404")}</h1>
                    <p>{this.props.stores!.langStore.safeGetLocalizedString("errorPage.errorContent")}.</p>
                    <Link to={`/`}>
                      <Button>{this.props.stores!.langStore.safeGetLocalizedString("errorPage.returnHome")}</Button>
                    </Link>
                  </ErrorContent>
                </IslandContainer>
              </PageColumn>
            </RowInner>
          </LandingRow >
        </Body >
        <Footer />
        <ToastContainer transition={Flip} className={"toastContainer"} toastClassName={"notifyContainer"} bodyClassName={"notifyBody"} progressClassName={"notifyProgress"} draggable={false} closeOnClick={false} />
      </FlexColumn >
    )
  }
}
