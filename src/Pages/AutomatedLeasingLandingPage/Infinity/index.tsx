/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"

const InfinityContainer = styled.div`
  embed {
    width: calc(100vw - 30px);
    height: 50vw;
    max-height: 500px;
  }
`

@inject("stores")
@observer
export default class Infinity extends Component<IStoreProps> {
  render() {
    return (
      <InfinityContainer>
        <embed src={"/infinity"} />
      </InfinityContainer>
    )
  }
}
