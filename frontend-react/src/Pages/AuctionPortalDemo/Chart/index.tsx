/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { IslandContainer, IslandContent } from "lib/GlobalStyles"

const ChartContainer = styled(IslandContainer)`
  grid-area: chart / chart / chart / chart;
  z-index: 1;
  padding: 5px;
  overflow: hidden;
`

const ChartIslandContent = styled(IslandContent)`
  height: calc(100% + 33px);
  bottom: 0;
  position: absolute;
  width: calc(100% - 10px);
`

const TvChartDiv = styled.div`
  height: 100%;
`

const LeftBorder = styled.div`
  background: #f7faff;
  position: absolute;
  width: 5px;
  height: 100%;
  left: -5px;
`

const RightBorder = styled(LeftBorder)`
  left: initial;
  right: -5px;
`

const TopBorder = styled(LeftBorder)`
  width: 100%;
  height: 5px;
  left: initial;
  top: 33px;
`

const BottomBorder = styled(LeftBorder)`
  width: 100%;
  height: 5px;
  left: initial;
  bottom: 0px;
`

@inject("stores")
@observer
export default class Chart extends Component<IStoreProps> {
  componentDidMount() {
    this.props.stores!.chartStore.createTvChart()
  }

  componentWillUpdate() {
    if (window.tvWidget) {
      window.tvWidget.setLanguage(
        this.props.stores!.langStore.safeGetCurrentLang
      );
    }
  }

  componentWillUnmount() {
    this.props.stores!.chartStore.updateTvChartRef(null)
  }

  render() {
    return (
      <ChartContainer>
        <ChartIslandContent>
          <TvChartDiv id={this.props.stores!.chartStore.widgetOptions.container_id} />
          <LeftBorder />
          <RightBorder />
          <TopBorder />
          <BottomBorder />
        </ChartIslandContent>
      </ChartContainer>
    )
  }
}
