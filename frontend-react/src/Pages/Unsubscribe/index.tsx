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
import { FlexColumn, FlexRow, LandingRowInner, IslandContainer, IslandContent, Button } from "lib/GlobalStyles"
import { ToastContainer, Flip } from "react-toastify"
import { FaMailBulk } from "react-icons/fa"
import queryString from "query-string"



const Body = styled(FlexColumn)`
  margin-top: 70px;
  min-height: calc(100vh - 215px);
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(80% 70% at 75%, #e3ecf9 0%, #b1c5e0 100%);

  ${IslandContainer} {
    padding: 50px;

    @media (max-width: 830px) {
      padding: 15px;
    }
  }
`

const PageColumn = styled(FlexColumn)`
  flex: 0 0 800px;
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
const UnsubscribeContent = styled(IslandContent)`
  align-items: center;
  text-align: center;

  input {
    padding: 5px;
    max-width: 145px;
    border: 1px solid #324b5660;
    border-radius: 3px;
    outline: none;
    font-size: 1em;
    color: #324b56;
  }

  input, ${Button} {
    margin-top: 10px;
  }

  h1 {
    margin: 0;
  }
`

const RowInner = styled(LandingRowInner)`
  justify-content: center;
`

const IconColumn = styled(FlexColumn)`
  justify-content: center;
  align-items: center;
  font-size: 10em;
`

@inject("stores")
@observer
export default class UnsubscribePage extends Component<IStoreProps, { email: string }> {
  constructor(props: IStoreProps) {
    super(props)
    this.state = {
      email: ""
    }
  }

  setEmail = (email: string) => this.setState({ email })

  componentDidMount() {
    // Detect email out of URL if available to process unsubscribe immediately
    const urlEmail = queryString.parse(this.props.stores!.routerStore.location.search).email as string
    if (urlEmail) {
      this.setEmail(urlEmail)
      this.props.stores!.appStore.submitUnsubscribeRequest(urlEmail)
    }
  }

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
                    <FaMailBulk />
                  </IconColumn>
                  <UnsubscribeContent>
                    <h1>{this.props.stores!.langStore.safeGetLocalizedString("unsubscribe.title")}</h1>
                    <p>{this.props.stores!.langStore.safeGetLocalizedString("unsubscribe.sorry")}</p>
                    <input
                      type="text"
                      placeholder="email@domain.com"
                      value={this.state.email}
                      onChange={(e) => this.setEmail(e.target.value)}
                      onKeyPress={(e) => { if (e.key === "Enter") { this.props.stores!.appStore.submitUnsubscribeRequest(this.state.email) } }} />
                    <Button onClick={() => this.props.stores!.appStore.submitUnsubscribeRequest(this.state.email)}>{this.props.stores!.langStore.safeGetLocalizedString("unsubscribe.unsubscribe")}</Button>
                  </UnsubscribeContent>
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
