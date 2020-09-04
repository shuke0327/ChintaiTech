import React, { Component } from "react"
import IStoreProps from "lib/Props"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import { ProcessBox, FlexColumn, ColorDarkGreen, Gray } from "lib/GlobalStyles"
import warning from "../../../lib/warning.svg"
import computer from "../../../lib/computer.svg"
import cloud from "../../../lib/cloud.svg"


const ProcessContainer = styled.div`
  padding-top: 55px;
  margin: 50px 0;
  display: inherit;
  justify-content: center;
  
  @media (max-width: 900px) {
    display: block;
  }

  /* @media (max-width: 1020px) {
    margin-top: 0px;
    padding-top: 0px;
  } */
`

const HighlightColumn = styled(FlexColumn)`
  text-align: center;
  flex: 0 1 350px;
  align-items: center;
  padding: 15px 35px;
  justify-content: end;

  h2 {
    color: ${ColorDarkGreen}; 
    margin-bottom: 10px;
  }

  p {
    color: ${Gray};
    margin: 0;
    text-align: center;
  }
  
  @media (max-width: 420px) {
    margin-bottom: 25px;
    font-size: 0.75em;
  }
`

const ProcessImage = styled.img`
  width: 200px;

  /* @media (max-width: 1370px) {
  display: none;
  } */
`

@inject("stores")
@observer
export default class Process extends Component<IStoreProps> {
    render() {
        return (
            <ProcessContainer id="anchor" className="element">
                <HighlightColumn>
                  <ProcessImage src={warning} alt=""/>
                  <ProcessBox>
                    <h2>{this.props.stores!.langStore.safeGetLocalizedString("leasingProcess.Title1")}</h2>
                    <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingProcess.Text1")}</p>
                  </ProcessBox>
                </HighlightColumn>
                {/* <Arrow src={ForwardConnector} alt="connecting arrow" /> */}
                <HighlightColumn>
                  <ProcessImage src={computer} alt=""/>
                  <ProcessBox>
                    <h2>{this.props.stores!.langStore.safeGetLocalizedString("leasingProcess.Title2")}</h2>
                    <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingProcess.Text2")}</p>
                  </ProcessBox>
                </HighlightColumn>
                {/* <Arrow src={ForwardConnector} alt="connecting arrow" /> */}
                <HighlightColumn>
                  <ProcessImage src={cloud} alt=""/>
                  <ProcessBox>
                    <h2>{this.props.stores!.langStore.safeGetLocalizedString("leasingProcess.Title3")}</h2>
                    <p>{this.props.stores!.langStore.safeGetLocalizedString("leasingProcess.Text3")}</p>
                  </ProcessBox>
                </HighlightColumn>
            </ProcessContainer>
        )
    }
}