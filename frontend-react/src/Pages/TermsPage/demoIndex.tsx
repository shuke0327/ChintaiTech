/*****************
 * Andrew Coutts
 * 2019
 * Root page which hosts the sidebar and lazy loads the content pages
 *****************/
import React, { Component } from "react"
import IStoreProps from "lib/Props"
import { observer, inject } from "mobx-react"
import Header from "SharedComponents/Header"
import Footer from "SharedComponents/Footer"
import styled from "styled-components"
import { FlexColumn, FlexRow, LandingRowInner, IslandContainer } from "lib/GlobalStyles"
import { ToastContainer, Flip } from "react-toastify"


const Body = styled(FlexColumn)`
  margin-top: 70px;
  min-height: calc(100vh - 215px);
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(80% 70% at 75%, #e3ecf9 0%, #b1c5e0 100%);
`

const PageColumn = styled(FlexColumn)`
`

const PageRow = styled(FlexRow)`
  z-index: 1;
  justify-content: center;
`

const LandingRow = styled(PageRow)`
  position: relative;
`

const RowInner = styled(LandingRowInner)`
  justify-content: center;
  margin-bottom: 25px;
`

const TermsIslandContainer = styled(IslandContainer)`
  div {
    h1 {
      margin-top: 0;
    }
  }
`

const TermsContainer = styled.div`
  ol > li {
    margin-top: 15px;
  }
`

