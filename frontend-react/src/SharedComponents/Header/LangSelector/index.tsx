/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { FlexColumn } from "lib/GlobalStyles"
import styled from "styled-components"
import { FaGlobeAsia } from "react-icons/fa"

const LangSelectorContainer = styled(FlexColumn)`
  justify-content: center;
  cursor: pointer;
  position: relative;
  padding-right: 15px;

  svg {
    font-size: 2.3em;

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
    padding: 0px 20px;
    white-space: nowrap;

    &:hover {
      background-color: #0d78ca50;
    }
  }
`

const LangSelectorMenu = styled.div`
  position: absolute;
  background-color: #f7f9ff;
  top: 70px;
  z-index: 4;
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

  render() {
    return (
      <LangSelectorContainer>
        <FaGlobeAsia onClick={() => this.props.stores!.appStore.toggleLangMenu()} />
        <LangSelectorMenu langMenuExpanded={this.props.stores!.appStore.langMenuOpen}>
          <ul>{this.getLangItems()}</ul>
        </LangSelectorMenu>
      </LangSelectorContainer>
    )
  }
}
