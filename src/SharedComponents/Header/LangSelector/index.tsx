/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { FlexRow, FlexColumn } from "lib/GlobalStyles"
import styled from "styled-components"
import { FaGlobeAsia } from "react-icons/fa"

const LangSelectorContainer = styled(FlexColumn)`
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
  position: relative;
  margin-right: 5px;

  svg {
    font-size: 2em;
    color: #fff;

    &:hover {
      color: #687d86;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 8px 20px;
    white-space: nowrap;

    &:hover {
      background-color: #0d78ca50;
    }
  }
  @media(max-width:660px){
    margin-right: 10px;
  }
`
const LangTitle = styled(FlexRow)`
  align-items: center;
  width: 10vw;
  cursor:pointer;
  svg {
    margin-right: 10px;
  }
  font-size: 1em;
  @media(max-width: 1112px) {
    justify-content: center;
    color: black;
    width: 15vw;
    svg {
      color: black;
      font-size: 2.5em;
    }
  }
`
const LangSelectorMenu = styled.div`
  position: absolute;
  background-color: #046598;
  top: 40px;
  z-index: 15;
  transition: opacity 0.3s;
  opacity: ${(props: { langMenuExpanded: boolean }) => props.langMenuExpanded ? 1 : 0};
  visibility: ${(props: { langMenuExpanded: boolean }) => props.langMenuExpanded ? "visible" : "hidden"};
`

const LangSelectorLi = styled.li`
  border-left: ${(props: { isCurrentLang: boolean }) => props.isCurrentLang ? "5px solid #0d78ca" : "5px solid transparent"};
`

@inject("stores")
@observer
export class LangSelector extends Component<IStoreProps> {
  getLangItems = () => {
    return this.props.stores!.langStore.getAllLangs().map((e: string) => {
      return (
        <LangSelectorLi
          key={e}
          isCurrentLang={this.props.stores!.langStore.currentSelectedLang === e}
          onClick={() => { this.props.stores!.langStore.setLang(e); if (this.props.stores!.appStore.langMenuOpen) { this.props.stores!.appStore.toggleLangMenu() } }}
        >
          {this.props.stores!.langStore.getLangKeyNativeName(e)}
        </LangSelectorLi>
      )
    })
  }

  getLangTitle = () => {
    if (this.props.stores!.appStore.isMobile) {
      return (
        <LangTitle onClick={() => this.props.stores!.appStore.toggleLangMenu()}>
          <FaGlobeAsia />
        </LangTitle>)
    } else {
      return (
        <LangTitle onClick={() => this.props.stores!.appStore.toggleLangMenu()}>
          <FaGlobeAsia />
          <span>{this.props.stores!.langStore.safeGetLocalizedString("langselector.native")}</span>
        </LangTitle>)
    }
  }

  render() {
    return (
      <LangSelectorContainer>
        {this.getLangTitle()}
        <LangSelectorMenu langMenuExpanded={this.props.stores!.appStore.langMenuOpen}>
          <ul>{this.getLangItems()}</ul>
        </LangSelectorMenu>
      </LangSelectorContainer>
    )
  }
}
