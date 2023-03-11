// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ReferenceLevel.sol";

contract FXPrice is RefernceLevel {
    constructor(
        string memory ticker_,
        string memory description_,
        address priceFeedAddress_,
        uint256 decimals_
    ) RefernceLevel(ticker_, description_, priceFeedAddress_, decimals_) {
        setGreaterThanZero();
    }
}
