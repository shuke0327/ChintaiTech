/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css";
// import Timeline from './Components/Timeline';
import { FlexColumn, FlexRow, ColorBlue } from "lib/GlobalStyles";
import bluePointImg from './blue-point.png';
import pointImg from './point.png';


export interface IRoadmapItem {
  date: string
  year: string
  content: string[]
}

// const FlexedTimeline = styled.div`
//   flex: 1;
//   align-self: center;
// `;

const TabsRoadmap = styled(Tabs)`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: transparent;
    margin-top: 10px;
    padding-top: 10px;
    width: 1024px;
    @media (max-width: 660px) {
      position: relative;
      align-items: center;
      margin-bottom: 10%;
    }
`

const RoadmapTablList = styled(TabList)`
  border-bottom: none;
  padding-left: 0;
  background: transparent;
  margin-bottom: 100px;
  li {
    transition: all 0.5s;
    background: transparent;
    position: relative;
    list-style-type: none;
    width: 120px;
    height: auto;
    text-align: center;
    border: 0;
    &.react-tabs__tab--selected {
      top: -10px;
      width: 85px;
      box-shadow: 0 9px 9px rgba(173,178,199,0.22);
      background-color: #ffffff;
      border-radius: 10px;
      padding-top: 20px;
      margin: 0px 0 -20px 0;
      vertical-align: middle;
      padding-bottom: 20px;
      @media(max-width:660px) {
        width: 13vw;
      }
    }
  }
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  height: 60px;
  box-shadow: -2px 2px 24px rgba(14, 104, 182, 0.54);
  border-radius: 20px;
  background-image: linear-gradient(79.56deg, #2596e0 0%, #0659a8 100%);
  @media(max-width: 660px) {
    li {
      width: 10vw;
    }
  }
`

const RoadmapContainer = styled(FlexColumn)`
  align-items:center;
  color: #fff;
  margin-top: 5vw;
  margin-bottom: 5vw;
  h2 {
    /* text-shadow: 1px 1px 1px rgba(56, 56, 56, 0.5); */
    margin: 0;
    font-size: 2.5em;
    text-align: center;
  }

  p {
    margin: 10px;
    font-size: 10px;
    color: black;
  }

  li {
    position: relative;
    list-style-type: none;
  }

  @media (max-width: 660px) {
    position: relative;
    align-items: center;
  }
`

const RoadmapItemDiv = styled.div`
  position: relative;
  margin-bottom: 0;
  padding-bottom: 0;
  top: 30px;
  padding: 20px;
  color: ${ColorBlue};
  padding-left: 0;
  margin-left: 18px;

  p {
    text-align: center;
    color: black;
    font-size: 10px;
  }
  ul {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  h2 {
    color: ${ColorBlue};
    line-height: 1;
    font-size: 15px;
    padding-left: 0;
    text-align: left;
    margin-left: -4px;
    padding: 10px 0 10px 0;
  }

  @media (max-width: 650px) {
    h2 {
      font-size: 2em;
    }
  }
`
const RoadmapContent = styled.div`
  width: 120px;
  margin: 10px  0px;
  position: relative;
  p{
    text-align: left;
    padding-left: 5px;
  }
  &:last-child {
    div &:after {
      content: none;
    }
  }
`

const RoadmapMarker = styled.div`
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 15px;
  &:before {
    content: "";
    width: 20px;
    height: 20px;
    position: absolute;
    background-image: url(${pointImg});
    opacity: 0.3;
    top: 0px; 
    left: -10px;
    background-size: cover;
    border-radius: 100%;
    display: block;
    transition: background 0.3s ease-in-out,
              border 0.3s ease-in-out;
  }
  &:after {
    opacity: 0.5;
    content: "";
    bottom: 0;
    width: 1px;
    background: #8387bf;
    display: block;
    position: absolute;
    top: 25px;
    bottom: 0;
    left: -1px;
  }
`

const RoadmapPanel = styled(TabPanel)`
  background: transparent;

  width: 100%;
  transition: 0.5s;
  transition-timing-function: ease-in;
  ul {
    flex-direction: row;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  li {
    width: 600px;
    height: 300px;
    &:: before {
      content: "";
      width: 30px;
      height: 30px;
      position: absolute;
      background-image: url(${ pointImg});
      left: 5px;
      background-size: cover;
      top: -20px;
    }
    &:nth-child(even){
      &:: before {
        background-image: url(${bluePointImg});
      }
    }

}
`

const RoadmapTimeline = styled.div`
width: 100%;
height: 10px;
border-bottom: 1px solid #8387bf;
position: absolute;
left: 0;
`

const MobileRoadPanel = styled(TabPanel)`
ul {
  flex-direction: column;
}
li {
  width: 80vw;
  height: auto;
}
p {
  padding-left: 10px;
  font-size: 18px;
  border-radius: 4px;
  background: #f5f5f5;
  box-shadow: 0 20px 25px-10px rgba(0, 0, 0, 0.3);
    &: nth-child(even) {
    background: ${ ColorBlue};
    color: white;
  };
}
`
const MobileLi = styled.li`
width: 80vw;
height: auto;
`

