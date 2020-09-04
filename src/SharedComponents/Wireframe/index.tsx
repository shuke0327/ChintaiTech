/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled, { keyframes } from "styled-components"

const Path = styled.path`
  transform: scale(1);
  rotate: (0deg);
  transform-origin: 50% 50%;
  transition: transform 600ms;
`

const RotateWireFrame = keyframes`
	0% {
		transform: perspective(700px) rotateY(0deg) rotateX(0);
	}

	33% {
		transform: perspective(700px) rotateY(120deg) rotateX(20deg);
	}

	67% {
		transform: perspective(700px) rotateY(240deg) rotateX(-20deg);
	}

	100% {
		transform: perspective(700px) rotateY(360deg) rotateX(0);
	}
`

const WireFrame = styled.div`
  transform: rotateY(50deg) rotateX(-25deg);
  transform-style: preserve-3d;
  animation: ${RotateWireFrame} 40s steps(300) infinite;

  top: 50%;
  position: absolute;
  left: 50%;
  width: 0px;
  height: 0px;
  font-size: 3em;
`

const WireFrameFace = styled.svg`
  position: absolute;
  left: 0;
  bottom: 0;
  transform-origin: 50% 50% 0;
  transform-style: preserve-3d;
  stroke: #00a6cc;
  stroke-width: 1.25;
  stroke-miterlimit: 0;
  stroke-linejoin: round;
  fill: rgba(227, 236, 249, 0.65);
  animation: hue 20s steps(10) infinite;
`

const WireFrameFaceBottom = styled(WireFrameFace)`
  width: 10em;
  height: 10em;
  top: -5em;
  left: -5em;
  transform-origin: 50% 50%;
  transform: translateY(4em) rotateX(90deg);
`

const WireFrameFaceBottomTriFront = styled(WireFrameFace)`
  transform: translateZ(2em) rotateX(-15deg);
  width: 10em;
  height: 10em;
  top: -5em;
  left: -5em;
  transform-origin: 50% 90%;
`

const WireFrameFaceBottomTriLeft = styled(WireFrameFace)`
  transform: rotateY(-120deg) translateZ(2em) rotateX(-15deg);
  width: 10em;
  height: 10em;
  top: -5em;
  left: -5em;
  transform-origin: 50% 90%;
`

const WireFrameFaceBottomTriRight = styled(WireFrameFace)`
  transform: rotateY(120deg) translateZ(2em) rotateX(-15deg);
  width: 10em;
  height: 10em;
  top: -5em;
  left: -5em;
  transform-origin: 50% 90%;
`

const WireFrameFaceTopTriBack = styled(WireFrameFace)`
  width: 10em;
  height: 13em;
  top: -8em;
  left: -5em;
  transform-origin: 50% 92%;
  transform: rotateY(60deg) translateZ(4em) rotateX(21deg);
`

const WireFrameFaceTopTriLeft = styled(WireFrameFace)`
  width: 10em;
  height: 13em;
  top: -8em;
  left: -5em;
  transform-origin: 50% 92%;
  transform: rotateY(180deg) translateZ(4em) rotateX(21deg);
`

const WireFrameFaceTopTriRight = styled(WireFrameFace)`
  width: 10em;
  height: 13em;
  top: -8em;
  left: -5em;
  transform-origin: 50% 92%;
  transform: rotateY(-60deg) translateZ(4em) rotateX(21deg);
`

@inject("stores")
@observer
export default class WireFrameComponent extends Component<IStoreProps> {
  render() {
    return (
      <WireFrame>
        <WireFrameFaceBottom viewBox="0 0 100 100">
          <Path d="M50 10 l34.5 60 l-69 0 z" />
        </WireFrameFaceBottom>
        <WireFrameFaceBottomTriFront viewBox="0 0 100 100">
          <Path id="bottom-tri" d="M50 30 l34.5 60 l-69 0 z" />
        </WireFrameFaceBottomTriFront>
        <WireFrameFaceBottomTriLeft viewBox="0 0 100 100">
          <use href="#bottom-tri" />
        </WireFrameFaceBottomTriLeft>
        <WireFrameFaceBottomTriRight viewBox="0 0 100 100">
          <use href="#bottom-tri" />
        </WireFrameFaceBottomTriRight>
        <WireFrameFaceTopTriBack viewBox="0 0 100 130">
          <path id="top-tri" d="M50 120 l-30.7 -62.5 l30.7 -50 l30.7 50 z" />
        </WireFrameFaceTopTriBack>
        <WireFrameFaceTopTriLeft viewBox="0 0 100 130">
          <use href="#top-tri" />
        </WireFrameFaceTopTriLeft>
        <WireFrameFaceTopTriRight viewBox="0 0 100 130">
          <use href="#top-tri" />
        </WireFrameFaceTopTriRight>
      </WireFrame>
    )
  }
}