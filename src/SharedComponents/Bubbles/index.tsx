/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import BubblePattern from "./header-bubble-mask.svg"

const BubblesContainer = styled.div`
  z-index: 0;
  position: absolute;
  top: 30vw;
  width: 100vw;
  height: 100%;
  pointer-events: none;
  opacity: 0.55;
`

const BubblesImage = styled.img`
  position: absolute;
  bottom: 50%;
  left: 0;
  width: auto;
  height: 400%;
  top: -50%;
  margin-bottom: -50%;
`

@inject("stores")
@observer
export default class Bubbles extends Component<IStoreProps> {
  render() {
    return (
      <BubblesContainer>
        <BubblesImage src={BubblePattern} />
      </BubblesContainer>
    )
  }
}