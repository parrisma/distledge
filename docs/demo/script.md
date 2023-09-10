
# Project Demo Script

## Notes

This is a script for the demo of the ideas in this project.

It is written as an interactive question and answer session between a commentator and one or more subject matter experts.

Depending on the audience, a few of the early questions can be asked directly to them to help engage them with the thought process.

## What are we going to see ?

A live demo of a full, but light weight project for how simple contingent contracts can be issued "On-Chain"

1. Contract issued On-Chain as a Non Fungible Token (NFT)
1. Paid for and settled using Tokenized cash and shares
1. Valued by a central service using digitally verified data.
1. Decentralized storage of contract details using Inter Planetary Filesystem (IPFS)
1. How smart contract standards for NFT (ERC721) & Tokens (ERC20) can work with Wallets to build a flexible eco-system

## Why do this ?

1. Q : Why use distributed ledger and smart contracts to build an options platform ?
   - Decentralized Finance ([DeFi](https://en.wikipedia.org/wiki/Decentralized_finance)) is a growing eco-system where there are no intermediaries or exchanges
   - Distributed ledger, combined with standard smart contracts ([ERC20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/), [ERC721](https://eips.ethereum.org/EIPS/eip-721)) is a becoming a rich, secure and low-friction eco-system for peer to peer tokenization and transferable, contingent obligations through non fungible tokens (NFT)
1. Q : How does the help create a market ?
    - There are a huge number and diversity of individuals and corporate on chain, and this eco-system is able to connect them without geographical or technical boundaries. With the ability to enter into contracts and settle value with any tokenized asset.
    - This level of standardization is a step beyond the current trend for flight, hotel, Insurance and other services to be consolidated via a single Web Site.
1. Q: Does it relate to Web 3
    - Yes, it is the decentralization element of the four pillars of Web 3.0
      - Decentralization
      - Trustful and Permission-less
      - Artificial Intelligence
      - Connectivity and Ubiquity

## Basic concepts

1. Q : What does "on chain" mean ?
   - This means a service where the code (smart contract) and compute resources are supplied by a distributed ledger technology such as Ethereum.
   - Let's have a look at an example.

## More

1. Q : Are there different chains or ledgers ?
   - Yes, this is becoming a competitive space to offer these services for 'gas' fees. So in the same way that we have AWS, GCP and Azure we also have many distributed ledger providers.
1. Q : Where are we in the maturity of this technology ?
   - The technology has been around for 10+ years and supports multi billion dollar flows. In this example we are using a stable generation two technology (Ethereum). The maturity gap is around the contract standards (ERC30, ERC721) and the associated financial regulation.
1. Q : What is a smart contract ?
   - A Smart contract is a piece of code that can be deployed and run on-chain. The environment is more limited that for general cloud compute, and is focused mainly on secure interaction between wallets.
1. Q : Is it free to create and run smart contracts on a chain
   - No, the providers of the network have to pay for compute and storage, and this cost is passed on as 'gas' fees. Where activity such as deploying a smart contract or causing it to use compute or storage is charged as 'gas' fees. These gas fees are paid in terms of an agreed crypto currency. It is via these gas fees that users are exposed to crypto price volatility as they must buy the crypto currency to settle the gas fees.
1. Q : What is tokenization?
   - This is where a asset such as cash, shares, property is given a virtual presence on chain. A holder of the real asset creates a divisible token that represents the the real token. To introduce more of the token the issuer mints more tokens and to withdraw the asset the issuer burns existing tokens. In many case the tokens are backed, but in some cases they are not.
1. Q : What is difference between a token and a coin ?
   - Crypto currencies have their won block chain, where as tokens piggy back on the blockchain of crypto currencies. A token can become a crypto currency by migrating itself to its own blockchain.
1. Q : How do we transact real assets on chain ?
   - Crypto currencies can be used as proxy for value, where the real asset is transfered off chain. The alternative is with Tokens and NFTs where the title is digitally transfered between wallets on chain. Then at some point in teh future the asset could be converted by the NFT or token issuer for a real asset.
1. Q : Is this secure ?
   - ...
1. Q : Given on chain ledger transactions are transparent to all, how can parties be offered privacy ?

- At all times the transaction history is visible between the wallets, so hiding wallet identity is the only option here. In terms of the contract the terms stored in IPFS could be encrypted using the cryptography keys of the participants. There are many robust mechanism for verifying identity and encrypting sensitive details. This uses the same basic cryptography as other on line financial services so is exposed to the same vulnerabilities.

1. Q : Who can interact with a smart contract

- The prerequisite is to have a digital wallet. This is a secure address crated by the participant and that can then be managed by any third party wallet service. The alternative is to have an exchange account with someone like coinbase exchange, where they transact on your behalf. However in this set-up you do not really own the asset they do and you can only transact the asset types they support.

1. Q : How can we securely identify those who we are interacting with

- It is possible to use identity authorities as are used for https. Where entities verify their identify with a trusted certificate authority, and interaction with them can be verified if they are able to produce the required signed certificate. So in this model the wallet holders can do the same, an use certificates as a means to identify who they are in these on chain interactions.

## 2. Objectives

1. Q : What did you show with the demo
   - A : That the eco system of digital wallets, tokenized assets and non-fungible tokens is sufficient to support the issuance, transacting and settlement of contingent contracts.
   - A : Also to increase the organizational intuition for this space with a view to promote thinking about how services could be offered to our customers safely
1. Q : Does ths solution involve commercial exchanges such as Binance or Coinbase ?
   - In this demo, no. However, any party that can interact with ERC20 or ERC721 could support participation in this. This is teh real power of the eco-system in that anyone can offer contracts as ERC721 NFTs in this way and settle them in any backed (stable) asset issued as ERC20.
1. Q : Is the solution impacted by the price volatility we see with crypto currencies and crypto market a activity ?
   - It is independent of the crypto markets, except where crypto currency has to be purchased to pay gas fees for the on chain activity.
1. Q : What is currently the biggest challenge with this eco-system
   - The technology is able to support the activity, the gap is with the financial regulation that would allow services to be offered in this way. Having said that there are significant developments as of summer 2023 where big players such as Black Rock are pushing regulation relating to ETF issuance. The indication are that progress will soon be seen here.
1. Q : Conversely, what is the biggest positive ?
   - A : Fully decentralized platform, with millions of participants and a rapidly growing and increasingly rich set of standards for tokenization and establishing multi party obligations.
   - A : The service can also scale quickly with marginal costs, which fits well with the market trends we see for ever smaller notional transaction at smaller premiums.
1. Q : What is holding back the further growth
   - A : The number of reputable financial services names present in this eco-system is still low, however as recently as June 2023 we are seeing big names such as Blackrock pushing the Sec for listing of on chain ETFs.
   - A: in addition, there is still a general confusion between crypto coins and the distributed ledger technology that makes them possible. Here we focus on how we leverage the technology not the crypto markets.

## 3. Anatomy

   [![Design With NFT](../resources/OnChainFinancialContracts.png)](../resources/OnChainFinancialContracts.pdf)

### 3.1 Participants

1. Q: Who are the participants ?
   - Firstly, we note that all participants must have a digital wallet as this is their on chain identity.
   - The seller, is the party who writes or issues the contracts
   - The buyer, is any party who purchases a contract, directly from the seller or another buyer
   - The Escrow, is a party that holds a physical asset (collateral) and issues backed (ERC20) tokens on chain.
   - The data provider, is a trusted party that injects data on chain, such as asset prices.

### 3.2 Key Components

1. Q: What are the key components ?
   - Tokenized assets issues as ERC20 tokens
   - NFT's as the means to represent the obligation between seller and buyer
   - The Web server, managed by the seller to hold details of contracts issued behind the NFTs, as well as to price and exercise the contracts.
   - IFPS as a means to store contract details in a decentralized way.
   - Meta-mask, or other third party Wallet able to transact ERC20 tokens or ERC721 NFTs

### 3.3 Smart Contracts

1. Q: What smart contracts are used.
   - An ERC721 smart contract to manage the NFTs associated with issued contracts
   - A set of ERC20 token to represent the tokenized cash and chares.
   - A set of bespoke contracts that represent the validated an secure prices that drive the contract valuations.
<br>

## 4 The Process Life-cycle

- Done as live demo.
  
1. Q: What is the life-cycle ?
   - The seller advertises contracts for sale on the Web server.
   - The buyer agrees to purchase a contract.
   - The seller registers the details of the sold contract on the Web server and in IPFS, for which a unique & digitally signed URI is generated.
   - The seller, *mints* an NFT via the ERC7201 smart contract for the agreed terms. Lined to the URI for the option terms.
   - The NTF is transfered from seller to buyer, for payment from buyer of the agreed amount of the agreed token.
   - The data provider (for payment) injects updated prices and the Web server updates the contract price.
   - The buyer, can choose to sell the NTF to any other digital Wallet holder for the current value.
   - At some point the buyer can choose to exercise the contract, at which point the original seller will pay the current value (if any) to the buyer in the agreed settlement token.
   - The current owner transfers the NTF back to the seller, who *burns* the NFT terminating it's on chain existence for ever
