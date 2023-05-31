# Project Overview

## Goal

The project goal is to explore creating an on-chain market for financial contracts. We conduct two experiments to investigate the merits of a fully on chain solution and hybrid solution with NFT's on chain and the option terms off chain.

### The Flow

1. Buyer (of options) swaps real cash for on chain stable coin tokens.
2. Seller (of options) offers contracts with a premium payable in a Stable Coin.
3. Seller mints (creates) an on-chain version of the option as either (a) An ERC721 NFT or (b) A fully on chain contract.
4. Buyer pays premium in Stable Coin to seller.
5. Seller Transfers option to Buyer.
6. Option is valued using on-chain reference levels for cash equities, where price is securely updated from trusted off chain source.
7. Buyer exercises option and receives the zero or the positive value of the option paid in an agreed stable coin or stable share
8. The option is reverted to seller who burns (terminates) the option.

### Concepts

#### Market Participants

In the example we have the following participants, all of who identify themselves with a secure on chain wallet. The wallet is both their identity on chain and also the place where ownership of digital assets are registered.
| Participant | Role |
| ----------| -----|
| Seller | The seller of options |
| Buyer | The Buyer of options |
| Data Source | The trusted source of prices & levels |
| Escrow | The account that mints table coins ans stable shares

#### Stable Coin & Escrow

A key advantage of on-chain activity is the ability to settle directly between parties. For this we need an on chain version of cash, known as stable-coin ([ERC20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)).
A stable coin is traded 1:1 with its underlying currency, for this 1:1 value to hold the stale-coin issuer must hold the same amount of physical currency (or equivalent) to back the stable coin. In our project we mock this up as an Escrow account that mints and burns Tokens on as 'real' currency is transfer to/from it.

#### Stable Share and Escrow

In our example we also wanted to be able to simulate 'physical' settlement where shares can be delivered as payment instead of cash. The ([ERC20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)) token is not cash specific, so we use the same concept to model on chain shares. We use the Escrow account concept again, except this time the account mins/burns stable share tokens based on the deposit / withdrawal of real shares.

#### Secure Level

To value option or any contract we need a trusted source of levels / prices of things on which the option contract depends. We chose to model these as custom on chain secure smart contracts. They are secure as the price can only be updated by the trusted source (Wallet) and where the contract validates that all updates are from that account.

#### Option

This is handled in two way to allow us to investigate the relative merits of the solutions.

A. Option is modeled as an [ERC721](https://eips.ethereum.org/EIPS/eip-721) NFT.
B. Option is modeled as fully on chain custom smart contract

In both cases the flow is the same, as we will see later in this document.

A critical point here from a business point of view that the transfer of the digital asset would need to be recognized legally and by regulators as a transfer of title. This would then be defensible in a legal setting. It would also trigger issues such as stamp-duty and other taxes in the countries where the transfer of title and value was seen to have happened. At the time of writing this document this area is nascent and has many unresolved issues. So this would be the impediment to any real world solution rather than challenges with the technology.

#### User Interface

The market participants need a way to interact. In this technology setting this is most likely to be a Javascript powered Web Page and/or server that interacts with the on and off-chain elements. It's not possible to interact directly with the on-chain contracts, other than having some basic capability via the Waller service such as [MetaMask](https://metamask.io/). This interaction is limited to standardized contract types such as [ERC20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) and [ERC721](https://eips.ethereum.org/EIPS/eip-721) which is why we have used them in this example.

#### Gas Fees

All of the on-chain servers run on a network such as [ethereum](https://ethereum.org/en/) or [Polygon](https://wiki.polygon.technology/docs/develop/getting-started). In effect these are distributed compute environment that use distributed ledger technology to manage coins and smart-contracts. They are unable to offer their services for free as they need to pay for the operation of the platform. So to recover this cost they charge [gas fees](https://ethereum.org/en/developers/docs/gas/) for things done on chain such as deploying contracts, running smart contract functions, storing data etc.

We explore the concept of fully on chain and Hybrid because of gas fees, as gas fees can become significant when you perform lots of operations or when the market is busy and resources are contested. So the fully on chain version would be much more expensive in terms of gas fees than the hybrid solution, however the hybrid solution would also have to pay cloud provider fees to host the off chain elements. As such investigating this balance is part of our goals.

## Design one - Hybrid

![Design With NFT](./resources/OnChainFinancialContracts.png)

## Design one - Fully On Chain

Coming Soon.

