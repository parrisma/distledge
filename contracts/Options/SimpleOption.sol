// SPDX-License-Identifier: MIT

// Abstract Base contract for Options

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./OptionContract.sol";
import "../DataFeeder/ReferenceLevel.sol";
import "../StableAsset/ERC20StableAsset.sol";

/**
 ** @author Mark Parris
 ** @title Trival option that pays max(0, notional * (reference - strike))
 */
contract SimpleOption is OptionContract {
    uint256 _notional;
    uint256 _strike;
    uint256 _updatetime;
    RefernceLevel _referenceLevel;
    RefernceLevel _fxReferenceLevel;

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
        OptionContract(
            uniqueId_,
            name_,
            description_,
            buyer_,
            premium_,
            premiumToken_,
            settlementToken_
        )
    {
        _notional = notional_;
        _strike = strike_;
        _referenceLevel = RefernceLevel(referenceLevel_);
        _fxReferenceLevel = RefernceLevel(fxReferenceLevel_);
    }

    /**
     ** @notice Get the written terms of the contract
     ** @return The written terms of the contract
     */
    function terms()
        public
        view
        virtual
        override
        onlyBuyerOrSeller
        returns (string memory)
    {
        return
            string.concat(
                "Simple Option on [",
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
     ** @notice Return the current valuation of the contract
     ** @return the current value of the contract in the nominated underlying equity
     */
    function valuation()
        public
        view
        virtual
        override
        whenNotPaused
        onlyBuyerOrSeller
        returns (uint256)
    {
        int256 price = _referenceLevel.getVerifiedValue();
        if (_strike > uint256(price)) {
            return 0;
        }
        uint256 value = (_notional * (uint256(price) - _strike));
        return value;
    }

    /**
     ** @notice Get the current value of the settlement amount if option were to be exercised.
     ** @return The current settlment amount, this is in units of the settlementToken
     */
    function settlementAmount()
        public
        view
        override
        whenLive
        whenNotPaused
        returns (uint256)
    {
        int256 fxRate = _fxReferenceLevel.getVerifiedValue();
        return
            (valuation() * uint256(fxRate) * _settlementToken.unitsPerToken()) /
            (10 **
                (_fxReferenceLevel.getDecimals() +
                    _referenceLevel.getDecimals())); // TODO underflow checking and handling
    }

    /**
     ** @notice Exercise the option and pay valuation to buyer if > 0
     ** @return true when done
     */
    function exercise() public override onlyBuyer whenLive returns (bool) {
        uint256 settleAmount = settlementAmount();

        if (settleAmount > 0) {
            super._settle(settleAmount);
        }

        // Contract is now dead, only un-restricted methods may be called.
        _pause();
        _alive = false;
        emit Exercised(_buyer, _seller, _uniqueId);
        _buyer = address(0); // Contract is dead forver
        return true;
    }
}
