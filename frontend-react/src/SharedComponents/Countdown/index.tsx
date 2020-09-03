/*****************
 * Andrew Coutts
 * 2019
 * Credits: https://codepen.io/Libor_G/pen/JyJzjb
 *****************/
import styled from "styled-components"
import { FlexColumn, FlexRow } from "lib/GlobalStyles"

export const CountdownRow = styled(FlexRow)`
  justify-content: space-evenly;
  padding: 10px;
`

export const CountdownColumn = styled(FlexColumn)`
  align-items: center;
`

export const CountdownFooter = styled(FlexRow)`
  justify-content: center;
  text-align: center;
`

export const FlipUnitContainerDiv = styled(FlexColumn)`
  font-size: 4em;
  width: 100px;
  border: 1px solid #3b536d10;
  align-items: center;
  color: #3b536d;
  background-color: #ecf2f9;
  border-radius: 3px;

  @media (max-width: 550px) {
    width: 80px;
    font-size: 3.5em;
  }

  @media (max-width: 450px) {
    width: 60px;
    font-size: 3em;
  }

  @media (max-width: 375px) {
    width: 50px;
    font-size: 2.5em;
  }

  @media (max-width: 335px) {
    width: 40px;
    font-size: 2em;
  }
`
