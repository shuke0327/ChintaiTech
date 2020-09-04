import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { FlexColumn, FlexRow, WhiteBlueButton, TitleText, CTALink, ContactLink, CTASection, ItemExpandedContainer, ModalBoxRightColumn, ModalBoxMainContent, XButton, XButtonSection, ModalBoxLeftColumn, ModalBoxInnerContent } from "lib/GlobalStyles"
import ArrowImg from "./arrow.svg"

export interface ProductItem {
  name: string
  title: string,
  subtitle: string,
  content: Array<string>,
  image: string,
  contactUs: string,
  ctaLink: string,
  ctaText: string
}

const ProductsContainer = styled(FlexRow)`
  z-index: 1;
  position: relative;
  box-shadow: initial;
  background: initial;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 5vw;
  margin-bottom: 5vw;
  flex-wrap: wrap;
  max-width: 70%;
`
const ProductItemContainer = styled(FlexColumn)`
  /* Style for "item164" */
  background-color: transparent;
  margin: 50px 30px;
  max-width: 220px;
  align-items: center;
  justify-content: space-evenly;
  @media(max-width:660px) {
    margin: 20px 10px;
  }
`

const Icon = styled(FlexRow)`
  margin-bottom: 0px;
  justify-content: center;
  img {
  height: 80%;
  width: 80%;
  }
  @media(max-width:660px) {
    img {
      width: 60%;
      height: 60%;
      margin: 10px 0px
    }
  }
`

const PointText = styled(TitleText)`
  text-align: center;
  color: black;
  margin-top: 10px;
  width: 350px;
  height: 1em;
  line-height:1em;
  font-size: 18px;
  @media(max-width:660px) {
    font-size:20px;
  }

`

const SubText = styled.p`
  text-align: center;
  opacity: 0.8;
  min-height: 2em;
  font-family: PoppinsLight;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 1.2em;
  letter-spacing: 0vw;
  color: #8392a5;
  @media(max-width: 660px) {
    font-size: 15px;
    width: 200px;
    height: 65px;
    line-height:20px;
  }
`

const CTAButton = styled(WhiteBlueButton)`
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
	width: 150px;
	height: 32px;
  box-shadow: 3px 3px 13px rgba(0, 0, 0, 0.14);
  border: 0px solid #dfe3e9;
  background-color: #ffffff;
  shadow: 2px;
  border-radius: 25px;
  text-transform: none;
	font-family: PoppinsSemiBold;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0vw;
	color: #0c78ca;
  &::after {
    content: url(${ArrowImg});
    position: relative;
    left: 8px;
    margin-top:3px;
  }
`



const ProductItemExpandedContainer = styled(ItemExpandedContainer)`
  transform: ${(props: { productItemBoxOpen: boolean }) => props.productItemBoxOpen ? "scale(1)" : "scale(0)"};
`

@inject("stores")
@observer
export class ProductItemViewExpanded extends Component<IStoreProps> {

  getCTASection = (item: ProductItem) => {
    if (item.contactUs && item.ctaText) {
      return (
        <CTASection>
          <ContactLink target="_blank" href='mailto:hello@chintai.io'>
            {item.contactUs}
          </ContactLink>
          <CTALink target="_blank" href={item.ctaLink}>
            {item.ctaText}
          </CTALink>
        </CTASection>
      )
    } else if (item.contactUs) {
      return (
        <CTASection>
          <ContactLink target="_blank" href='mailto:hello@chintai.io'>
            {item.contactUs}
          </ContactLink>
        </CTASection>
      )
    } else if (item.ctaText) {
      return (
        <CTASection>
          <CTALink target="_blank" href={item.ctaLink}>
            {item.ctaText}
          </CTALink>
        </CTASection>
      )
    } else {
      return null
    }
  }
  render() {
    try {
      // const currentSelectedProductItem = this.props.stores!.appStore.currentSelectedProductItemObject!

      // Now get that user's data from the lang JSON to parse it out
      const productItemData = (this.props.stores!.langStore.safeGetLocalizedString('products.productsData') as unknown as Array<ProductItem>).find((f: ProductItem) => f.name === this.props.stores!.appStore.currentSelectedProductItem)!
      if (!productItemData) { return null } // If user isn't found, don't try to render anything
      return (
        <ProductItemExpandedContainer productItemBoxOpen={this.props.stores!.appStore.productItemBoxOpen}>
          <ModalBoxInnerContent>
            <XButtonSection onClick={() => this.props.stores!.appStore.closeProductItemBox()}>
              <XButton>
                <span>&#x2716;</span>
              </XButton>
            </XButtonSection>
            <ModalBoxMainContent>
              <ModalBoxLeftColumn>
                <img src={`./images/products/${productItemData.image}`} />
                <h1>{productItemData.name}</h1>
                <h2>{productItemData.subtitle}</h2>
              </ModalBoxLeftColumn>
              <ModalBoxRightColumn>
                {
                  (productItemData.content as unknown as Array<string>).map((e: string) => {
                    return (
                      <p>{e}</p>
                    )
                  })
                }
                {this.getCTASection(productItemData)}
              </ModalBoxRightColumn>
            </ModalBoxMainContent>
          </ModalBoxInnerContent>
        </ProductItemExpandedContainer >
      )
    } catch (e) {
      return null
    }
  }
}

@inject("stores")
@observer
export default class Products extends Component<IStoreProps> {

  getProductsList = () => {
    try {
      const items = (this.props.stores!.langStore.safeGetLocalizedString("products.productsData") as unknown as Array<ProductItem>)
      if (!items) { return null }
      return items.map((e: ProductItem) => {
        return (
          <ProductItemContainer key={e.name.replace(/\s/g, "").toLowerCase()}>
            <Icon>
              <img src={`/images/products/${e.image}`} />
            </Icon>
            <PointText>{e.name}</PointText>
            <SubText>
              {e.title}
            </SubText>
            <CTAButton onClick={() => this.props.stores!.appStore.openProductItemBox(e.name)}>
              {this.props.stores!.langStore.safeGetLocalizedString("products.CTA")}
            </CTAButton>
          </ProductItemContainer>
        )
      })
    } catch (e) {
      return null
    }
  }

  render() {
    return (
      <ProductsContainer id="products">
        {this.getProductsList()}
      </ProductsContainer>
    )
  }
}