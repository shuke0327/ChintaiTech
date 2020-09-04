/*****************
 * Andrew Coutts
 * 2019
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import { FlexRow, FlexColumn } from "lib/GlobalStyles"
import styled from "styled-components"
// import { FaLinkedin, FaTelegram, FaGithub, FaTwitter, FaExclamationTriangle } from "react-icons/fa"
// import ArrowImg from "./arrow.svg"
interface ITeamSocial {
  type: string
  url: string
}

export interface ITeamMember {
  name: string
  title: string
  bio: Array<string>
  photo: string
  social: Array<ITeamSocial>
}

const TeamListContainer = styled(FlexRow)`
  margin-top: 100px;
  flex-wrap: wrap;
  width: ${(props: { advisors: boolean }) => props.advisors ? "100%" : "80%"};


  @media (max-width: 660px) {
    width: inherit;
    margin-top: ${(props: { advisors: boolean }) => props.advisors ? "50px" : "200px"};
    margin-left: 10%;

  }
  max-width: 100%;
  justify-content: space-around;
`

const TeamItem = styled(FlexRow)`
  padding: 15px;
  width: 229px;
  height: 234px;
  justify-content: space-around;
  background-color: rgba(231,242,250,1);
  margin: 60px;
  h3 {
    margin-bottom: 20px;
    color: #374574;
    font-family: PoppinsLight;
    font-size: 20px;
    font-weight: bold;
    line-height: 28px;
    /* Text style for "David Pack" */
    letter-spacing: -0.2px;
    padding: 0 10px;
  }

  h4 {
    /* Style for "Core Devel" */
    color: #0d78ca;
    font-family: PoppinsLight;
    font-size: 15px;
    font-weight: 400;
    width: 200px;
    line-height: 20.15px;
    /* Text style for "Core Devel" */
    letter-spacing: -0.15px;
    margin: 0;
    padding: 0 10px;
  }
  @media(min-width: 1024px){
    &:nth-of-type(3) {
      margin-right: 0;
    }
    &:nth-of-type(6) {
      margin-right: 0;
    }
  }

  @media (max-width: 700px) {
    flex-basis: ${(props: { advisors: boolean }) => props.advisors ? "50%" : "50%"};

    /* &:last-of-type {
      flex-basis: ${(props: { advisors: boolean }) => props.advisors ? "100%" : "100%"};
    } */
  }

  @media (max-width: 410px) {
    /* flex-basis: ${(props: { advisors: boolean }) => props.advisors ? "100%" : "100%"}; */
  }
`

const LeftFlexColumn = styled(FlexColumn)`
  justify-content: space-around;
`


// const RightFlexColumn = styled(FlexColumn)`
//   justify-content: space-around;
// `


const TeamAvatar = styled(FlexColumn)`
  position: relative;
  width: 200px;
  height: 220px;
  // border-radius: 50%;
  margin-bottom: 10px;
  /* transition: 0.3s; */

  &:active {
    transform: scale(0.95);
  }

  img {
    position: absolute;
    top: -54px;
    left: -42px;
    width: 186px;
    height: 198px;
    pointer-events: none;
    box-shadow: 0 9px 9px rgba(173, 178, 199, 0.22);
    background-color: #eceff3;
    &:hover {
      transform: scale(1.05);
    }
  }
`

// const TeamSocialIcons = styled(FlexColumn)`
//   flex-grow: 1;
//   margin-top: 5px;

//   a {
//     color: inherit;
//   }
// `

// const HorizontalTeamSocialIcons = styled(FlexRow)`
//   flex-grow: 1;
//   margin-top: 5px;

//   a {
//     color: inherit;
//   }
// `

// const SocialIcon = styled(FlexColumn)`
//   margin-left: 5px;
//   color: #0d78ca;
//   font-family: "Font Awesome";
//   font-size: 20px;
//   height: 40px;
//   font-weight: 400;
// `

// const ArrowIcon = styled(FlexColumn)`
// /* Style for "item197" */
// margin: 0px;
// padding: 5px 0 5px 0;
// align-items: center;
// justify-content: center;
// cursor: pointer;
// background-image: linear-gradient(42.43deg, #2596e0 0%, #0659a8 100%);
// `

// const TeamProfileExpandedContainer = styled(ItemExpandedContainer)`
//   transform: ${(props: { teamLightboxOpen: boolean }) => props.teamLightboxOpen ? "scale(1)" : "scale(0)"};
// `

// const SocialIconExpanded = styled(SocialIcon)`
//   margin-left: 15px;
//   font-size: 1.5em;

//   &:first-of-type {
//     margin-left: 0;
//   }
// `

// const ProfilePhoto = styled.div`
//   justify-content: center;

//   img {
//     width: 180px;
//     height: 200px;
//   }

//   @media (max-width: 660px) {
//     align-self: center;
//   }
// `

// const Bio = styled.div`
//   padding: 0 20px;
//   font-size: 1em;
//   line-height: 1.2em;
//   text-align: left;

