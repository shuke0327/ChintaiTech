import React, { Component } from "react"
import IStoreProps from "lib/Props"
import styled from "styled-components"
import { observer, inject } from "mobx-react"
import { ColorDarkGreen, ColorGreenLight, Gray } from "lib/GlobalStyles"


const TableHeader = styled.th`
    font-size: 1.5em;
    color: ${ColorDarkGreen};
   /* // padding: 25px; */
    padding-bottom: 5px;

    :not(:first-child) {
        padding-left: 25px;
    }
    
`

const TableRow = styled.tr`

    td {
        text-align: left;
        color: ${ColorGreenLight};
        :not(:first-child) {
        padding-left: 25px;
        }
        
        img {
            width: 27px;
            height: 30px;
        }
    }
    td:first-child {
        color: ${Gray};
    }

`

interface IFeeItem {
    symbol: string;
    title: string;
    fee: string;
    text: string;
    link: string;
  }


@inject("stores")
@observer
export default class LandingContent extends Component<IStoreProps> {

 
    renderFeeSchedule() {
        return (this.props.stores!.langStore.safeGetLocalizedString("feeSchedule") as unknown as Array<IFeeItem>).map((e: IFeeItem) => {
            return (            
                <TableRow key={`asset-${e.title}`}>
                    <td style={{fontWeight: "bold", fontSize: "2rem"}}><img src={require( `${e.symbol}` )} alt="asset symbol"/> {e.title}</td>
                    <td style={{fontWeight: "bold", fontSize: "2rem"}}>{e.fee}</td>
                    {/* <td>       
                        <Link to={`/${e.link}`}>
                            {e.text}
                        </Link>
                    </td>      */}
                </TableRow>          
            )          
        })
    }
    

    render() {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            {/* <TableHeader>{this.props.stores!.langStore.safeGetLocalizedString("feeScheduleHeaders.symbol")}</TableHeader> */}
                            <TableHeader>{this.props.stores!.langStore.safeGetLocalizedString("feeScheduleHeaders.token")}</TableHeader>
                            <TableHeader>{this.props.stores!.langStore.safeGetLocalizedString("feeScheduleHeaders.rate")}</TableHeader>
                            {/* <TableHeader>{this.props.stores!.langStore.safeGetLocalizedString("feeScheduleHeaders.buy")}</TableHeader> */}
                       </tr>
                    </thead>
                    <tbody>
                    {this.renderFeeSchedule()}
                    </tbody>
                </table>
            </div>

        )
    }
}