export const getTosContent = () => (
  <TermsContainer>
    <h1>WBI TOKEN SALE TERMS AND CONDITIONS</h1>
    <p>Last updated: Apr 5, 2019</p>
    <p>
      PLEASE READ THIS TERMS & CONDITIONS FULLY AND IN THEIR ENTIRETY. IF
      THERE IS ANY CLAUSE YOU DO NOT UNDERSTAND OR DO NOT ACCEPT THEN DO
      NOT PROCEED FURTHER. THIS DOCUMENT IS NOT A SOLICITATION FOR
      INVESTMENT AND DOES NOT PERTAIN IN ANY WAY TO AN OFFERING OF
      SECURITIES IN ANY JURISDICTION. THIS DOCUMENT DESCRIBES THE WBI TOKEN
      SALE TERMS AND CONDITIONS.
                </p>
    <p>
      The following WBI ​<b>Terms and Conditions</b> (the <b>"Agreement​"</b> or <b>"​Terms and Conditions​"</b>)
                  made between you (<b>"you"</b> or <b>"​Purchaser​"</b>) and Chintai Limited, an exempted company
registered in the Cayman Islands (the "​ Company​ ") determine the Agreement by which you
purchase cryptographic tokens called "WBI" as generated and sold by the Company, and the
explicit usage of the WBI token. You and the Company are within this Agreement referred to
                  as a <b>"​Party​​"</b> and collectively <b>"​Parties​"</b>.
                </p>
    <ol>
      <li>
        <b>DEFINITIONS AND INTERPRETATION</b>
        <p>
          The following definitions and rules of interpretation apply in these Terms and
          Conditions:
                    </p>
        <ol>
          <li>
            <b>"Chintai Platform​"</b> - Any technical or intellectual property operated by the
            Company, including smart contracts, front end functionality, website, as seen
            located or connected to ​ www.chintai.io​ and any associated sub-domains.
                      </li>
          <li>
            <b>"WBI smart contract"</b> means the “WBI token contract” functionality and
            associated EOS account and public addresses which is used by Chintai for the
            functionality for the WBI auction and distribution of WBI Tokens.
                      </li>
          <li>
            <b>"Cycle​"</b> – means each 18 hour period where WBI tokens will be distributed. Each
            cycle disperses 1,875,000 WBI, across 320 cycles and 240 days.
                      </li>
          <li>
            <b>"WBI Distribution/Allocation Period"</b> - refers to the length of time, and all
technical processes required to distribute/allocate WBI to the Purchaser.
                      </li>
          <li>
            <b>"CHINTAI Team​"</b> - refers to all equity shareholders of CHINTAI LTD., any future or
current individuals that are contracted, hired, or otherwise employed to work in
direct official capacity for CHINTAI LTD., and does not include advisors, affiliates,
promoters, sponsors, or any persons that is not working in direct official capacity for
CHINTAI LTD.
                      </li>
          <li>
            <b>"EOS Account"</b>- means the cryptographic public and private key pair that is
associated with an account name on the EOS blockchain, which uses token symbol
‘EOS’.
                      </li>
          <li>
            <b>"KYC Provider"</b> - means the Swiss based supervised KYC operator Altcoinomy SA
(CHE-209.239.695) that conducts anti money laundering analysis on behalf of The
Company.
                      </li>
        </ol>
      </li>
      <li>
        <b>WBI TOKENS PURCHASE</b>
        <p>PURCHASER AGREES TO BUY, AND COMPANY AGREES TO DISTRIBUTE, THE WBI
  TOKENS IN ACCORDANCE WITH THE FOLLOWING TERMS.</p>
        <p><b>Conditions to WBI token sale</b></p>
        <p>Participation from certain countries, including US person and Chinese residents, is
restricted. See Annex B for definition of U.S. person.</p>
        <p><b>No U.S. OR Chinese Purchasers​:</b> WBI Tokens are not being offered or distributed to
U.S. persons or Chinese persons; as defined without limitation, any corporation or
partnership created or organized in or under the laws of the United States of America,
any state or territory thereof or the District of Columbia (a “U.S. person”), or, organized
in or under the laws of the People’s Republic of China (a “Chinese person”).</p>
        <p>If you are citizen, resident of, or a person located or domiciled in, or any entity,
        including, without limitation, any corporation or partnership created or organized in the
        United States of America or People’s Republic of China, do not purchase or attempt to
        purchase WBI Tokens. WBI tokens are not being offered or distributed to U.S. or
Chinese persons.</p>
        <p>When you purchase, or otherwise receive, a WBI token, you may only do so by
        accepting the following conditions and, by doing so, you warrant and represent that thefollowing are a true and accurate reflection of the basis on which you are acquiring the
WBI tokens:</p>
        <ul>
          <li>neither the Company nor any of the CHINTAI Team has provided you with any advice
regarding whether WBI is a suitable investment for you;</li>
          <li>you have sufficient understanding of the functionality, usage, storage, transmission
          mechanisms and intricacies associated with cryptographic tokens, such as Bitcoin, EOS
and Ether, as well as blockchain-based software systems generally;</li>
          <li>you are legally permitted to receive and hold and make use of WBI in your and any
other relevant jurisdiction;</li>
          <li>you will supply the KYC Provider with all information, documentation or copy
          documentation required in order to allow us to accept your purchase of WBI and
allocate WBI to you;</li>
          <li>you have not supplied the KYC Provider with information relating to Purchaser origin of
funds for the acquisition of WBI tokens or otherwise which is inaccurate or misleading;</li>
          <li>you will provide the KYC Provider with any additional information which may be
          reasonably required in order that we can fulfil our legal, regulatory and contractual
obligations, including but not limited to any anti-money laundering obligation;</li>
          <li>you will notify the KYC Provider promptly of any change to the information supplied;</li>
          <li>you are of a sufficient age (if an individual) to legally obtain WBI tokens, and you are
not aware of any other legal reason to prevent you from obtaining WBI tokens;</li>
          <li>you take sole responsibility for any restrictions and risks associated with receiving and
holding WBI tokens, including but not limited to terms outlined in Annex A;</li>
          <li>by acquiring WBI tokens, you are not making a regulated investment, as this term may
be interpreted by the regulator in your jurisdiction;</li>
          <li>you are not obtaining or using WBI tokens for any illegal purpose, and will not use
WBI tokens for any illegal purpose;</li>
          <li>you waive any right you may have to participate in a class action lawsuit or a class wide
          arbitration against any entity or individual involved with the sale of WBI, including The
Company & CHINTAI Team;</li>
          <li>your acquisition of WBI tokens does not involve your purchase or receipt of shares,
          ownership or any equivalent in any existing or future public or private company,
corporation or other entity in any jurisdiction;</li>
          <li>to the extent permitted by law and provided we act in good faith, the Company makes
          no warranty whatsoever, either expressed or implied, regarding the future success of
WBI tokens or Chintai;</li>
          <li>the WBI token is a utility token and is to be purchased, handled and used as such.
          WBI tokens are intended to be a multi-purpose utility token for the Chintai platform
          only, and entail no other rights, uses, purpose, attributes, functionalities or features,express or implied. Although WBI tokens are transferable and may be tradable, they
          are not an investment, currency, security, commodity, a swap on a currency, security or
commodity or any other kind of financial instrument;</li>
          <li>
            you accept that you bear sole responsibility for determining if (i) the acquisition, the
            allocation, use or ownership of WBI tokens (ii) the potential appreciation or
            depreciation in the value of WBI tokens over time, if any, (iii) the sale and purchase of
            WBI tokens; and/or (iv) any other action or transaction related to WBI tokens has tax
            implications.
</li>
        </ul>
      </li>
      <li>
        <b>ACCEPTANCE OF AGREEMENT</b>
        <p>Do not purchase WBI tokens if you are not an expert in dealing with cryptographic
tokens and blockchain-based software systems. Prior to purchasing WBI tokens, you
should carefully consider the terms listed in this document, and to the extent
necessary, consult an appropriate lawyer, accountant, or tax professional in your local
jurisdiction. If any of the following terms are unacceptable to you, you should not
purchase wbi.</p>
        <p>Purchases of WBI tokens should be undertaken only by individuals, entities, or
        companies that have significant experience with, and understanding of, the usage and
        intricacies of cryptographic tokens, including EOS tokens, and blockchain based
        software systems. Purchasers should have a functional understanding of secure storage
        and transmission mechanisms associated with other cryptographic tokens. While the
        Company will be available to assist purchasers of WBI tokens during the sale, the
        Company will not be responsible in any way for loss of BTC, ETH, EOS, or WBI tokens
resulting from actions taken by, or omitted by Purchasers.</p>
        <p>If you do not have such experience or expertise, then you should not purchase WBI
        tokens or participate in the distribution of WBI tokens. Your acceptance of this
        Agreement, and participation in the WBI token sale is deemed to be your undertaking
that you satisfy the requirements mentioned in this paragraph.</p>
      </li>
      <li>
        <b>WBI TOKEN DISTRIBUTION</b>
        <p>WBI Tokens are intended to be a multi-purpose utility token for the Chintai platform
(as defined in the token economic white paper (the "White Paper​") provided at
https://www.chintai.io (the “​ Website​ ”) as of the date the Purchaser acquires WBI
tokens).</p>
        <p>The right to alter the length of the WBI Distribution/Allocation Period is explicitly
        reserved by the Company to include, without limitation, bugs in the WBI smart
contract, unavailability of the WBI website, or any other operational or security issue.</p>
        <p>The burden of responsibility to provide an accurate EOS account name with secure
        account access controls in place is with the Purchaser. The account must be capable of
        securing cryptographic tokens to receive any WBI tokens that are purchased by the
        Purchaser. The Purchaser understands that the WBI smart contract will distribute the
        tokens automatically, and that the WBI smart contract is protected and designed to
achieve the following:</p>
        <ul>
          <li>The Purchaser acknowledges that the WBI smart contract ONLY directly
accepts EOS tokens.</li>
          <li>The Purchaser acknowledge that they have read, and fully understand that the
          WBI smart contract distributes WBI tokens on the basis of the hard coded
          mechanisms of the WBI smart contract. Relevant amounts of WBI tokens will
          be transferred to the Purchaser’s EOS account, based upon the amount of EOS
          tokens sent to the WBI smart contract in the current cycle, and total demand
in the current cycle.</li>
          <li>
            The Purchaser is aware that they should ONLY use an EOS Account that is
            controlled by their possession of the cryptographic key pair, possessed solely by
            the Purchaser, and shall NOT use an exchange account, or any other account
            that is not specifically defined as an EOS account under the terms of this
            contract. The purchaser understands that using an exchange account will result
            in permanently losing any WBI tokens purchased. CHINTAI Ltd is not legally
            liable, nor responsible in any other form, including refunds, for Purchasers who
            buy WBI with an account other than an EOS Account.
</li>
          <li>
            The WBI token distribution represents 60% of total supply at issuance, which
            will take place across 320 cycles each lasting 18 hours in duration. The
            distribution will last 240 days starting on April 8th, 2019 at 12:00 UTC, and issue
1,875,000 million WBI tokens per cycle (<b>“Distribution Actuation”</b>).
</li>
          <li>
            The total amount of WBI tokens distributed to The Purchaser in a Cycle is
            based upon the following, and can be tracked here ​ https://www.chintai.io/ The
            “Website”): At the end of each 18 hour period referred, the respective set number
            of WBI Tokens set forth above will be distributed pro rata amongst all
            authorized purchasers, based on the total EOS contributed during those periods,
            respectively, as follows:
<p>Number of WBI Tokens distributed to an authorized purchaser = (A / C) * B</p>
            Where:
<ul>
              <li>A = Total EOS contributed by an authorized purchaser during the
period.</li>
              <li>B = Total number of WBI Tokens available for distribution in the
period.</li>
              <li>C = Total EOS contributed by all authorized purchasers during the
period.</li>
            </ul>
          </li>
          <li>The Purchaser understands that the number of WBI tokens that the Purchaser
has received in a particular cycle of WBI Tokens may vary.</li>
          <li>The Purchaser understands that transfers of any form to the WBI smart
          contract are non-refundable, and cannot be reversed. After buying WBI tokens,
          the Purchaser acknowledges that refunds will not be granted under any
          circumstances, and forfeits their right to take legal action, or appeal to any third
          party in attempt to recover a refund at any point, for any reason. The Purchaser
          revokes their right to seek refunds from a third party after sending a transfer to
          WBI smart contract, whether or not the Company has withdrawn EOS held in
          the WBI smart contract. To further punctuate this point, and illustrate the
          rights of the Company, the Purchaser understands that the Company can
          remove EOS held in the WBI smart contract at the end of every Cycle, or
whenever the Company deems appropriate.</li>
          <li>Purchase of WBI tokens at a Cycle shall be subject to a minimum transfer by
