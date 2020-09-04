/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React from "react"
import styled from "styled-components"
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaReceipt } from "react-icons/fa"
import { FlexColumn, FlexRow, ColorGreen, ColorBlueLight, ColorRed, ColorInputBackgroundGray } from "lib/GlobalStyles"

const Icon = styled(FlexColumn)`
  margin-right: 8px;
  font-size: 1.3em;
`

const IconSuccess = styled(Icon)`
  color: ${ColorGreen};
`

const IconError = styled(Icon)`
  color: ${ColorRed};
`

const IconInfo = styled(Icon)`
  color: ${ColorBlueLight};
`

const NotificationRow = styled(FlexRow)`
  align-items: center;
  font-size: 1.1em;
`

const TxIdLinkContainer = styled(FlexColumn)`
  justify-content: center;
  font-size: 1.4em;
`

const TxIdLink = styled.a`
  color: ${ColorInputBackgroundGray};
`

const CenterRow = styled(FlexRow)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

const ChexFeesIcon = styled(Icon)`
  color: ${ColorGreen};
`

export const Success = (props: { msg: string }) => {
  return (
    <NotificationRow>
      <IconSuccess>
        <FaCheckCircle />
      </IconSuccess>
      <CenterRow>{props.msg}</CenterRow>
    </NotificationRow>
  )
}

export const SuccessTx = (props: { msg: string, txId: string }) => {
  return (
    <NotificationRow>
      <IconSuccess>
        <FaCheckCircle />
      </IconSuccess>
      <CenterRow>{props.msg}
        <TxIdLinkContainer>
          <TxIdLink href={`https://bloks.io/transaction/${props.txId}`} target={"_blank"}><FaReceipt /></TxIdLink>
        </TxIdLinkContainer>
      </CenterRow>
    </NotificationRow>
  )
}

export const Error = (props: { msg: string }) => {
  return (
    <React.Fragment>
      <NotificationRow>
        <IconError>
          <FaExclamationTriangle />
        </IconError>
        <CenterRow>{props.msg}</CenterRow>
      </NotificationRow>
    </React.Fragment>
  )
}

export const Info = (props: { msg: string }) => {
  return (
    <NotificationRow>
      <IconInfo>
        <FaInfoCircle />
      </IconInfo>
      <CenterRow>{props.msg}</CenterRow>
    </NotificationRow>
  )
}

export const ChexFees = (props: { msg: string }) => {
  return (
    <NotificationRow>
      <ChexFeesIcon>
        <FaInfoCircle />
      </ChexFeesIcon>
      <CenterRow>{props.msg}</CenterRow>
    </NotificationRow>
  )
}
