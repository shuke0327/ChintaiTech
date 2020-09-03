/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { FlexRow, FlexColumn, TitleText, Button, ColorDarkGrayText } from "lib/GlobalStyles"
import styled from "styled-components"
import chintaiIcon from "./icon.png"
import { FaMedium, FaTwitter, FaTelegramPlane, FaRedditAlien, FaLinkedin } from "react-icons/fa"
import { Link } from "react-router-dom";
import ReactGA from "react-ga"

const FooterContainer = styled(FlexColumn)`
  border-top: 1px solid #d4e1f3;
  background-color: #ecf2f9;
  position: relative;
  min-height: 144px;
  justify-content: space-around;
  overflow: hidden;
`

const ContainerInner = styled(FlexColumn)`
  z-index: 1;
`

const FloatingIcons = styled.div`
  width: 100vw;
  /* position: absolute; */
  overflow: hidden;
  height: 100%;
  opacity: 0.14;
  pointer-events: none;
`

const Icon = styled.div`
 position: absolute;

 &:nth-of-type(1) {
  width: 202px;
  top: -64px;
  left: -12px;
 }

 &:nth-of-type(2) {
  width: 102px;
  top: 14px;
  right: 477px;

  @media (max-width: 670px) {
    display: none;
  }
 }

 &:nth-of-type(3) {
  width: 75px;
  top: -39px;
  right: 284px;

  @media (max-width: 420px) {
    display: none;
  }
 }

 &:nth-of-type(4) {
  width: 240px;
  top: 13px;
  right: 34px;

  @media (max-width: 420px) {
    display: none;
  }
 }
`

const FooterRow = styled(FlexRow)`
  justify-content: center;
  align-items: flex-start;

  a {
    color: #324b56;
    text-decoration: none;
  }

  &:last-of-type {
    margin-top: 10px;
  }

  @media (max-width: 615px) {
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
  }
`

const SectionContainer = styled(FlexColumn)`
  align-items: center;
  flex: 0 1 35%;

  @media (max-width: 915px) {
    margin-top: 15px;
    margin-bottom: 35px;
    flex: 0 1 100%;
  }
`

const SectionHeader = styled(TitleText)`
  font-size: 1.4em;
  margin: 0;
  margin-bottom: 10px;
`

const SectionContent = styled.div`
`

const SocialIconsContainer = styled(FlexRow)`
  font-size: 2em;
  width: 220px;
  justify-content: space-around;
`

const SocialIcon = styled.div`
`

const SocialLink = styled(ReactGA.OutboundLink)`
  display: flex;
  color: #324b56;
`

const Email = styled.div`
  font-size: 1.3em;

  a {
    color: #324b56;
    text-decoration: none;
  }
`

const SubscribeButton = styled(Button)`
  padding: 5px 10px;
`

const SubscribeButtonContainer = styled.div`
  margin-left: 10px;

  @media (max-width: 915px) {
    margin-left: 0;
    margin-top: 10px;
  }
`

const SubscribeOuter = styled(FlexRow)`
  align-items: center;

  input {
    outline: none;
    border-radius: 3px;
    border: 1px solid #d4e1f3;
    padding: 5px 7px 3px;
    font-size: 1em;
    color: ${ColorDarkGrayText}
  }

  @media (max-width: 915px) {
    flex-direction: column;
  }
`

const CopyrightText = styled(FooterRow)`

`

const CopyrightRowItem = styled.div`
  margin-left: 30px;

  &:first-of-type {
    margin-left: initial;
  }

  @media (max-width: 615px) {
      margin-left: initial;
  }
`