purchaser of 1 EOS.</li>
          <li>The utility rights connected to WBI tokens are subject to the limitations
          outlined in the White Paper, but this should in no case create obligations for the
          Company in addition to the ones contained in these Terms and Conditions. The
          Company reserves the right to circumvent the WBI smart matching algorithm
          used to select the optimal underlying assets if it believes, in its sole discretion,
          that such selected underlying assets could adversely affect the Company or
          WBI tokens from a regulatory or legal perspective. The Company shall have
          the right to sell any such underlying assets (if already part of WBI portfolio)
and block their acquisition.</li>
          <li>Ownership of WBI tokens during the WBI token sale carries no rights express
or implied. Purchases of WBI are non-refundable.</li>
          <li>Under no circumstances should WBI tokens be considered an investment
          opportunity. WBI tokens are not designed for financial investment, nor does
          the Company consider distribution of WBI tokens for any type of financial
          investor to make monetary gains. Purchasers that accumulate WBI tokens by
          sending EOS to the WBI smart contract acknowledge that they are not buying WBI with the intention of investment purposes in order to receive financial, or
any other form of capital gain.</li>
          <li>The maximum supply of WBI will be​ <b>1 billion tokens</b>.</li>
          <li>The distribution of the WBI tokens is as follows:
  <ul>
              <li>​60% Distribution Cycles/Auction</li>
              <li>10% Partners/Affiliates</li>
              <li>10% Grants & Bug bounties</li>
              <li>​ 20% Chintai founders</li>
            </ul>
            <p>Purchaser, therefore, shall use an EOS Account to which the Vendor Smart
          Contract can send back WBI Tokens and/or EOS tokens to (i.e. not an address
of a token exchange like Poloniex, Coinbase, Bitfinex, etc).</p>
          </li>
        </ul>
        <b>After the WBI Token Sale</b>
        <p>WBI TOKENS HAVE NO VOTING RIGHTS, CONSEQUENTLY PURCHASERS SHOULD
HAVE NO EXPECTATION OF ANY INFLUENCE OVER GOVERNANCE OF THE
COMPANY.</p>
        <b>All purchases of WBI are final</b>
        <p>ALL PURCHASES OF WBI ARE FINAL. PURCHASES OF WBI ARE
        NON-REFUNDABLE. BY PURCHASING WBI, THE PURCHASER ACKNOWLEDGES
        THAT NEITHER THE COMPANY NOR ANY OF ITS AFFILIATES, DIRECTORS OR
SHAREHOLDERS ARE REQUIRED TO PROVIDE A REFUND FOR ANY REASON.</p>
        <p>IF THE COMPANY BELIEVES, IN ITS SOLE DISCRETION, THAT ANY INDIVIDUALS OR
        ENTITIES OWNING WBI CREATES MATERIAL REGULATORY OR OTHER LEGAL
        RISKS OR ADVERSE EFFECTS FOR THE COMPANY AND/OR WBI, THE COMPANY
        RESERVES THE RIGHT TO: (A) BUY ALL WBI FROM SUCH WBI OWNERS AT THE
        THEN-EXISTING MARKET PRICE AND/OR (B) SELL ALL CRYPTOCURRENCY ASSETS
OF THE COMPANY.</p>
      </li>
      <li>
        <b>RISKS & DISCLAIMERS</b>
        <p><b>Disclaimer of Warranties</b></p>
        <p>THE PURCHASER EXPRESSLY AGREES THAT THE PURCHASER IS PURCHASING WBI
TOKENS AT THE PURCHASER SOLE RISK AND THAT WBI TOKENS PROVIDED ONAN "AS IS" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
IMPLIED, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF TITLE OR IMPLIED
WARRANTIES, MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE
(EXCEPT ONLY TO THE EXTENT PROHIBITED UNDER APPLICABLE LAW WITH ANY
LEGALLY REQUIRED WARRANTY PERIOD TO THE SHORTER OF THIRTY DAYS FROM
FIRST USE OR THE MINIMUM PERIOD REQUIRED). WITHOUT LIMITING THE
FOREGOING, NONE OF THE CHINTAI TEAM WARRANTS THAT THE PROCESS FOR
PURCHASING WBI WILL BE UNINTERRUPTED OR ERROR-FREE.</p>
      </li>
      <li>
        <b>LIMITATIONS WAIVER OF LIABILITY</b>
        <p>THE PURCHASER ACKNOWLEDGES AND AGREES THAT, TO THE FULLEST EXTENT
