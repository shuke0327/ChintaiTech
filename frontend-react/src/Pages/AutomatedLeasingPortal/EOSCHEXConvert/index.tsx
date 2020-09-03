import React from "react"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import { 
  IslandContainer,
  FlexColumn,
  ColorGreen,
  ColorRed,
  ColorLeasingPortalPanels,
  ColorLeasingPortalPanelTrim,
  ColorInputBackgroundLightGray,
  ColorInputBackgroundGray,
  TableHeader
} from "lib/GlobalStyles"
import IStoreProps from "lib/Props"

const EOSCHEXConvertContainer = styled(IslandContainer)`
    height: auto;
    margin-top: 0;
    grid-area: chexConverter;
    background: ${ColorLeasingPortalPanels}; 
    border: 1px solid ${ColorLeasingPortalPanelTrim};
    border-radius: 0;
    form {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

`

const InputContainer = styled.div`
    margin: 0px 0 15px 0;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
    
    input {
        width: 120px;
        padding:  0 5px 0 0;
        border: none;
        text-align: right;
        background: ${ColorInputBackgroundLightGray};
        border: none;
        border-bottom: 1px solid ${ColorInputBackgroundGray};
          /* Mobile views */
        @media( max-width: 465px) {
            /* 1. Dashboard view */
            width: 90px;
        }
    }
    input {
        height: 31px;
        :invalid {
            background-color: ${ColorRed};
        }
    }
`

const ResultsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
`

const TextLabel = styled.p`
    display: block;
    margin: 0px;
    font-weight: bold;
`

const TextValue = styled.p`
    margin: 0px;
    margin-left: 5px;
`

const ConvertButton = styled.button`
height: 31px;
    width: 100px;
    background: ${ColorGreen};
    border-radius: 0px 5px 5px 0px;
    color: #fff;
    border: none;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.9em;
    text-align: center;
    padding: 8px 0;
    letter-spacing: 0.02em;
    cursor: pointer;

    @media( max-width: 465px) {
            /* 1. Dashboard view */
            width: 130px;
        }
`

const WidgetWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 10px;
`

const ConvertContent = styled(FlexColumn)`
  align-items:flex-start;
`

type Props = {} & IStoreProps

@inject("stores")
@observer
class EOSCHEXConvert extends React.Component<Props> {
  render() {
    return (
      <EOSCHEXConvertContainer>
        <TableHeader>Convert EOS to CHEX</TableHeader>
        <form action="#" method="push">
          <ConvertContent>
            <InputContainer>
              {/*<Label htmlFor="">{this.props.stores!.langStore.safeGetLocalizedString("leasingForms.deposit.label2")}:</Label>*/}
              <WidgetWrapper>
                <input id="assistedQuantity" type="text" placeholder="0.0000" value={this.props.stores!.appStore.currentEosToChexConvertValue} onChange={(e) => this.props.stores!.appStore.setEosToChexConvertValue(e.target.value)} step="0.001" />
                <ConvertButton type="button" onClick={() => this.props.stores!.walletStore.submitEosToChexTransaction()}>Convert</ConvertButton>
              </WidgetWrapper>
              <ResultsWrapper>
                <TextLabel>Converted value:</TextLabel>
                <TextValue>{this.props.stores!.appStore.currentEosToChexConvertedValue || 0} CHEX</TextValue>
              </ResultsWrapper>
              <ResultsWrapper>
                <TextLabel>CHEX price:</TextLabel>
                <TextValue>{this.props.stores!.appStore.currentBancorChexPrice || 0} EOS</TextValue>
              </ResultsWrapper>

            </InputContainer>
          </ConvertContent>
        </form>
      </EOSCHEXConvertContainer>
    )
  }
}

export default EOSCHEXConvert
