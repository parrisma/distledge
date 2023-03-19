// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ReferenceLevel.sol";

/**
 ** @title Secure (validated) off Chain source of equity prices
 **
 ** @notice Used as secure source of off-chain equity prices to drive derivatives valuations.
 */
contract EquityPrice is RefernceLevel {
    /**
     ** @notice Construct an EquityPrice contract
     **
     ** @param ticker_ The price ticker by which the equity price is known
     ** @param description_ A human readble (short) description of the equity price e.g. 'TESLA Common Stock US Listed'
     ** @param priceFeedAddress_ The wallet / Account address that will be required to make the secure / signed price updates
     ** @param decimals_ The number of decimal that the equity price is quoted to e.g. is USD the 2 as USD is in cents to 2DP
     */
    constructor(
        string memory ticker_,
        string memory description_,
        address priceFeedAddress_,
        uint256 decimals_
    ) RefernceLevel(ticker_, description_, priceFeedAddress_, decimals_) {
        setGreaterEqualZero(); // Equity prices must be greater than or equal to zero.
    }
}