PERMITTED BY ANY APPLICABLE LAW, THE DISCLAIMERS OF LIABILITY CONTAINED
HEREIN APPLY TO ANY AND ALL DAMAGES OR INJURY WHATSOEVER CAUSED BY
OR RELATED TO (i) USE OF, OR INABILITY TO USE, WBI TOKENS OR (ii) THE
CHINTAI TEAM UNDER ANY CAUSE OR ACTION WHATSOEVER OF ANY KIND IN ANY
JURISDICTION, INCLUDING, WITHOUT LIMITATION, ACTIONS FOR BREACH OF
WARRANTY, BREACH OF CONTRACT OR TORT (INCLUDING NEGLIGENCE) AND
THAT NONE OF THE CHINTAI TEAM SHALL BE LIABLE FOR ANY INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY OR CONSEQUENTIAL DAMAGES, INCLUDING
FOR LOSS OF PROFITS, GOODWILL OR DATA, IN ANY WAY WHATSOEVER ARISING
OUT OF THE USE OF, OR INABILITY TO USE, OR PURCHASE OF, OR INABILITY TO
PURCHASE WBI TOKENS, OR ARISING OUT OF ANY INTERACTION WITH THE
SMART CONTRACT IMPLEMENTED IN RELATION TO WBI. THE PURCHASER
FURTHER SPECIFICALLY ACKNOWLEDGES THAT THE CHINTAI TEAM IS NOT LIABLE
FOR THE CONDUCT OF THIRD PARTIES, INCLUDING OTHER PURCHASERS OF WBI,
AND THAT THE RISK OF PURCHASING AND USING WBI TOKENS RESTS ENTIRELY
WITH THE PURCHASER. TO THE EXTENT PERMISSIBLE UNDER APPLICABLE LAWS,
UNDER NO CIRCUMSTANCES WILL ANY OF THE CHINTAI TEAM BE LIABLE TO ANY
PURCHASER FOR MORE THAN THE AMOUNT THE PURCHASER HAVE PAID TO THE
COMPANY FOR THE PURCHASE OF WBI. SOME JURISDICTIONS DO NOT ALLOW
THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF
LIABILITY FOR CERTAIN TYPES OF DAMAGES. THEREFORE, SOME OF THE ABOVE
LIMITATIONS IN THIS SECTION AND ELSEWHERE IN THE TERMS MAY NOT APPLY
TO A PURCHASER. IN PARTICULAR, NOTHING IN THESE TERMS SHALL AFFECT THE
STATUTORY RIGHTS OF ANY PURCHASER OR EXCLUDE INJURY ARISING FROM ANY
WILFUL MISCONDUCT OR FRAUD OF THE CHINTAI TEAM.</p>
        <p>The CHINTAI Team is not liable for failure to perform solely caused by:</p>
        <ul>
          <li>unavoidable casualty,</li>
          <li>delays in delivery of materials,</li>
          <li>embargoes,</li>
          <li>government orders,</li>
          <li>acts of civil or military authorities,</li>
          <li>acts by common carriers,</li>
          <li>emergency conditions (including weather conditions),</li>
          <li>security issues arising from the technology used,</li>
        </ul>
        <p>or any similar unforeseen event that renders performance commercially implausible. If
        an event of force majeure occurs, the party injured by the other's inability to perform
        may elect to suspend the Terms, in whole or part, for the duration of the force majeure
        circumstances. The party experiencing the force majeure circumstances shall
        cooperate with and assist the injured party in all reasonable ways to minimize the
impact of force majeure on the injured party.</p>
        <p><b>No Waiver</b></p>
        <p>Any failure of the Company to enforce strict performance by the Purchaser of any
        provision of these Terms and Conditions, or Company failure to exercise any right under
        these Terms and Conditions shall not be construed as a waiver or relinquishment of the
        Company's right to assert or rely upon any such provision or right in that or any other
        instance. The express waiver by the Company of any provision, condition, or
        requirement of this Agreement shall not constitute a waiver of any future obligation to
        comply with such provision, condition or requirement. Except as expressly and
        specifically set forth in this Agreement, no representations, statements, consents,
        waivers, or other acts or omissions by the CHINTAI Team shall be deemed a
modification of these Terms nor be legally binding.</p>
      </li>
      <li><b>TAXATION RELATED TO THE TOKEN SALE</b>
        <p>The Purchaser bears the sole responsibility to determine if the purchase of WBI
