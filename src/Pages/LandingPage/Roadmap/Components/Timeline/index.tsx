import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import IStoreProps from "lib/Props"
import HorizontalTimeline from "react-horizontal-timeline"

const EXAMPLE = [
  {
    data: "2018-03-22",
    status: "status",
    statusB: "Ready for Dev",
    statusE: "In Progress"
  },
  {
    data: "2018-03-23",
    status: "status",
    statusB: "In Progress",
    statusE: "Done"
  },
  {
    data: "2018-04-23",
    status: "status",
    statusB: "In Progress",
    statusE: "Done"
  },
  {
    data: "2018-05-23",
    status: "status",
    statusB: "In Progress",
    statusE: "Done"
  },
  {
    data: "2019-05-23",
    status: "status",
    statusB: "In Progress",
    statusE: "Done"
  },
  {
    data: "2019-05-23",
    status: "status",
    statusB: "In Progress",
    statusE: "Done"
  }
]




export interface Props {
  name: string
  enthusiasmLevel?: number
}

// helpers

// function getExclamationMarks(numChars: number) {
//   return Array(numChars + 1).join('!')
// }

@inject("stores")
@observer
export default class Timeline extends Component<IStoreProps, { curIdx: number, prevIdx: number }> {
  constructor(props: IStoreProps) {
    super(props)
    this.state = {
      curIdx: 0,
      prevIdx: -1
    }
  }

  render() {
    const curIdx: number = this.state.curIdx
    const prevIdx: number = this.state.prevIdx
    const curStatus: string = EXAMPLE[curIdx].statusB
    const prevStatus: string = prevIdx >= 0 ? EXAMPLE[prevIdx].statusB : ''

    return (
      <div>
        <div
          style={{
            width: "80vw",
            height: "100px",
            margin: "0 auto",
            marginTop: "20px",
            fontSize: "15px"
          }}
        >
          <HorizontalTimeline
            styles={{
              background: "#fff",
              foreground: "#1A79AD",
              outline: "#dfdfdf"
            }}
            index={this.state.curIdx}
            values={EXAMPLE.map(x => x.data)}
            indexClick={(index: any) => {
              this.setState({ curIdx: index, prevIdx: index - 1 })
            }}
          />
        </div>
        <div className="text-center" style={{ color: '#000' }}>
          {/* any arbitrary component can go here */}
          {curStatus} - {prevStatus}
        </div>
      </div>
    )
  }
}