@inject("stores")
@observer
export default class Footer extends Component<IStoreProps> {
  render() {
    return (
      <FooterContainer>
        <FloatingIcons>
          <Icon><img width={"100%"} src={chintaiIcon} /></Icon>
          <Icon><img width={"100%"} src={chintaiIcon} /></Icon>
          <Icon><img width={"100%"} src={chintaiIcon} /></Icon>
          <Icon><img width={"100%"} src={chintaiIcon} /></Icon>
        </FloatingIcons>
        <ContainerInner>
          <FooterRow>
            <SectionContainer>
              <SectionHeader>
                {this.props.stores!.langStore.safeGetLocalizedString("footer.socialMedia")}
              </SectionHeader>
              <SectionContent>
                <SocialIconsContainer>
                  <SocialIcon>
                    <SocialLink
                      eventLabel={`footerSocialLink: Medium`}
                      to={"https://medium.com/@chintaieos"}
                      target={"_blank"}
                    >
                      <FaMedium />
                    </SocialLink>
                  </SocialIcon>
                  <SocialIcon>
                    <SocialLink
                      eventLabel={`footerSocialLink: Twitter`}
                      to={"https://twitter.com/chintaieos"}
                      target={"_blank"}
                    >
                      <FaTwitter />
                    </SocialLink>
                  </SocialIcon>
                  <SocialIcon>
                    <SocialLink
                      eventLabel={`footerSocialLink: Telegram`}
                      to={"https://t.me/ChintaiEOS"}
                      target={"_blank"}
                    >
                      <FaTelegramPlane />
                    </SocialLink>
                  </SocialIcon>
                  <SocialIcon>
                    <SocialLink
                      eventLabel={`footerSocialLink: Reddit`}
                      to={"https://reddit.com/r/chintai/"}
                      target={"_blank"}
                    >
                      <FaRedditAlien />
                    </SocialLink>
                  </SocialIcon>
                  <SocialIcon>
                    <SocialLink
                      eventLabel={`footerSocialLink: LinkedIn`}
                      to={"https://linkedin.com/company/chintai-eos/"}
                      target={"_blank"}
                    >
                      <FaLinkedin />
                    </SocialLink>
                  </SocialIcon>
                </SocialIconsContainer>
              </SectionContent>
            </SectionContainer>

            <SectionContainer>
              <SectionHeader>
                {this.props.stores!.langStore.safeGetLocalizedString("header.getUpdates")}
              </SectionHeader>
              <SubscribeOuter>
                <input
                  type="text"
                  placeholder="Email"
                  value={this.props.stores!.appStore.subscribeEmail}
                  onChange={(e: any) => this.props.stores!.appStore.setSubscribeEmail(e.target.value)}
                  onKeyPress={(e) => { if (e.key === "Enter") { this.props.stores!.appStore.submitSubscribeRequest() } }}
                />
                <SubscribeButtonContainer>
                  <SubscribeButton onClick={() => this.props.stores!.appStore.submitSubscribeRequest()}>{this.props.stores!.langStore.safeGetLocalizedString("footer.subscribe")}</SubscribeButton>
                </SubscribeButtonContainer>
              </SubscribeOuter>
            </SectionContainer>

            <SectionContainer>
              <SectionHeader>
                {this.props.stores!.langStore.safeGetLocalizedString("footer.contactUs")}
              </SectionHeader>
              <SectionContent>
                <Email><a href={"mailto:hello@chintai.io"}>hello@chintai.io</a></Email>
              </SectionContent>
            </SectionContainer>
          </FooterRow>
          <CopyrightText>
            <CopyrightRowItem>
              <Link to={"/unsubscribe"}>{this.props.stores!.langStore.safeGetLocalizedString("footer.optOut")}</Link>
            </CopyrightRowItem>
            <CopyrightRowItem>
              {this.props.stores!.langStore.safeGetLocalizedString("footer.copyright")}
            </CopyrightRowItem>
            <CopyrightRowItem>
              <Link to={"/terms-and-conditions"}>{this.props.stores!.langStore.safeGetLocalizedString("footer.terms")}</Link>
            </CopyrightRowItem>
          </CopyrightText>
        </ContainerInner>
      </FooterContainer>
    )
  }
}