tokens with EOS or the potential appreciation or depreciation in the value of WBI
tokens over time has tax implications for the Purchaser in the Purchaser's home
jurisdiction. By purchasing WBI tokens, and to the extent permitted by law, the
Purchaser agrees not to hold any of the Company, its affiliates, shareholders, director,
or advisors liable for any tax liability associated with or arising from the purchase of
WBI tokens.</p></li>
      <li>
        <b>UPDATES TO THE TERMS AND CONDITIONS</b>
        <p>The Company reserves the right, at its sole discretion, to change, modify, add, or
      remove portions of the Terms and Conditions at any time during the sale by posting the
      amended Terms and Conditions on the website. Any Purchaser will be deemed to have
      accepted such changes by purchasing WBI tokens. The Terms and Conditions may
      not be otherwise amended except by express consent of both the Purchaser and the
Company.</p>
      </li>
      <li>
        <b>COOPERATION WITH LEGAL AUTHORITIES</b>
        <p>The Company will cooperate with all law enforcement enquiries, subpoenas, or requests
      provided they are fully supported and documented by the law in the relevant
jurisdictions.</p>
      </li>
      <li>
        <b>INDEMNIFICATION</b>
        <p>To the fullest extent permitted by applicable law, you will indemnify, defend and hold
harmless the CHINTAI Team from and against all claims, demands, actions, damages,
losses, costs and expenses (including attorneys’ fees) that arise from or relate to: (i) your
purchase or use of WBI; (ii) your responsibilities or obligations under these Terms; (iii)
your violation of these Terms; or (iv) your violation of any rights of any other person or
entity.</p>
        <p>The Company reserves the right to exercise sole control over the defense, at your
        expense, of any claim subject to indemnification under this Section 18. This indemnity is
        in addition to, and not in lieu of, any other indemnities set forth in a written agreement
between you and the Company.</p>
      </li>
      <li>
        <b>SECURITY</b>
        <p>You are responsible for implementing reasonable measures for securing the wallet,
vault or other storage mechanism you use to receive and hold WBI tokens purchased
from the Company, including any requisite private key(s) or other credentials necessary
to access such storage mechanism(s). If your private key(s) or other access credentials
are lost, you may lose access to your WBI tokens. The Company is not responsible for
any losses, costs or expenses relating to lost access credentials.</p>
      </li>
      <li>
        <b>LANGUAGE VERSIONS</b>
        <p>Currently only English versions of any CHINTAI communication is considered official.
The English version shall prevail in case of differences in translation.</p>
      </li>
      <li><b>GOVERNING LAW</b>
        <p>The Terms, the arbitration clause contained in them, and all non-contractual obligations
arising in any way whatsoever out of or in connection with these Terms are governed
by, construed, and take effect in accordance with English law.</p></li>
      <li>
        <b>ARBITRATION</b>
        <p>Any dispute or difference arising out of or in connection with these Terms and
      Conditions or the legal relationships established by these Terms, including any question
      regarding its existence, validity or termination (“Dispute”), shall be referred to and finally
      resolved by arbitration under the LCIA Rules, which will be deemed to be incorporated
      by reference into this clause, save for any waiver of any rights the parties would
      otherwise have to any form of appeal or recourse to a court of law or other judicial
      authority, which rights are expressly reserved. The number of arbitrators shall be three.
      The place of arbitration shall be Zug, Switzerland. The arbitration procedure shall be
      conducted in English. The Swiss federal court (Bundesgericht) will have exclusive
jurisdiction over any appeals of an arbitration decision​ .</p>
        <p>A dispute arising out of or related to these Terms is personal to you and the Company
        and will be resolved solely through individual arbitration and will not be brought as a
        class arbitration, class action or any other type of representative proceeding. A Dispute
        cannot be brought as a class or other type of representative action, whether within or
outside of arbitration, or on behalf of any other individual or group of individuals.</p>
      </li>
    </ol>
    <p><b>ANNEX A</b></p>
    <p><b>WBI Risks</b></p>
    <p>By purchasing, owning, and using WBI, you expressly acknowledge and assume the following
risks:</p>
    <ol>
      <li><b>Risk​ ​ of​ ​ Losing​ ​ Access​ ​ to​ ​ WBI ​ Due​ ​ to​ ​ Loss​ ​ of​ ​ Private​ ​ Key(s),​ ​ Custodial​ ​ Error​ ​ or
urchaser Error</b>
        <p>A private key, or a combination of private keys, is necessary to control and dispose of WBI
        stored in your digital wallet or vault. Accordingly, loss of requisite private key(s) associated with
        your digital wallet or vault storing WBI will result in loss of such WBI. Moreover, any third
        party that gains access to such private key(s), including by gaining access to login credentials
        of a hosted wallet service you use, may be able to misappropriate your WBI. Any errors or
        malfunctions caused by or otherwise related to the digital wallet or vault you choose to receiveand store WBI in, including your own failure to properly maintain or use such digital wallet or
        vault, may also result in the loss of your WBI. Additionally, your failure to follow precisely the
        procedures set forth in for buying and receiving Tokens, including, for instance, if you provide
        the wrong address for the receiving WBI, or provides an address that is not EOS compatible,
