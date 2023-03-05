// SPDX-License-Identifier: MIT

// Abstract Base contract for Options

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./SimpleOption.sol";
import "../DataFeeder/ReferenceLevel.sol";
import "../stable-coins/ERC20StableCoin.sol";

contract SimplePutOption is SimpleOption {
    constructor(
        string memory uniqueId_,
        string memory name_,
        string memory description_,
        address buyer_,
        uint256 premium_,
        address premiumToken_,
        address settlementToken_,
        uint256 notional_,
        uint256 strike_,
        address referenceLevel_,
        address fxReferenceLevel_
    )
        SimpleOption(
            uniqueId_,
            name_,
            description_,
            buyer_,
            premium_,
            premiumToken_,
            settlementToken_,
            notional_,
            strike_,
            referenceLevel_,
            fxReferenceLevel_
        )
    {}

    /**
     ** @notice Get the written terms of the contact
     ** @return The written terms of the contact
     */
    function terms()
        public
        view
        override
        onlyBuyerOrSeller
        returns (string memory)
    {
        return
            string.concat(
                "Simple Put Option on [",
                _referenceLevel.getTicker(),
                "] with a strike of [",
                Strings.toString(_strike),
                "] and a premium of [",
                Strings.toString(_premium),
                "] paid in [",
                _premiumToken.symbol(),
                "] settled in [",
                _settlementToken.symbol(),
                "] unique reference of [",
                _uniqueId,
                "]"
            );
    }

    /**
     ** @notice Return the current valuation of the contact
     ** @return the current value of the contract in the nominated ERC20 Token.
     */
    function valuation()
        public
        view
        override
        whenNotPaused
        onlyBuyerOrSeller
        returns (uint256)
    {
        if (_strike < _referenceLevel.getPrice()) {
            return 0;
        }
        uint256 value = (_notional * (_strike - _referenceLevel.getPrice()));
        return value;
    }
}
