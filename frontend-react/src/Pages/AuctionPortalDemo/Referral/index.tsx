/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { IslandContainer, IslandButton, FlexRow, ColorDarkGrayText, ColorWhite, Button } from "lib/GlobalStyles"
import { FaCopy } from "react-icons/fa"

const TosContent = styled(IslandContainer)`
  grid-area: referral / referral / referral / referral;
  z-index: 1;

  h4 {
    text-align: center;
    margin: 5px 0px;
  }

  h5 {
    margin: 0;
  }

  input {
    margin-right: 10px;
    flex: 0 0 25px;
  }

  ${IslandButton} {
    bottom: 15px;
    right: 15px;

    @media (max-width: 900px) {
      position: inherit;
      width: 100%;
      justify-content: center;
      right: inherit;
      bottom: inherit;

      button {
        margin-left: 0;
      }
    }
  }
`
const LoginButtonRow = styled(FlexRow)`
  /* flex: 0 1 230px; */
  justify-content: center;
  padding: 10px 0px;
`

const CopyButton = styled(Button)`
  border: none;
  color: ${ColorWhite};
  border-radius: 0 5px 5px 0;
  display: inline;
  padding: 3px;
  margin-left: 0px;
  font-size: 1em;
  cursor: pointer;
`

const RefText = styled.input`
  border: 1px solid black;
  border-right: none;
  border-radius: 5px 0 0 5px;
  color: ${ColorDarkGrayText};
  background-color:transparent;
  display: inline;
  font-size: 1em;
  padding-left: 5px;
  padding-right: 5px;
  margin-right: 0;
`

@inject("stores")
@observer
export default class Referral extends Component<IStoreProps> {

  render() {

    function copyFunction() {
      /* Get the text field */
      var copyText = document.getElementById("myInput") as HTMLInputElement;
    
      /* Select the text field */
      copyText!.select(); 
      copyText!.setSelectionRange(0, 99999); /*For mobile devices*/
    
      /* Copy the text inside the text field */
      document.execCommand("copy");
    
      /* Alert the copied text */
      var copyButton = document.getElementById("copyButton") as HTMLDivElement;
      copyButton.style.backgroundColor === "green";
    }

    return (
      <React.Fragment>
        <TosContent>
          {this.props.stores!.walletStore.userLoggedIn ? 
                  <LoginButtonRow>
                    <FlexRow style={{paddingRight: "10px", fontWeight: "bold"}}>
                      {this.props.stores!.langStore.safeGetLocalizedString("referralShare")}:
                    </FlexRow>
                  {this.props.stores!.walletStore.userLoggedIn ? 
                  <><RefText style={{marginRight: 0}} type="text" value={`www.chintai.io/auction?ref=${this.props.stores!.walletStore.currentUserAccountName}`} id="myInput"></RefText> 
                  <CopyButton id="copyButton" onClick={() => copyFunction()}>Copy <FaCopy /></CopyButton></> : null }
                  </LoginButtonRow>
            :
              <LoginButtonRow style={{fontWeight: "bold"}}>
                {/* login to gener/ate referral link  */}
              {this.props.stores!.langStore.safeGetLocalizedString("referral")}
              </LoginButtonRow>
        }

        
        </TosContent>
        {/* <GlobalStyle tosFocused={this.props.stores!.appStore.tosMouseFocused} /> */}
      </React.Fragment >
    )
  }
}
