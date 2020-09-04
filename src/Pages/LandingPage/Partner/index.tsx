/*****************
 * Kai
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { FlexRow } from "lib/GlobalStyles"
// import { Link } from "react-router-dom"
import pixeos from "./pixeos.png"
import boid from "./boid.png"
import dGoods from "./dgoods.png"
import simpleAssets from "./simpleassets.svg"
import decentranet from "./decentranet.png"
import worbli from "./worbli.png"
import PinsentMasons from "./PinsentMasons.png"

const PartnerContainer = styled(FlexRow)`
  align-items: center;
  flex-wrap: wrap;
  margin-top: 50px;
  justify-content: space-evenly;

  div {
    margin: 20px 30px;
  }

@media(max-width: 830px) {
  flex-direction: column;

  div {
    margin-right: initial;
    margin-left: initial;
    margin-bottom: 20px;

      &:last-of-type {
      margin-bottom: initial;
    }
  }
}
`

const PartnerImgVertical = styled.img`
height: 120px;

@media(max-width: 660px) {
  height: 100px;
}
`
const PartnerImgHorizontal = styled.img`
width: 150px;

@media(max-width: 660px) {
  width: 125px;
}
`

@inject("stores")
@observer

export default class Partner extends Component<IStoreProps> {
  render() {
    return (
      <PartnerContainer>
        <div>
          <a href="https://www.pinsentmasons.com/" target="_blank">
            <PartnerImgHorizontal src={PinsentMasons} />
          </a>
        </div>
        <div>
          <a href={"https://medium.com/dgoods/introducing-dgoods-7204a90193f4"} target={"_blank"}>
            <PartnerImgHorizontal src={dGoods} />
          </a>
        </div>
        <div>
          <a href={"https://medium.com/@cryptolions/introducing-simple-assets-b4e17caafaa4"} target={"_blank"}>
            <PartnerImgHorizontal src={simpleAssets} />
          </a>
        </div>
        <div>
          <a href={"https://worbli.https://medium.com/@WORBLI/chintai-services-coming-to-the-worbli-network-4b6de8d5dfaf/"} target={"_blank"}><PartnerImgHorizontal src={worbli} /></a>
        </div>
        <div>
          <a href={"https://medium.com/decentranet/blockchain-inews-decentranet-announces-advisory-with-chintai-a-tokenized-asset-leasing-exchange-7f51cf36d7c1"} target={"_blank"}><PartnerImgHorizontal src={decentranet} /></a>
        </div>
        <div>
          <a href={"https://medium.com/@ChintaiEOS/boid-chintai-form-strategic-partnership-dcb2bc3e556f"} target={"_blank"}><PartnerImgHorizontal src={boid} /></a>
        </div>
        <div>
          <a href={"https://medium.com/@ChintaiEOS/pixeos-and-chintai-partnership-9f38490f4256"} target={"_blank"}><PartnerImgVertical src={pixeos} /></a>
        </div>
      </PartnerContainer>
    )
  }
}