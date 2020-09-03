/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import laptopScreenshot from "./laptop-720p.png"

const Screenshots = styled.div`
  grid-area: screenshots / screenshots / screenshots / screenshots;
  justify-self: center;
  align-self: center;
  z-index: 1;

  @media (max-width: 1050px) {
    justify-self: center;
    align-self: center;
  }
`

const LaptopScreenshot = styled.div`
  max-width: 700px;
`

@inject("stores")
@observer
export class ScreenshotsComponent extends Component<IStoreProps> {
  render() {
    return (
      <Screenshots>
        <LaptopScreenshot>
          <img width={"100%"} src={laptopScreenshot} />
        </LaptopScreenshot>
      </Screenshots>
    )
  }
}