//   @media (max-width: 660px) {
//     font-size: 1em;
//     height: 40%;
//     p {
//       margin-left: 5px;
//     }
//   }
// `

// const LeftColumn = styled(ModalBoxLeftColumn)`
//   @media(max-width: 960px){
//     min-height: 350px;
//     flex-wrap: nowrap;
//   }
// `

// const GetSocialIcon = (props: { socialType: string }) => {
//   switch (props.socialType) {
//     case "linkedIn":
//       return <FaLinkedin />

//     case "telegram":
//       return <FaTelegram />

//     case "twitter":
//       return <FaTwitter />

//     case "github":
//       return <FaGithub />

//     default:
//       return <FaExclamationTriangle />
//   }
// }

// @inject("stores")
// @observer
// export class TeamViewExpanded extends Component<IStoreProps> {
//   render() {
//     try {
//       const currentSelectedUser = this.props.stores!.appStore.currentSelectedTeamMemberObject!

//       // First figure out if the current selected user is of type team member or advisor
//       const tagName = (this.props.stores!.langStore.safeGetLocalizedString("advisors") as unknown as Array<ITeamMember>).find((e: ITeamMember) => e.name === currentSelectedUser.name) ? "advisors" : "teamMembers"

//       // Now get that user's data from the lang JSON to parse it out
//       const userData = (this.props.stores!.langStore.safeGetLocalizedString(tagName) as unknown as Array<ITeamMember>).find((f: ITeamMember) => f.name === this.props.stores!.appStore.currentSelectedTeamMember)!
//       if (!userData) { return null } // If user isn't found, don't try to render anything

//       return (
//         <TeamProfileExpandedContainer teamLightboxOpen={this.props.stores!.appStore.teamLightboxOpen}>
//           <ModalBoxInnerContent>
//             <XButtonSection onClick={() => this.props.stores!.appStore.closeTeamLightbox()}>
//               <XButton>
//                 <span>&#x2716;</span>
//               </XButton>
//             </XButtonSection>
//             <ModalBoxMainContent>
//               <LeftColumn>
//                 <ProfilePhoto>
//                   <img src={`/images/team/${userData.photo}`} />
//                 </ProfilePhoto>
//                 <h1>{userData.name}</h1>
//                 <h2>{userData.title}</h2>
//                 <HorizontalTeamSocialIcons>
//                   {currentSelectedUser.social.map((f: ITeamSocial) => {
//                     return (
//                       <SocialIconExpanded key={currentSelectedUser.name.replace(/\s/g, "").toLowerCase() + currentSelectedUser.social.indexOf(f)}>
//                         <a href={f.url} target={"_blank"}><GetSocialIcon socialType={f.type} /></a>
//                       </SocialIconExpanded>
//                     )
//                   })}
//                 </HorizontalTeamSocialIcons>
//               </LeftColumn>
//               <ModalBoxRightColumn>
//                 <Bio>
//                   {userData.bio.map((e: string) => {
//                     return (
//                       <p>{e}</p>
//                     )
//                   })}
//                 </Bio>
//               </ModalBoxRightColumn>
//             </ModalBoxMainContent>
//           </ModalBoxInnerContent>
//         </TeamProfileExpandedContainer>
//       )
//     } catch (e) {
//       return null
//     }
//   }
// }

@inject("stores")
@observer
export default class TeamList extends Component<IStoreProps & { advisors: boolean }> {
  getTeamList = () => {
    try {
      const items = (this.props.stores!.langStore.safeGetLocalizedString(this.props.advisors ? "advisors" : "teamMembers") as unknown as Array<ITeamMember>)
      if (!items) { return null }
      return items.map((e: ITeamMember) => {
        return (
          <TeamItem key={e.name.replace(/\s/g, "").toLowerCase()} advisors={this.props.advisors}>
            <LeftFlexColumn>
              <TeamAvatar>
                <img src={`/images/team/${e.photo}`} />
              </TeamAvatar>
              <h3>{e.name}</h3>
              <h4>{e.title}</h4>
            </LeftFlexColumn>
            {/* <RightFlexColumn>
              <TeamSocialIcons>
                {e.social.map((f: ITeamSocial) => {
                  return (
                    <SocialIcon key={e.name.replace(/\s/g, "").toLowerCase() + e.social.indexOf(f)}>
                      <a href={f.url} target={"_blank"}><GetSocialIcon socialType={f.type} /></a>
                    </SocialIcon>
                  )
                })}
              </TeamSocialIcons>
              <ArrowIcon onClick={() => this.props.stores!.appStore.openTeamLightbox(e.name)}>
                <img src={ArrowImg} />
              </ArrowIcon>
            </RightFlexColumn> */}
          </TeamItem>
        )
      })
    } catch (e) {
      return null
    }
  }

  render() {
    return (
      <TeamListContainer advisors={this.props.advisors}>
        {this.getTeamList()}
      </TeamListContainer>
    )
  }
}
