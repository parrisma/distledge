// SPDX-License-Identifier: MIT

// Abstract Base contract for Options

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 ** @author Mark Parris
 ** @title Implements protocol for option reference levels
 */
abstract contract RefernceLevel is Ownable {
    AggregatorV3Interface internal _priceFeed; //Interface to chain link off-chain data
    string internal _ticker;

    constructor(string memory ticker_, address priceFeedAddress_) {
        require(
            priceFeedAddress_ != address(0),
            "EquityPrice: must supply valid price feed address"
        );
        _priceFeed = AggregatorV3Interface(priceFeedAddress_);
        _ticker = ticker_;
    }

    /**
     ** @notice Get the current price of the reference entity
     ** @return The current price of thereference level
     */
    function getPrice() public view virtual returns (uint256);

    /**
     ** @notice Get the number of decimal places of the refernce level.
     ** @return The number of dp of the reference level.
     */
    function getDecimals() public view virtual returns (uint256){
        return _priceFeed.decimals();
    }

    /**
     ** @notice Get unique ticker name of the refernce level source
     ** @return The unique ticker name
     */
    function getTicker() public view virtual returns (string memory);
}
