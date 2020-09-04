import React from "react"
import { IProjectDetail } from "stores/ProjectsStore"
import styled from "styled-components"
import { FlexColumn, FlexRow } from "lib/GlobalStyles"
import commaNum from "comma-number"


const DetailsColumn = styled(FlexColumn)`
    font-size: 12px;
`

const ItemColumn = styled(FlexColumn)`
    margin: 0 10px 5px 10px;
`
const DescriptionColumn = styled(FlexColumn)`
    margin: 0 10px 5px 10px;

    span {
        span {
            margin-right: 5px;
            font-weight: bold; 
            font-size: 14px;
        }
    }
`

const Item = styled(FlexRow)`
    flex-flow: nowrap;
    margin-right: 25px;
    
    span {
        span {
            margin-right: 5px;
            font-weight: bold;
            font-size: 14px;
        }
    }

    a {
        color: inherit;
    }
`



const Details = (props: {data: IProjectDetail, isMobile: boolean}) => {
    return (
        <DetailsColumn>
            <FlexRow>
                <ItemColumn>
                    <Item>
                        <span><span>Name:</span>{props.data.name}</span>
                    </Item>
                    <Item>        
                        <span><span>Symbol:</span>{props.data.symbol}</span> 
                    </Item>
                    <Item>        
                        <span><span>Supply:</span>{commaNum(props.data.supply)}</span> 
                    </Item>
                    <Item>        
                        <a href={props.data.website} target="_blank"><span><span>Website</span></span></a> 
                    </Item>
                </ItemColumn>
                {props.isMobile ? null : 
                <DescriptionColumn>
                    <span><span>Description:</span>{props.data.description}</span>
                </DescriptionColumn>
                }
            </FlexRow>
        </DetailsColumn>
    )
}

export default Details
