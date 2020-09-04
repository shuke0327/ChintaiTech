/*****************
 * Andrew Coutts
 * 2019
 * Common shared styles to be used throughout the frontend
 *****************/
import styled from "styled-components"
import "./fonts.css"
import { ColorButton, ColorPanelBackground, ColorOutline, ColorFontAccent } from "./colors"
export const ColorGreen = "#00CE7D"
export const ColorDarkGrayText = "#324B56"
export const ColorDarkGreen = "#01777d"
export const ColorGreenLight = "#00cc81"
export const ColorBlueLight = "#00A6CC"
export const ColorBlue = "#0d78ca"
export const ColorRed = "#EB5757"
export const Gray = "#324b56"
export const ColorInputBackgroundGray = "rgb(80, 82, 102)"
export const ColorInputBackgroundLightGray = "#E5E5E5"
export const ColorInputBorder = "#808080"
export const ColorWhite = "#fff"

// //leasing portal theme
// export const ColorLeasingPortalBackground = "linear-gradient(10deg, rgba(0,166,204,1) 0%, rgba(13,120,202,1) 45%);"
// export const ColorLeasingPortalPanels = "#ffffff"
// export const ColorLeasingPortalTables = "#4d97cf"
// export const ColorLeasingPortalPanelHeaders = "#79b7e6"
// export const ColorLeasingPortalTableRowTrim = "#23699e"
// export const ColorLeasingPortalPanelTrim = "#23699e"

// theme backup
// export const ColorLeasingPortalBackground = "linear-gradient(10deg, rgba(0,166,204,1) 0%, rgba(13,120,202,1) 45%);"
// export const ColorLeasingPortalPanels = "#198ee8"
// export const ColorLeasingPortalTables = "#4d97cf"
// export const ColorLeasingPortalPanelHeaders = "#79b7e6"
// export const ColorLeasingPortalTableRowTrim = "#23699e"
// export const ColorLeasingPortalPanelTrim = "#23699e"

//New Theme Design

export const ColorLeasingPortalBackground = "#F5F7F9"
export const ColorLeasingPortalPanels = "#ffffff"
export const ColorLeasingPortalTables = "#4d97cf"
export const ColorLeasingPortalPanelHeaders = "#79b7e6"
export const ColorLeasingPortalTableRowTrim = "#e5e5ef"
export const ColorLeasingPortalPanelTrim = "#e5e5ef"

export enum EAuctionPortalViews {
  dashboard = "dashboard",
  kyc = "kyc",
  getChex = "bid",
  contributions = "contributions",
  rounds = "rounds",
  referral = "referral"
}

export enum ELeasingPortalViews {
  dashboard = "dashboard"
}

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`

export const MyntGreenButton = styled.button`
  /* Style for "item118" */
  width: 166px;
  height: 46px;
  box-shadow: 4px 7px 15px rgba(48, 198, 168, 0.3);
  background-color: #00cc81;
  border: none;
  border-radius: 15px;
  color: #ffffff;
  font-family: PoppinsBold;
  font-size: 14px;
  font-weight: 700;
  line-height: 15.46px;
  text-transform: uppercase;
  /* Text style for "Sign up to" */
  letter-spacing: 0.28px;
  cursor: pointer;
`

export const Button = styled.button`
  background: ${ColorButton};
  /* color: #e3ecf9; */
  color: #fff;
  font-weight: bold;
  font-size: 0.9em;
  letter-spacing: 0.02em;
  padding: 8px 15px;
  cursor: pointer;
  outline: none;
  border: none;
  box-shadow: 0 0 transparent;
  text-transform: uppercase;

  @media (max-width: 660px) {
    &:hover {
      transform: none;
    }
  }

  &:active {
    transform: scale(0.93);
    box-shadow: 0 0 transparent;
  }
`

export const ButtonBig = styled(Button)`
  padding: 12px 18px;
`
// export const GreenButton = styled(Button)`
//   background: linear-gradient(135deg, #00cc81, #01777d);
//   color: ${ColorWhite};
// `

export const Filler = styled.div`
  flex: 1 1 auto;
  width: 100%;
`

