// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ReferenceLevel.sol";

contract EquityPrice is RefernceLevel {
    constructor(
        string memory ticker_,
        address priceFeedAddress_
    ) RefernceLevel(ticker_, priceFeedAddress_) {}

    /**
     ** @notice Get unique ticker name of the refernce level source
     ** @return The unique ticker name
     */
    function getTicker() public view override returns (string memory) {
        return _ticker;
    }

    /**
     ** @notice Get lastest price from chainlink-data-feed which provides a secure, reliable, and decentralized source of off-chain data
     ** @return The latest price as uint256 as equity prices are always >= 0
     */
    function getPrice() public view override returns (uint256) {
        (, int256 price, , , ) = _priceFeed.latestRoundData();

        require(
            price >= 0,
            "EquityPrice: bad data feed, prices must be greater(equals) than zero"
        );
        return uint256(price);
    }
}
