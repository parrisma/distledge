HARDHAT WORKSPACE

Project to explore the use of solidity contracts to trade financial derivatives

1. Stable Coins (Tokens)

    Use of ERC20 Tokens to model curreny stable coins.

    This removes volatility exposure of participants from underlying Crypto ccys

2. Secure Data Feeds

    Financial derivatives need access to secure and authenticated feeds of reference
    data. This allows the value of the derivative contract to be calculated in a way
    that all prticipants can trust the calcuated contract values that depend on those
    values.

3. Immutable Derivatives Contracts

    Use of contracts in a NFT style, with one contract instance per bi-party agreement
    where the contract instance is paramaterised at construction to meet the agreed terms.
    This is then ack'ed by all parties at which point it becomes an Immutable means to
    calcuate the value of the agreement until it is terminated / expired / excercised.

    The fees (premiums) and final value is settled via the stable coin (tokens)

    When the contract is queried it consumes up to date refernce data via the secure
    authenticated sources and calculates the current value.