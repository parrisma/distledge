// SPDX-License-Identifier: MIT

// Abstract Base contract for Options

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "../StableAsset/ERC20StableAsset.sol";

/**
 ** @author Mark Parris
 ** @title Implements protocol for option contracts
 */
abstract contract OptionContract is Ownable, Pausable {
    event DealStruck(address _buyer, address _seller, string _uniqueId);
    event Exercised(address _buyer, address _seller, string _uniqueId);

    address internal _seller;
    address internal _buyer;
    string internal _uniqueId;
    string internal _name;
    string internal _description;
    uint256 internal _premium;

    ERC20StableAsset internal _premiumToken;
    ERC20StableAsset internal _settlementToken;

    bool internal _alive;

    constructor(
        string memory uniqueId_,
        string memory name_,
        string memory description_,
        address buyer_,
        uint256 premium_,
        address premiumcToken_,
        address settlementToken_
    ) Ownable() Pausable() {
        super._pause();
        _alive = false; // Deal is not alive until terms accepted by buyer
        _seller = msg.sender;
        _name = name_;
        _description = description_;
        _buyer = buyer_;
        _uniqueId = uniqueId_;
        _premium = premium_;
        _premiumToken = ERC20StableAsset(premiumcToken_);
        _settlementToken = ERC20StableAsset(settlementToken_);
    }

    /**
     ** @notice Get the unique ID of the option contract
     ** @return The unique ID of the option contract
     */
    function id() public view virtual returns (string memory) {
        return _uniqueId;
    }

    /**
     ** @notice Get the premium token and the amount payable to enter into the contract
     ** @return The premium token and the contract premium
     */
    function premium()
        public
        view
        virtual
        whenNotLive
        returns (string memory tokenSymbol, uint256 optionPremium)
    {
        tokenSymbol = _premiumToken.symbol();
        optionPremium = _premium;
    }

    /**
     ** @notice Get the current value of the settlement amount if option were to be exercised.
     ** @return The current settlment amount, this is in units of the settlementToken
     */
    function settlementAmount() public view virtual returns (uint256);

    /**
     ** @notice Get the written terms of the contract
     ** @return The written terms of the contract
     */
    function terms() public view virtual returns (string memory);

    /**
     ** @notice Return the current valuation of the contract
     ** @return the current value of the contract in the nominated ERC20 Token.
     */
    function valuation() public view virtual returns (uint256);

    /**
     ** @notice Exercise the option and pay settlement amount to buyer if > 0
     ** @return true when done
     */
    function exercise() public virtual returns (bool);

    /**
     ** @notice The name of the option
     ** @return the name of the option
     */
    function OptionName() public virtual returns (string memory) {
        return _name;
    }

    /**
     ** @notice Has the option beeb struck and premium paid
     ** @return true if teh option is live.
     */
    function optionLive() public virtual returns (bool) {
        return _alive;
    }

    /**
     ** @notice Accept the terms by paying the premium
     ** @return true when done.
     */
    function acceptTerms() public virtual onlyBuyer whenNotLive returns (bool) {
        require(
            _premiumToken.allowance(_buyer, address(this)) >= _premium,
            "OptionContract: Buyer must pre-authorise transfer of premium"
        );

        _premiumToken.transferFrom(_buyer, _seller, _premium);
        _alive = true;
        _unpause();

        emit DealStruck(_buyer, _seller, _uniqueId);

        return (true);
    }

    /**
     ** @notice Settle the given amount
     ** @return true when done.
     */
    function _settle(
        uint256 amount
    ) internal onlyBuyer whenLive returns (bool) {
        require(
            _settlementToken.allowance(_seller, address(this)) >= amount,
            "OptionContract: Seller must pre-authorise transfer of settlement"
        );
        _settlementToken.transferFrom(_seller, _buyer, amount);
        return (true);
    }

    /**
     ** @notice Return the address of the contract instance.
     ** @return the contract instance address.
     */
    function contractAddress() public view onlyBuyerOrSeller returns (address) {
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
     ** @notice Throws if not registered seller
     **/
    modifier onlySeller() {
        _checkSeller();
        _;
    }

    /**
     ** @notice Throws if not registered buyer or registered seller
     **/
    modifier onlyBuyerOrSeller() {
        require(
            msg.sender == _seller || msg.sender == _buyer,
            "OptionContract: Only Seller or Buyer"
        );
        _;
    }

    /**
     ** @notice Throws if option contract is live
     **/
    modifier whenNotLive() {
        require(_alive == false, "OptionContract: Option is live");
        _;
    }

    /**
     ** @notice Throws if option contract is not live
     **/
    modifier whenLive() {
        require(_alive == true, "OptionContract: Option is not live");
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

    /**
     * @notice Throws if the sender is not the seller.
     */
    function _checkSeller() internal view virtual {
        require(
            _seller == _msgSender(),
            "OptionContract: caller is not the seller"
        );
    }
}