may result in the loss of your Tokens.</p></li>
      <li>
        <b>Risks​ ​ Associated​ ​ with​ ​ the​ ​ EOS​ ​ Protocol & WBI Auction.</b>
        <p>Because WBI and the CHINTAI platform are based on the EOS protocol, any malfunction,
      breakdown or abandonment of the EOS protocol may have a material adverse effect on the
      platform or WBI auction itself. Moreover, advances in cryptography, or technical advances
      such as the development of quantum computing, could present risks to the WBI token and
      the platform, including the utility of the WBI for obtaining services, by rendering ineffective
the cryptographic consensus mechanism that underpins the EOS protocol.</p>
      </li>
      <li>
        <b>Risk​ ​ of​ ​ Hacking​ ​ and​ ​ Security​ ​ Weaknesses</b>
        <p>Hackers or other malicious groups or organizations may attempt to interfere with the platform
or WBI in a variety of ways, including, but not limited to, malware attacks, denial of service
attacks, consensus-based attacks, Sybil attacks, smurfing, and spoofing. Furthermore, because
the platform is based on open-source software, there is a risk that a third party or a member of
the Company team may intentionally or unintentionally introduce weaknesses into the core
infrastructure of the platform, which could negatively affect the platform and WBI, including
the utility of WBI for obtaining services.</p>
      </li>
      <li>
        <b>Risks​ ​ Associated​ ​ with​ ​ Markets​ ​ for​ ​ WBI</b>
        <p>If secondary trading of Tokens is facilitated by third party exchanges, such exchanges may be
relatively new and subject to little or no regulatory oversight, making them more susceptible to
fraud or manipulation. Furthermore, to the extent that third-parties do ascribe an external
exchange value to WBI (e.g., as denominated in a digital or fiat currency), such value may be
extremely volatile.</p>
      </li>
      <li>
        <b>Risk​ of​​ Uninsured​ Losses</b>
        <p>Unlike bank accounts or accounts at some other financial institutions, WBI are uninsured
unless you specifically obtain private insurance to insure them. Thus, in the event of loss or loss
of utility value, there is no public insurer or private insurance arranged by Company, to offer
recourse to you.</p>
      </li>
      <li>
        <b>Risks​ ​ Associated​ ​ with​ ​ Uncertain​ ​ Regulations​ ​ and​ ​ Enforcement​ ​ Actions</b>
        <p>
          The regulatory status of WBI and distributed ledger technology is unclear or unsettled in
many jurisdictions. It is difficult to predict how or whether regulatory agencies may apply
existing regulation with respect to such technology and its applications, including the CHINTAI
platform and WBI. It is likewise difficult to predict how or whether legislatures or regulatory
agencies may implement changes to law and regulation affecting distributed ledger
technology and its applications, including the platform and WBI. Regulatory actions could
negatively impact the platform and WBI in various ways, including, for purposes of illustration
only, through a determination that the purchase, sale and delivery of WBI constitutes
unlawful activity or that WBI are a regulated instrument that require registration or licensing
of those instruments or some or all of the parties involved in the purchase, sale and delivery
thereof. The Company may cease operations in a jurisdiction in the event that regulatory
actions, or changes to law or regulation, make it illegal to operate in such jurisdiction, or
commercially undesirable to obtain the necessary regulatory approval(s) to operate in such
jurisdiction.
                    </p>
      </li>
      <li>
        <b>Risks​ ​ Arising​ ​ from​ ​ Taxation</b>
        <p>The tax characterization of WBI is uncertain. You must seek your own tax advice in
connection with purchasing WBI, which may result in adverse tax consequences to you,
including withholding taxes, income taxes and tax reporting requirements.</p>
      </li>
      <li>
        <b>Risks​ ​ Arising​ ​ from​ ​ Lack​ ​ of​ ​ Governance​ ​ Rights</b>
        <p>Because WBI confer no governance rights of any kind with respect to the CHINTAI platform
or the Company, all decisions involving the Company’s products or services within the platform
or the Company itself will be made by the Company at its sole discretion. These decisions could
adversely affect the platform and the utility of any WBI you own, including their utility for
obtaining services.</p>
      </li>
      <li><b>Unanticipated​ ​ Risks</b>
        <p>Cryptographic tokens such as WBI are a new and untested technology. In addition to the risks
