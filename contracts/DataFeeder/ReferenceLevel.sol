// SPDX-License-Identifier: MIT

// Abstract Base contract for Options

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "../SecureLevel/SecureLevel.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 ** @author Mark Parris
 ** @title Implements protocol for off chain reference levels
 */
abstract contract RefernceLevel is Ownable, SecureLevel {
    uint256 internal _decimals;
    string internal _ticker;

    constructor(
        string memory ticker_,
        string memory description_,
        address priceFeedAddress_,
        uint256 decimals_
    ) SecureLevel(ticker_, description_) {
        require(
            priceFeedAddress_ != address(0),
            "EquityPrice: must supply valid price feed address"
        );
        _decimals = decimals_;
        setExpectedSigner(priceFeedAddress_); // price source will have to sign all updates
    }

    /**
     ** @notice Get the number of decimal places of the refernce level.
     ** @return The number of dp of the reference level.
     */
    function getDecimals() public view virtual returns (uint256) {
        return _decimals;
    }
}
