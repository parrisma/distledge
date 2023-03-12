# Project Overview

## Design

### Stable Coins

ERC20 tokens are created that are used to pay for and settle the financial contracts. This means that the buyer/seller are not exposed to the volatility of crypto currencies when trading.

However, as this is all based on Ethereum, all players are exposed to Ether as a crypto currency as they need to pay the gas fees for the on chain activity.

In this project we define three token based stable coins, but any could be added. Also as all contracts are ERC20 tokens, in practice any token could be used to pay for or settle a contract.

* USD
* EUR
* CNY

### Escrow Accounts

Players are exposed to credit risk of stable coin token issuers. If the issuer does not back the token with the required funds then the token can trade below the parity value or worse fail totally. As has been seen during 2023 with some big name stable coin issuance.

To show how this might be managed, we define Escrow accounts that *own* the stable coins. By *own* we mean that only the Escrow accounts can mint or burn tokens in strict accordance with deposits and withdrawals.

This only works if the Escrow manager is independent and the balances are public. To this end these demo Escrow accounts have a public audit function that compares the total token (coin) in circulation with the balance of the *real* currency account.

The real currency account will only transact given a validated transaction id that validates the deposit / withdraw activity.

### Prices & Rates

Financial contracts depend on validated reference levels, such as stock prices and FX rates. These need to be injected on chain from a secure, validated and trusted source.

So we create contracts that support this injection where only a validated source account can update these levels. Also all updates are required to be signed by this source such that we can eliminate (reduce) agent in the middle attacks.

## Contract Types

The contract types are as below

1. Stable Coins - ERC20 Token
2. Escrow Accounts - Contracts to manage mint and burn of a linked Stable Coin
3. Secure Data Feeds - Secure injection of off chain prices and rates
4. Financial Contracts - Contract that pay off on a given pre agreed formula.