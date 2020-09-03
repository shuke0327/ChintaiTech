/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
// import laptopScreenshot from "./laptop.png"
import exchangeImg from "./dex.png"

const Screenshots = styled.div`
  grid-area: screenshots;
  z-index: 1;
  height: 30vw;
  @media (max-width: 1112px) {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items:center;
  }
`

const LaptopScreenshot = styled.div`
  img {
    width: 37vw;
    height: 24vw;
  }
  @media (max-width: 660px) {
    img { width: 80vw; height: auto; }
  }
`

@inject("stores")
@observer
export class ScreenshotsComponent extends Component<IStoreProps> {
  render() {
    return (
      <Screenshots>
        <LaptopScreenshot>
          <img src={exchangeImg} />
        </LaptopScreenshot>
      </Screenshots>
    )
  }
}