const MobileRoadmapItemDiv = styled.div`
background: white;
position: relative;
padding-left: 20px;

p {
  text-align: left;
  color: black;
  font-size: 18px;
  position: relative;
  padding: 10px 30px;
}
ul {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

h2 {
  color: ${ ColorBlue};
  line-height: 1;
  font-size: 2em;
  padding-left: 20px;
  text-align: left;
  background: white;
  padding-top: 0;
}

`

const MobileDetailBox = styled.div`
width: auto;
`

const MobileRoadmapMarker = styled.div`
position: absolute;
top: 0; bottom: 0; left: 0;
width: 15px;
  &: before {
  background: #8387bf;
  border: 3px solid transparent;
  border-radius: 100%;
  content: "";
  display: block;
  height: 15px;
  position: absolute;
  top: 4px; left: 0;
  width: 15px;
  transition: background 0.3s ease -in -out,
    border 0.3s ease -in -out;
}
  &: after {
  content: "";
  width: 5px;
  background: #CCD5DB;
  display: block;
  position: absolute;
  top: 30px;
  bottom: 0;
  left: 7px;
}
`
const TitleContent = styled(FlexRow)`
  position: relative;
`

const TitleMarker = styled.div`
  position: absolute;
  top: -30px;
  bottom: 40px;
  left: 0;
  width: 15px;
  &:before {
    opacity: 0.5;
    content: "";
    bottom: 0;
    width: 1px;
    background: #8387bf;
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: -1px;
  }
`

@inject("stores")
@observer
export default class Roadmap extends Component<IStoreProps> {
  getRoadmap = (year: string) => {
    try {
      const items = (this.props.stores!.langStore.safeGetLocalizedString("roadmap.items") as unknown as Array<IRoadmapItem>).filter((f: IRoadmapItem) => f.year === year)
      if (!items) { return null }
      return items.map((e: IRoadmapItem, i: number) => {
        if (this.props.stores!.appStore.isMobile) {
          return (
            <MobileLi key={e.date.replace(/\s/g, "").toLowerCase() + i}>
              <MobileRoadmapItemDiv>
                <h2>{e.date}</h2>
                <MobileDetailBox>
                  <MobileRoadmapMarker />
                  {e.content.map((itemInfo: string) => {
                    return (
                      <p>{itemInfo}</p>
                    )
                  })}
                </MobileDetailBox>
              </MobileRoadmapItemDiv>
            </MobileLi>
          )
        } else {
          return (
            <li key={e.date.replace(/\s/g, "").toLowerCase() + i}>
              <RoadmapItemDiv>
                <TitleContent>
                  <TitleMarker />
                  <h2>{e.date}</h2>
                </TitleContent>
                <div>
                  {
                    e.content.map((itemInfo: string, index: number) => {
                      return (
                        <RoadmapContent>
                          <RoadmapMarker />
                          <p>{itemInfo}</p>
                        </RoadmapContent>
                      )
                    })
                  }
                </div>
              </RoadmapItemDiv>
            </li>
          )
        }
      })
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    try {
      if (this.props.stores!.appStore.isMobile) {
        return (
          <RoadmapContainer>
            <TabsRoadmap defaultIndex={3}>
              <RoadmapTablList>
                <Tab>2018</Tab>
                <Tab>2019</Tab>
                <Tab>2020</Tab>
              </RoadmapTablList>
              <MobileRoadPanel>
                <ul>{this.getRoadmap('2018')}</ul>
              </MobileRoadPanel>
              <MobileRoadPanel>
                <ul>
                  {this.getRoadmap('2019')}
                </ul>
              </MobileRoadPanel>
              <MobileRoadPanel>
                <ul>
                  {this.getRoadmap('2020')}
                </ul>
              </MobileRoadPanel>
            </TabsRoadmap>
          </RoadmapContainer>
        )
      } else {
        return (
          <RoadmapContainer>
            <TabsRoadmap defaultIndex={3}>
              <RoadmapTablList>
                <Tab>2018</Tab>
                <Tab>2019</Tab>
                <Tab>2020</Tab>
              </RoadmapTablList>
              <RoadmapPanel>
                <RoadmapTimeline />
                <ul>{this.getRoadmap('2018')}</ul>
              </RoadmapPanel>
              <RoadmapPanel>
                <RoadmapTimeline />
                <ul>
                  {this.getRoadmap('2019')}
                </ul>
              </RoadmapPanel>
              <RoadmapPanel>
                <RoadmapTimeline />
                <ul>
                  {this.getRoadmap('2020')}
                </ul>
              </RoadmapPanel>
            </TabsRoadmap>
          </RoadmapContainer>
        )
      }
    } catch (e) {
      return null
    }
  }
}
