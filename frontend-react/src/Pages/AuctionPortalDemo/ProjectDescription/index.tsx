import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { IslandContainer, IslandContent, FlexColumn } from "lib/GlobalStyles"
import WorbliTextImg from "lib/worbli_logo_text.png"
// import MyntLogo from "lib/mynt-logo.svg"
import Details from "./Details"
import { ColorLightGray } from "lib/colors"

const ProjectHeaderContainer = styled(IslandContainer)`
  grid-area: project / project / project / project;
  padding: 5px 15px;

  h1 {
    margin: 0;
    line-height: 1;
  }

  svg {
    margin-right: 10px;
    font-size: 1.5em;
  }
`

const ProjectImg = styled(FlexColumn)`
    border-right: 1px solid ${ColorLightGray};
    margin: 0 5px;
    padding-right: 25px;

  img {
    width: ${(props: {isMobile: boolean}) => props.isMobile ? "200px" : "250px"};
    height: auto;
  }
`

// const MyntImg = styled(FlexColumn)`

//   img {
//     width: 250px;
//     height: auto;
//   }
// `

@inject("stores")
@observer
export default class ProjectDescription extends Component<IStoreProps> {

  render() {
      return (
        <ProjectHeaderContainer>
          <IslandContent style={{flexDirection: "row"}}>
              <ProjectImg isMobile={this.props.stores!.appStore.isMobile}>
              <img src={WorbliTextImg} alt="" />
              </ProjectImg>
              {/* <MyntImg>
              <img src={MyntLogo} alt=""/>
              </MyntImg> */}
              <FlexColumn>
                  <Details data={this.props.stores!.projectsStore.projectDetails} isMobile={this.props.stores!.appStore.isMobile} />
              </FlexColumn>
          </IslandContent>
        </ProjectHeaderContainer>
      )
  }
}