included in this Annex A of these Terms, there are other risks associated with your purchase,
possession and use of WBI, including unanticipated risks. Such risks may further materialize
as unanticipated variations or combinations of the risks discussed in this Annex A of these
Terms.</p></li>
    </ol>
    <p>EXHIBIT A</p>
    <p><b>DEFINITION OF U.S. PERSON</b></p>
    <p>Rule 902 of the U.S. Securities Act of 1933</p>
    <ol>
      <li>
        <p>“U.S. Person” means:</p>
        <ol>
          <li>any natural person resident in the United States;</li>
          <li>any partnership or corporation organized or incorporated under the laws of the United
States;</li>
          <li>any estate of which any executor or administrator is a U.S. Person;</li>
          <li>any trust of which any trustee is a U.S. Person;</li>
          <li>any agency or branch of a non-U.S. entity located in the United States;</li>
          <li>any non-discretionary account or similar account (other than an estate or trust) held by a
dealer or other fiduciary for the benefit or account of a U.S. Person;</li>
          <li>any discretionary account or similar account (other than an estate or trust) held by a dealer
or other fiduciary organized, incorporated, or (if an individual) resident in the United States;</li>
          or
<li>any partnership or corporation if:
  <ol>
              <li>organized or incorporated under the laws of any non-U.S. jurisdiction; and</li>
              <li>formed by a U.S. Person principally for the purpose of investing in securities not
          registered under the Act, unless it is organized or incorporated, and owned, by
          accredited investors (as defined in Rule 501(a) under the Act) who are not natural
persons, estates or trusts.</li>
            </ol>
          </li>
        </ol>
      </li>
      <li>
        Notwithstanding (1) above, any discretionary account or similar account (other than an
estate or trust) held for the benefit or account of a non-U.S. Person by a dealer or other
professional fiduciary organized, incorporated, or (if an individual) resident in the United States
shall not be deemed a “U.S. Person”.
                  </li>
      <li>
        Notwithstanding (1) above, any estate of which any professional fiduciary acting as executor
or administrator is a U.S. Person shall not be deemed a U.S. Person if:
                    <ol>
          <li>an executor or administrator of the estate who is not a U.S. Person has sole or shared
investment discretion with respect to the assets of the estate; and</li>
          <li>the estate is governed by non-U.S. law.</li>
        </ol>
      </li>
      <li>
        Notwithstanding (1) above, any trust of which any professional fiduciary acting as trustee is a
U.S. Person shall not be deemed a U.S. Person if a trustee who is not a U.S. Person has sole or
shared investment discretion with respect to the trust assets, and no beneficiary of the trust
(and no settlor if the trust is revocable) is a U.S. Person.
                  </li>
      <li>
        Notwithstanding (1) above, an employee benefit plan established and administered in
accordance with the law of a country other than the United States and customary practices
and documentation of such country shall not be deemed a U.S. Person.
                  </li>
      <li>
        Notwithstanding (1) above, any agency or branch of a U.S. Person located outside the United
States shall not be deemed a “U.S. Person” if:
  <ol>
          <li>the agency or branch operates for valid business reasons; and</li>
          <li>the agency or branch is engaged in the business of insurance or banking and is subject to
substantive insurance or banking regulation, respectively, in the jurisdiction where located.</li>
        </ol>
      </li>
      <li>The International Monetary Fund, the International Bank for Reconstruction and
Development, the Inter-American Development Bank, the Asian Development Bank, the
African Development Bank, the United Nations, and their agencies, affiliates and pension plans,
and any other similar international organizations, their agencies, affiliates and pension plans
shall not be deemed “U.S. Persons.</li>
    </ol>
    <p>IF YOU DO NOT AGREE TO THESE TERMS, DO NOT PURCHASE WBI FROM
THE COMPANY. BY PURCHASING WBI FROM THE COMPANY, YOU WILL BE
BOUND BY THESE TERMS AND ANY TERMS INCORPORATED BY REFERENCE.
IF YOU HAVE ANY QUESTIONS REGARDING THESE TERMS, PLEASE CONTACT
THE COMPANY AT <a href={"mailto:hello@chintai.io"}>hello@chintai.io</a></p>
  </TermsContainer>
)

@inject("stores")
@observer
export default class TermsPage extends Component<IStoreProps & { regionRestricted: boolean }> {
  render() {
    return (
      <FlexColumn>
        <Header />
        <Body>
          <LandingRow>
            <RowInner>
              <PageColumn>
                <TermsIslandContainer>
                  {getTosContent()}
                </TermsIslandContainer>
              </PageColumn>
            </RowInner>
          </LandingRow >
        </Body >
        <Footer />
        <ToastContainer transition={Flip} className={"toastContainer"} toastClassName={"notifyContainer"} bodyClassName={"notifyBody"} progressClassName={"notifyProgress"} draggable={false} closeOnClick={false} />
      </FlexColumn >
    )
  }
}