export const TitleText = styled.h1`
  margin: 0;
  letter-spacing: 1px;
	font-family: PoppinsBold;
	font-size: 1.3em;
	font-weight: normal;
	font-stretch: normal;
	line-height: 4vw;
	color: #3d3d3d;

  @media (max-width: 410px) {
    font-size: 1.5em;
  }

  @media (max-width: 230px) {
    font-size: 1.2em;
  }

  @media (max-width: 830px) {
    text-align: center;
  }
`

export const IslandContainer = styled.div`
  position: relative;
  background: ${ColorPanelBackground};
  padding: 15px;
  outline: ${ColorOutline};
  box-shadow: 3px 4px 8px rgba(14, 44, 62, 0.05);
`

export const IslandContent = styled(FlexColumn)`
  position: relative;

  p {
    margin: 0;
    word-break: break-word;
    line-height: 1.4;
  }
`

export const IslandButton = styled(FlexRow)`
  justify-content: flex-end;
  position: absolute;
  bottom: -20px;
  right: 15px;

  p {
    margin: 20px 0px;
  }
`

export const GreenButton = styled(ButtonBig)`
`
export const BlueButton = styled(ButtonBig)`
background: #0d78ca;
color: #fff;
`

export const BlueBorderButton = styled(ButtonBig)`
  background: #fff;
  color: #0d78ca;
  border: 1px solid ${ColorBlue};
  text-transform: normal;
`

export const GrayButton = styled(ButtonBig)`
  background: linear-gradient(135deg,#324b56,#324b56);
`

export const WhiteBlueButton = styled(Button)`
  background: #fff;
  color: #0d78ca;
`

export const WhiteButton = styled(Button)`
  background: #fff;
  color: #0d78ca;
`

export const ProcessBox = styled.div`
  padding: 5px;
  color: ${Gray};
  border-top: 2px solid ${ColorBlue};
  border-bottom: 1px solid ${ColorBlue};
  height: 180px;
  height: auto;
`

export const LandingRowInner = styled(FlexRow)`
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 25px;
  margin-bottom: 150px;
`

export const PageRow = styled(FlexRow)`
  z-index: 1;
  justify-content: center;
`

export const PageRowWhite = styled(PageRow)`
  padding-top: 80px;

  &:last-of-type {
    padding-bottom: 100px;
  }

  @media (max-width: 830px) {
   padding-top: 50px; 
  }
`

export const PageRowMaxWidth = styled(FlexColumn)`
  max-width: 1500px;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
`

export const SmallContentTitle = styled.div`
  font-weight: bold;
  color: ${ColorFontAccent};
  font-size: 1.2em;
`

export const ToolTip = styled.span`
  position: absolute;
  bottom: -1px;
  left: 0;
  border-bottom: 2px dashed #324b5690;
  width: 100%;
`

export const SmallContentTitleTooltip = styled(SmallContentTitle)`
  position: relative;
  cursor: help;
`

export const TitleTooltipLeasingPortal = styled(SmallContentTitleTooltip)`
    border-bottom: none;
    color: #fff;
    margin-bottom: 5px;
`
export const ItemTitle = styled(SmallContentTitleTooltip)`
  color: inherit;
  font-size: 12px;
  svg {
    color: gray;
    font-size: 7px;
    vertical-align: text-top;
    border: 1px solid #ddd;
    border-radius: 50%;
    padding: 1px;
    margin: 1px;
  }
`

export const ItemContent = styled.span`
  color: ${ColorDarkGrayText};
  size: 1em;
`

export const ToolTipLeasingPortal = styled.span`
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
`

export const TableRowLeasing = styled.div`
  justify-content: space-between;
  padding-left: 5px;
  display: grid;
  min-height: 60px;
  grid-gap: 0.75em;
  max-width: auto;
  margin: 8px 4px;
  font-size: 0.8em;
  background-color: ${ColorLeasingPortalTables};
  border: 1px solid ${ColorWhite};

  /* 1. Dashboard view */
  grid-template-columns: repeat(4, auto);
  grid-template-rows: repeat(1, 1fr); 
  grid-template-areas:"payee payFor buffer remove";
                      /* "payFor buffer remove"; */
                      
  @media( max-width: 465px) {
    /* 1. Dashboard view */
    grid-template-columns: repeat(3, 1fr); 
    grid-template-rows: 1fr; 
    grid-template-areas:"payer payee remove"; 
  }
`

