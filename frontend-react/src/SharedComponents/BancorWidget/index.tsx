// https://widget-convert.bancor.network/
import React from "react"
import { ColorGreen } from "lib/GlobalStyles"
import styled from "styled-components"
// import BancorIcon from "./bancor_icon.png"

declare global {
    interface Window { BancorConvertWidget: any; }
}

// const WidgetContainer = styled.div`
//     color: #fff;
//     height: auto;
//     width: 100%;
//     border-radius: 8px;
//     background-color: #fff;
// `

// const BancorWidgetButton = styled.button`
//     width: 150px;
//     background: #000;
//     border-radius: 5px;
//     color: #fff;
//     border: none;
//     text-transform: uppercase;
//     font-weight: bold;
//     font-size: 0.9em;
//     text-align: center;
//     padding: 8px 0;
//     letter-spacing: 0.02em;
//     cursor: pointer;

//     @media( max-width: 465px) {
//         /* 1. Dashboard view */
//         width: 130px;
//     }
// `

// const BancorImg = styled.img`
//     width: 20%;
// `

const BancorWidgetContainer = styled.div`
    height: auto;
    width: 100%;
    border-radius: 0 0 8px 8px;
    background-color: #fff;
    margin-top: 0;
`

class BancorWidget extends React.Component {
    componentWillMount() {
    const bancorUrl = document.createElement('script');
    bancorUrl.setAttribute(
        'src', 
        'https://widget-convert.bancor.network/v1');
    
    // console.log(bancorUrl)
    document.body.appendChild(bancorUrl);

    const scriptInstance = {
        type: 1,
        baseCurrencyId: "5ca9c443b86b7f9c661bf0d6",
        pairCurrencyId: "5a1eb3753203d200012b8b75",
        primaryColor: ColorGreen,
        widgetContainerId: "bancor-wc-id-1",
        displayCurrency: "USD",
        hideVolume: true,
    }
    
    // console.log(window.BancorConvertWidget)

    const initBancor = () => {
        if (window.BancorConvertWidget) {
            return window.BancorConvertWidget.init(scriptInstance);
        }
    }

    let loaded = false;
    const load = () => {
        if (!loaded) {
            loaded = true;
            initBancor();
        }
    };

    //   bancorUrl.onreadystatechange = load;
      bancorUrl.onload = load;
    }

    render() {
        return ( 
            <>
            <BancorWidgetContainer className="bancor-wc" id="bancor-wc-id-1" />
        {/* <BancorWidgetButton onClick={() => window.BancorConvertWidget.showConvertPopup('buy')}>Buy on Bancor <BancorImg src={BancorIcon} /></BancorWidgetButton> */}
            </>
        )
    }
}
       
export default BancorWidget