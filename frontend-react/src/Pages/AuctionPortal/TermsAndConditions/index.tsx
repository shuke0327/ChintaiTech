/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled, { keyframes } from "styled-components"
import { FlexRow, ColorRed, IslandContainer, IslandContent, IslandButton, GreenButton } from "lib/GlobalStyles"
import { EBidChexState } from "stores/AppStore"
import { FaExclamation, FaArrowRight, FaArrowLeft } from "react-icons/fa"
import { Link } from "react-router-dom"
import { getTosContent } from "Pages/TermsPage";
// import { Document, Page, pdfjs } from "react-pdf"
// (pdfjs as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjs as any).version}/pdf.worker.js`
import ReactGA from "react-ga"

const TosContent = styled(IslandContainer)`
  grid-area: tosContent / tosContent / tosContent / tosContent;
  z-index: 1;

  h4 {
    text-align: center;
    margin: 5px 0px;
  }

  h5 {
    margin: 0;
  }

  input {
    margin-right: 10px;
    flex: 0 0 25px;
  }

  ${IslandButton} {
    bottom: 15px;
    right: 15px;

    @media (max-width: 900px) {
      position: inherit;
      width: 100%;
      justify-content: center;
      right: inherit;
      bottom: inherit;

      button {
        margin-left: 0;
      }
    }
  }
`

const TosWarning = styled(FlexRow)`
  align-items: center;
  margin-bottom: 5px;
  align-self: center;

  svg {
    font-size: 1.25em;
    color: orange;
  }
`

const TosCertification = styled(FlexRow)`
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;

  label {
    border: ${(props: { tosCertified: boolean, errorStateCertified: boolean }) => !props.tosCertified && props.errorStateCertified ? `2px solid ${ColorRed}` : "0"};
    padding: ${(props: { tosCertified: boolean, errorStateCertified: boolean }) => !props.tosCertified && props.errorStateCertified ? "0px 5px" : null};
    transition: 0.3s;

    &:hover {
      cursor: pointer;
    }
  }
`

const TermsAndConditionsBox = styled.div`
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  max-height: 50vh;
  border: ${(props: { tosRead: boolean, errorStateRead: boolean }) => !props.tosRead && props.errorStateRead ? `2px solid ${ColorRed}` : `1px solid #324b5650`};
  padding: 50px;
  margin-bottom: 10px;
  border-radius: 3px;
  transition: 0.3s;

  h1 {
    margin-top: 0;
  }

  @media (max-width: 830px) {
    min-height: calc(100vh - 300px);
    padding: 5px;
  }
`

const TosArrowAnimation = keyframes`
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(10px);
  }

  100% {
    transform: translateX(0);
  }
`

const TosArrow = styled.div`
  opacity: ${(props: { tosRead: boolean, errorStateRead: boolean }) => !props.tosRead && props.errorStateRead ? "1" : "0"};
  position: absolute;
  font-size: 5em;
  z-index: 1;
  left: -85px;
  top: 27vh;
  color: ${ColorRed};
  animation: ${TosArrowAnimation} 1.5s steps(300) infinite;
  transition: 0.3s;
`

const CertifyArrow = styled.div`
  position: absolute;
  font-size: 5em;
  color: ${ColorRed};
  z-index: 1;
  opacity: ${(props: { tosCertified: boolean, errorStateCertified: boolean }) => !props.tosCertified && props.errorStateCertified ? "1" : "0"};
  right: -85px;
  left: initial;
  bottom: -45px;
  animation: ${TosArrowAnimation} 1.5s steps(300) infinite;
  transition: 0.3s;
`

const TosCertBoxes = styled(FlexRow)`
  flex-direction: column;
  align-items: flex-start;