export const TableRowLeasingBlacklist = styled.div`
  justify-content: space-between;
  display: grid;
  /* min-height: calc(100vh - 70px - 144px); */
  min-height: 60px;
  grid-gap: 0.8em;
  max-width: auto;
  margin: 8px;
  font-size: 0.75em;
  background-color: ${ColorLeasingPortalTables};
  border: 1px solid ${ColorWhite};
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(1, 1fr); 
  grid-template-areas:"payer payee remove";
`

export const TableRowLeasingTxHistory = styled.div`
  justify-content: space-between;
  display: grid;
  /* min-height: calc(100vh - 70px - 144px); */
  min-height: 40px;
  grid-gap: 0.8em;
  max-width: auto;
  margin: 8px;
  font-size: 0.75em;
  background-color: ${ColorLeasingPortalTables};
  border: 1px solid ${ColorWhite};
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(1, 1fr); 
  grid-template-areas:"tx date accountColumn event1 event2 event3 event4";
`

export const TxRowLeasing = styled.div`
  font-weight: bold;
  grid-area: tx;
  padding: 5px;
  padding-left: 10px;
  margin: 5px;
  border-right: 1px solid #fff;
  width: 55px;
  a {
    color: ${ColorWhite};
  }
`

export const DateRowLeasing = styled.div`
  font-weight: bold;
  grid-area: date;
  margin: auto;
`

export const PayerRowLeasing = styled.div`
  font-weight: bold;
  grid-area: payer;
  margin: auto 0;
  border-right: 1px solid ${ColorWhite};
  padding: 5px;
`

export const PayeeRowLeasing = styled.div`
  font-weight: bold;
  grid-area: payee;
  border-right: 1px solid ${ColorWhite};
  margin: auto;
  padding-left: 10px;
  padding-right: 5px;
`

export const PayForRowLeasing = styled.div`
  font-weight: bold;
  grid-area: payFor;
  padding-left: 25px;
`

export const BufferRowLeasing = styled.div`
  font-weight: bold;
  grid-area: buffer;
  padding-left: 25px;
`

export const RemoveRow = styled.button`
  background-color: ${ColorWhite};
  border: none;
  cursor: pointer;
  border-radius: 50%;
  color: ${ColorRed};
`

export const EventOneLeasing = styled.div`
  margin: 5px;
  font-weight: bold;
  grid-area: event1;
  font-size: 1.2em;
`
export const EventTwoLeasing = styled.div`
  margin: 5px;
  font-weight: bold;
  grid-area: event2;
  font-size: 1.2em;
`

export const ItemExpandedContainer = styled(FlexColumn)`
  width: 50vw;
  max-height: 500px;
  box-shadow: 0 0 100px rgba(0, 0, 0, 0.14);
  background-color: #ffffff;
  position: fixed;
  z-index: 999;
  left: 25vw;
  top: calc(40vh - 225px);
  border-radius: 3px;
  transition: transform 0.35s;
  will-change: transform;
  /* transition: visibility 0s ease ; */
  justify-content: center;
  overflow: scroll;

  @media (min-width: 1100px) {
  padding: 30px 50px;
  }

  @media (max-width: 1100px) {
    width: 80vw;
    height: calc(90% - 70px);
    left: 10vw;
    top: 70px;

  }
  @media (max-width: 660px) {
    width: 80%;
    left: 10%;
    height: 75%;
    align-items: center;
    justify-content: flex-start;
    padding-top: 10px;
    padding-bottom: 10px;
  }
`

export const ModalBoxInnerContent = styled(FlexColumn)`
  justify-content: flex-start;
  align-items: center;
  min-height: 200px;
  @media (max-width: 650px) {

    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 10%;
    align-items: center;
    padding: 0;
  }
`

export const ModalBoxMainContent = styled(FlexRow)`
min-width: 80%;
@media (max-width: 960px) {
  flex-direction: column;
}
`

export const CTALink = styled.a`
  padding: 10px 15px;
  margin-left: 10px;
  align-items: center;
  text-decoration: none;
  font-size: 14px;
  box-shadow: 3px 3px 13px rgba(0, 0, 0, 0.14);
  border: 0px solid #dfe3e9;
  background-color: #0c78ca;
  shadow: 2px;
  border-radius: 25px;
  text-transform: none;
	font-family: PoppinsSemiBold;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0vw;
	color: #fff;
`

export const ContactLink = styled(CTALink)`
  background: #fff;
  color: #0d78ca;
`

