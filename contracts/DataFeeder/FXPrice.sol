// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ReferenceLevel.sol";

/**
 ** @title Secure (validated) off Chain source of FX Rate prices
 **
 ** @notice Used as secure source of off-chain FX Rates to drive derivatives valuations & token exchanges
 */
contract FXPrice is RefernceLevel {
    /**
     ** @notice Construct an FX Rate contract
     **
     ** @param ticker_ The price ticker by which the FX rate price is known
     ** @param description_ A human readble (short) description of the FX rate price e.g. 'USD to CNY Spot rate'
     ** @param priceFeedAddress_ The wallet / Account address that will be required to make the secure / signed rate updates
     ** @param decimals_ The number of decimal that the rate is quoted to e.g. 5 decimal places.
     */
    constructor(
        string memory ticker_,
        string memory description_,
        address priceFeedAddress_,
        uint256 decimals_
    ) RefernceLevel(ticker_, description_, priceFeedAddress_, decimals_) {
        setGreaterThanZero(); // FX Rates must be greater than or equal to zero
    }
}
