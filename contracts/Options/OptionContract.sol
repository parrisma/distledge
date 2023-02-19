// SPDX-License-Identifier: MIT

// Abstract Base contract for Options

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../stable-coins/ERC20StableCoin.sol";

/**
 ** @author Mark Parris
 ** @title Implements protocol for option contracts
 */
abstract contract OptionContract is Ownable, ERC20Pausable {
    event DealStruck(address _buyer, address _seller, string _uniqueId);
    event Valuation(
        address _buyer,
        address _seller,
        string _uniqueId,
        uint256 value
    );
    event Exercised(address _buyer, address _seller, string _uniqueId);

    address internal _seller;
    address internal _buyer;
    string internal _uniqueId;
    string internal _name;
    string internal _description;
    uint256 internal _premium;
    string internal _premiumCcy;
    string internal _settlementCcy;
    bool private _alive;

    constructor(
        string memory uniqueId_,
        string memory name_,
        string memory description_,
        address buyer_,
        uint256 premium_,
        string memory premiumcCcy_,
        string memory settlementCcy_
    ) Ownable() Pausable() {
        super._pause();
        _alive = false; // Deal is not alive until terms accepted by buyer
        _seller = msg.sender;
        _name = name_;
        _description = description_;
        _buyer = buyer_;
        _uniqueId = uniqueId_;
        _premium = premium_;
        _premiumCcy = premiumcCcy_;
        _settlementCcy = settlementCcy_;
    }

    /**
     ** @notice Get the written terms of the contract
     ** @return The written terms of the contract
     */
    function terms() public virtual returns (string memory);

    /**
     ** @notice Return the current valuation of the contract
     ** @return the current value of the contract in the nominated ERC20 Token.
     */
    function valuation() public virtual returns (uint256);

    /**
     ** @notice Exercise the option and pay valuation to buyer if > 0
     ** @return the current value of the contract in the nominated ERC20 Token.
     */
    function exercise() public virtual returns (uint256);

    /**
     ** @notice Accept the terms by paying the premium
     ** @return true when done.
     */
    function acceptTerms(ERC20StableCoin premium)
        public
        virtual
        onlyBuyer
        returns (bool)
    {
        require(
            _alive = false,
            "OptionContract: Terms already accepted and option contract is live"
        );
        require(
            keccak256(bytes(premium.isoCcyCode())) ==
                keccak256(bytes(_premiumCcy)),
            "OptionContract: Supplied premium in wrong token currency"
        ); //
        require(
            premium.allowance(_buyer, address(this)) >= _premium,
            "OptionContract: Buyer must pre-authorise transfer of premium"
        );

        premium.transferFrom(_buyer, address(this), _premium);

        _alive = true;
        super._unpause();

        emit DealStruck(_buyer, _seller, _uniqueId);

        return (true);
    }

    /**
     ** @notice Return the address of the contract instance.
     ** @return the contract instance address.
     */
    function contractAddress() public view returns (address) {
        return address(this);
    }

    /**
     ** @notice Throws if not registered buyer
     **/
    modifier onlyBuyer() {
        _checkBuyer();
        _;
    }

    /**
     * @notice Throws if the sender is not the owner.
     */
    function _checkBuyer() internal view virtual {
        require(
            _buyer == _msgSender(),
            "OptionContract: caller is not the buyer"
        );
    }
}