export const CTASection = styled(FlexRow)`
  align-items: center;
  margin-top: 20px;
  padding-bottom: 40px;
  @media(max-width:660px){
    flex-wrap: wrap;
    align-self: center;
    a {
      margin: 10px 10px;
      padding: 10px;
      text-align: center;
    }
  }
`

export const XButtonSection = styled.div`
  width: 20px;
  margin: -5px -20px 10px 0;
  align-self: flex-end;
  @media (max-width: 960px) {
    margin: 3px 10px 10px 0;
  }
`

export const XButton = styled(FlexColumn)`
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 50%;
  border: 2px solid black;
  background: #8392a5;
  overflow:hidden;
  font-family: PoppinsLight;
  transition: 0.3s;
  align-items: center;
  justify-content: center;
  span{
    padding-top: 100%;
    text-align：center;
    z-index:1;
    font-size: 16px;
    color: #ddd;
  }
`

export const ModalBoxLeftColumn = styled(FlexColumn)`
  align-items: center;
  justify-content: center;
  h1 {
    margin-top: 1em;
    color: #222b2c;
    font-family: PoppinsLight;
    font-size: 24px;
    line-height: 32px;
    text-align:center;
  }
  h2 {
    color: #0d78ca;
    font-family: PoppinsLight;
    font-size: 18px;
    text-align:center;
    line-height: 30px;
  }
  h4 {
    width: 20vw;
    color: #8392a5;
    font-family: PoppinsLight;
    font-size: 18px;
    font-weight: 400;
    text-align:center;
  }
  @media(min-width: 960px) {
    align-items: flex-end;
    min-width: 30%;
    h1,h2,h4{
      text-align: right;
    }
  }
  @media(max-width: 960px) {
    padding: 10px;
    min-height: 265px;
    h1 {
      color: #222b2c;
      font-family: PoppinsLight;
      font-size: 1em;
      line-height: 1em;
      text-align: center;
    }
    h2 {
      color: #0d78ca;
      font-family: PoppinsLight;
      font-size: 0.8em;
      line-height: 1.5em;
    }
    h4 {
      font-size: 12px;
      height: auto;
    }
  }
`

export const ModalBoxRightColumn = styled(FlexColumn)`
padding: 10px 5px 20px 10px;
p{
  color: #8392a5;
  font-family: PoppinsLight;
  font-size: 1em;
  font-weight: 400;
  line-height: 25px;
  margin-left: 20px;
  margin-top: 0;

}
@media(max-width: 740px) {
  padding: 20px;
  margin: 0 10px;
}

@media(max-width: 495px) {
  font-size: 1em;
}

@media(min-width: 960px) {
  align-items:flex-start;
  text-align:left;
  margin-left: 30px;
  min-width: 70%;
  position: relative;
}

@media all and(orientation: landscape) and(max-width: 660px) {
  font-size: 0.7em;
  text-align:center;
  p {
    margin-left: 10px;
    line-height: 20px;
  }
}
`
export const ARMInputContainer = styled(FlexColumn)`
    margin: 15px 0;
    display: flex;
    justify-content: space-between;

    input, select {
        height: 24px;
        width: 110px;
        border:none;
        padding-left: 5px;
        background-color: #eee;
        border-radius: none;
        border-bottom: 1px solid ${ColorDarkGrayText};

        :invalid {
            background-color: ${ColorRed};
        }
    }
`

export const DataTitle = styled.th`
    font-size: 1em;
    padding: 2px 3px;
    font-weight: normal;
    /* min-width: 8%; */
`

export const DataCell = styled.td`
    font-family: sans-serif !important;
    font-size: inherit;
    /* min-width: 8%; */
    padding: 2px 3px;
    a {
      text-decoration: none;
      color:${ColorDarkGrayText};
    }

    input {
      width: 100px;
      font-family: sans-serif !important;
      background-color: ${ColorInputBackgroundLightGray};
      border: none;
      border-bottom: 1px solid ${ColorInputBorder};
    }
`

export const ConfigRow = styled.tr`
/* width: 100%;
align-content: space-evenly; */
align-items: center;
padding-bottom: 6px;
border-bottom: 1px solid ${ColorLeasingPortalPanelTrim};
`

export const TableHeader = styled.h3`
    margin: 0;
    text-transform: normal;
`
