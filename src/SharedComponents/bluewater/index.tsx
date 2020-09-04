/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import BlueWater from "./bluewaterdrop.svg"

const BlueWaterContainer = styled.div`
  z-index: -999;
  position: absolute;
  top: 0;
  right: 0;
  width: 40vw;
  pointer-events: none;
  opacity: 1;
  display: flex;
  @media screen and (max-width: 1112px) {
    display: none;
  }
`

const BlueWaterImage = styled.img`
  width: 100%;
  height: 100%;
  margin-left: auto;
`

@inject("stores")
@observer
export default class Bubbles extends Component<IStoreProps> {
  render() {
    {
      if (this.props.stores!.appStore.isMobile) {
        // hide background image
        return (<div></div>)
      } else {
        return (
          <BlueWaterContainer>
            <BlueWaterImage src={BlueWater} />
          </BlueWaterContainer>
        )
      }
    }
  }
}