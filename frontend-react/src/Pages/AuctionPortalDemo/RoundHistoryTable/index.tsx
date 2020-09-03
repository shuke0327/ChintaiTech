/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled, { createGlobalStyle } from "styled-components"
import { IslandContainer, IslandContent, FlexColumn } from "lib/GlobalStyles"
import { Table, Column, AutoSizer } from "react-virtualized"
import { ColorFontAccent } from "lib/colors"
import * as moment from "moment"

const PriceTableContainer = styled(IslandContainer)`
  grid-area: priceTable / priceTable / priceTable / priceTable;
  z-index: 1;
`

const AutoSizerContainer = styled.div`
  flex: 1 1 auto;
  line-height: 1;
`

const FixedHeightIslandContent = styled(IslandContent)`
  height: 100%;
`

const GlobalStyle = createGlobalStyle`
  .ReactVirtualized__Table__headerRow {
    border-bottom: 1px solid #324b5630;
    padding: 5px 0px;
    font-size: 1.2em;
    display: flex;
    color: ${ColorFontAccent};
    align-items: center;
    text-transform: none!important;
  }

  .ReactVirtualized__Table__Grid {
    outline: none;
  }
`

const NoRowsMsg = styled(FlexColumn)`
  align-items: center;
  margin-top: 10px;
  color: #324B5690;
`

@inject("stores")
@observer
export default class RoundHistoryTable extends Component<IStoreProps> {
  componentWillUnmount() {
    this.props.stores!.appStore.bidsTableRef = null
  }

  render() {
    return (
      <React.Fragment>
        <PriceTableContainer>
          <FixedHeightIslandContent>
            <AutoSizerContainer>
              <AutoSizer
                ref={(ref) => { if (ref) { this.props.stores!.appStore.bidsTableRef = ref } }}
              >
                {({ height, width }: { height: number, width: number }) => {
                  return (
                    <Table
                      // ref={(ref) => { if (ref) { this.props.stores!.appStore.bidsTableRef = ref } }}
                      width={width}
                      height={height}
                      headerHeight={20}
                      rowHeight={35}
                      noRowsRenderer={() => <NoRowsMsg>{this.props.stores!.langStore.safeGetLocalizedString("priceHistory.noRounds")}</NoRowsMsg>}
                      rowStyle={({ index }: { index: number }) => index === 0 && !this.props.stores!.appStore.isAuctionEnded ? { backgroundColor: "#00cc8150", fontWeight: "bold" } : index > -1 && index % 2 ? { backgroundColor: "#0d78ca10" } : { backgroundColor: "transparent" }}
                      rowCount={this.props.stores!.appStore.auctionRoundsSummaryArray.length}
                      rowGetter={({ index }) => {
                        if (index === 0) {
                          return {
                            roundNum: this.props.stores!.appStore.auctionRoundsSummaryArray.slice().reverse()[index].roundNum,
                            chexPrice: !this.props.stores!.appStore.isAuctionEnded ? this.props.stores!.langStore.safeGetLocalizedString("priceHistory.inProgress").toUpperCase() : parseFloat(this.props.stores!.appStore.auctionRoundsSummaryArray.slice().reverse()[index].chexPrice).toFixed(8),
                            endTime: moment.utc(this.props.stores!.appStore.auctionRoundsSummaryArray.slice().reverse()[index].endTime).format("MM/DD H:mm")
                          }
                        } else {
                          return {
                            roundNum: this.props.stores!.appStore.auctionRoundsSummaryArray.slice().reverse()[index].roundNum,
                            chexPrice: parseFloat(this.props.stores!.appStore.auctionRoundsSummaryArray.slice().reverse()[index].chexPrice).toFixed(8),
                            endTime: moment.utc(this.props.stores!.appStore.auctionRoundsSummaryArray.slice().reverse()[index].endTime).format("MM/DD H:mm")
                          }
                        }
                      }}
                    >
                      <Column
                        width={500}
                        label={this.props.stores!.langStore.safeGetLocalizedString("priceHistory.roundNum")}
                        dataKey="roundNum"
                        style={{ textAlign: "center" }}
                        headerStyle={{ textAlign: "center" }}
                      />
                      <Column
                        width={500}
                        label={`${this.props.stores!.projectsStore.projectDetails.symbol}/EOS Price`}
                        dataKey="chexPrice"
                        style={{ textAlign: "center" }}
                        headerStyle={{ textAlign: "center" }}
                      />
                      {width < 350 ? null : <Column
                        width={500}
                        label={`${this.props.stores!.langStore.safeGetLocalizedString("priceHistory.date")} (UTC)`}
                        dataKey="endTime"
                        style={{ textAlign: "center" }}
                        headerStyle={{ textAlign: "center" }}
                      />}
                    </Table>
                  )
                }}
              </AutoSizer>
            </AutoSizerContainer>
          </FixedHeightIslandContent>
        </PriceTableContainer>
        <GlobalStyle />
      </React.Fragment >
    )
  }
}
