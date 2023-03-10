// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ReferenceLevel.sol";

contract EquityPrice is RefernceLevel {
    constructor(
        string memory ticker_,
        string memory _description_,
        address priceFeedAddress_,
        uint256 decimals_
    ) RefernceLevel(ticker_, _description_, priceFeedAddress_, decimals_) {
        setGreaterEqualZero();
    }
}
