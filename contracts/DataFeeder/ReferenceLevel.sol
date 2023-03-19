// SPDX-License-Identifier: MIT

// Abstract Base contract for Options

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "../SecureLevel/SecureLevel.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 ** @title Implements protocol for off chain reference levels
 **
 ** @notice Implements SecureLevel which means that all updates must come from a signed source
 ** @notice where the signed source is set by the creator of the contract.
 **
 ** @dev This is an abstract class that is intended for use creating specalised off-chain value sources.
 */
abstract contract RefernceLevel is Ownable, SecureLevel {
    uint256 internal _decimals;
    string internal _ticker;

    /**
     ** @notice Construct an EquityPrice contract
     **
     ** @param ticker_ The price ticker by which the reference level is known
     ** @param description_ A human readble (short) description of the reference level
     ** @param priceFeedAddress_ The wallet / Account address that will be required to make the secure / signed reference level updates
     ** @param decimals_ The number of decimal that the reference level is quoted to.
     */
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