`

@inject("stores")
@observer
export default class TosComponent extends Component<IStoreProps, { tosRead: boolean, tosCertified1: boolean, tosCertified2: boolean, tosCertified3: boolean, tosCertified4: boolean, errorStateRead: boolean, errorStateCertified: boolean }> {
  constructor(props: IStoreProps & { bidChexState: EBidChexState }) {
    super(props)

    this.state = {
      tosRead: false,
      tosCertified1: false,
      tosCertified2: false,
      tosCertified3: false,
      tosCertified4: false,
      errorStateRead: false,
      errorStateCertified: false,
    }
  }

  setTosRead = () => this.setState({ tosRead: true })
  toggleTosCertified = (e: number) => {
    if (!this.state.tosRead) {
      this.props.stores!.appStore.notifyError(this.props.stores!.langStore.safeGetLocalizedString("notifications.app.readTos"), 30000)
      if (!this.state.errorStateRead) {
        this.toggleErrorStateRead()
      }
      return
    }
    if (e === 1) {
      this.setState({ tosCertified1: !this.state.tosCertified1 })
    } else if (e === 2) {
      this.setState({ tosCertified2: !this.state.tosCertified2 })
    } else if (e === 3) {
      this.setState({ tosCertified3: !this.state.tosCertified3 })
    } else {
      this.setState({ tosCertified4: !this.state.tosCertified4 })
    }
  }
  toggleErrorStateRead = () => this.setState({ errorStateRead: !this.state.errorStateRead })
  toggleErrorStateCertified = () => this.setState({ errorStateCertified: !this.state.errorStateCertified })

  handleScroll = (e: any) => {
    // console.log("e.target.scrollHeight - e.target.scrollTop: ", e.target.scrollHeight - e.target.scrollTop, " || e.target.clientHeight: ", e.target.clientHeight)
    // console.log("difference: ", e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight)
    const bottom = Math.abs(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight) < 10
    if (bottom) {
      // console.log("Scrolled")
      this.setTosRead()
    }
  }

  handleAcceptTos = () => {
    if (!this.state.tosRead) {
      this.props.stores!.appStore.notifyError(this.props.stores!.langStore.safeGetLocalizedString("notifications.app.readTos"), 30000)
      if (!this.state.errorStateRead) { this.toggleErrorStateRead() }
      return
    }

    if (!this.state.tosCertified1 || !this.state.tosCertified2 || !this.state.tosCertified3 || !this.state.tosCertified4) {
      this.props.stores!.appStore.notifyError(this.props.stores!.langStore.safeGetLocalizedString("notifications.app.tosChecks"), 30000)
      if (!this.state.errorStateCertified) { this.toggleErrorStateCertified() }
      return
    }


    ReactGA.event({
      category: "User",
      action: "Accept TOS",
      label: this.props.stores!.walletStore.accountName,
    })

    this.props.stores!.appStore.setTosConfirmed(true)
    this.setState({ tosRead: false })
    this.setState({ tosCertified1: false })
    this.setState({ tosCertified2: false })
    this.setState({ tosCertified3: false })
    this.setState({ tosCertified4: false })
    this.setState({ errorStateRead: false })
    this.setState({ errorStateCertified: false })
  }

  render() {
    return (
      <React.Fragment>
        <TosContent>
          <IslandContent>
            {/* <TitleText>{this.props.stores!.langStore.safeGetLocalizedString("terms.title")}</TitleText> */}
            <TosWarning>
              <FaExclamation />
              <h4>{this.props.stores!.langStore.safeGetLocalizedString("terms.note")}</h4>
              <FaExclamation />
            </TosWarning>
            <TermsAndConditionsBox errorStateRead={this.state.errorStateRead} tosRead={this.state.tosRead} onScroll={this.handleScroll}>
              {getTosContent()}
            </TermsAndConditionsBox>
            <TosCertBoxes>
              <TosCertification errorStateCertified={this.state.errorStateCertified} tosCertified={this.state.tosCertified1}>
                <input id="certify1" type="checkbox" checked={this.state.tosCertified1} onChange={() => this.toggleTosCertified(1)} /><label htmlFor="certify1"><h5>{this.props.stores!.langStore.safeGetLocalizedString("terms.certify1")}</h5></label>
              </TosCertification>
              <TosCertification errorStateCertified={this.state.errorStateCertified} tosCertified={this.state.tosCertified2}>
                <input id="certify2" type="checkbox" checked={this.state.tosCertified2} onChange={() => this.toggleTosCertified(2)} /><label htmlFor="certify2"><h5>{this.props.stores!.langStore.safeGetLocalizedString("terms.certify2")}</h5></label>
              </TosCertification>
              <TosCertification errorStateCertified={this.state.errorStateCertified} tosCertified={this.state.tosCertified3}>
                <input id="certify3" type="checkbox" checked={this.state.tosCertified3} onChange={() => this.toggleTosCertified(3)} /><label htmlFor="certify3"><h5>{this.props.stores!.langStore.safeGetLocalizedString("terms.certify3a")} <Link to={`/whitepaper?lang=${this.props.stores!.langStore.currentSelectedLang}`} target="_blank">{this.props.stores!.langStore.safeGetLocalizedString("terms.certify3b")}</Link></h5></label>
              </TosCertification>
              <TosCertification errorStateCertified={this.state.errorStateCertified} tosCertified={this.state.tosCertified4}>
                <input id="certify4" type="checkbox" checked={this.state.tosCertified4} onChange={() => this.toggleTosCertified(4)} /><label htmlFor="certify4"><h5>{this.props.stores!.langStore.safeGetLocalizedString("terms.certify4a")} <Link to={"/terms-and-conditions"}>{this.props.stores!.langStore.safeGetLocalizedString("errorPage.termsConditions")}</Link> {this.props.stores!.langStore.safeGetLocalizedString("terms.certify4b")}</h5></label>
              </TosCertification>
            </TosCertBoxes>
          </IslandContent>
          <IslandButton>
            <GreenButton onClick={() => this.handleAcceptTos()}>{this.props.stores!.langStore.safeGetLocalizedString("terms.accept")}</GreenButton>
          </IslandButton>
          <TosArrow errorStateRead={this.state.errorStateRead} tosRead={this.state.tosRead}>
            <FaArrowRight />
          </TosArrow>
          <CertifyArrow errorStateCertified={this.state.errorStateCertified} tosCertified={this.state.tosCertified1 && this.state.tosCertified2 && this.state.tosCertified3 && this.state.tosCertified4}>
            <FaArrowLeft />
          </CertifyArrow>
        </TosContent>
        {/* <GlobalStyle tosFocused={this.props.stores!.appStore.tosMouseFocused} /> */}
      </React.Fragment >
    )
  }
}
