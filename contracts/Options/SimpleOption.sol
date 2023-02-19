// SPDX-License-Identifier: MIT

// Abstract Base contract for Options

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./OptionContract.sol";
import "../DataFeeder/ReferenceLevel.sol";

/**
 ** @author Mark Parris
 ** @title Trival option that pays max(0, notional * (strike - reference))
 */
abstract contract SimpleOption is OptionContract {
    uint256 _notional;
    uint256 _strike;
    RefernceLevel _referenceLevel;

    constructor(
        string memory uniqueId_,
        string memory name_,
        string memory description_,
        address buyer_,
        uint256 premium_,
        string memory premiumcCcy_,
        string memory settlementCcy_,
        uint256 notional_,
        uint256 strike_,
        RefernceLevel referenceLevel_
    )
        OptionContract(
            uniqueId_,
            name_,
            description_,
            buyer_,
            premium_,
            premiumcCcy_,
            settlementCcy_
        )
    {
        _notional = notional_;
        _strike = strike_;
        _referenceLevel = referenceLevel_;
    }
}
