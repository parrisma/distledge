// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../stable-coins/ERC20StableCoin.sol";
import "./Deal.sol";

/**
 ** @author Mark Parris
 ** @title A Token FX deal (token swap) quanity of sellToken swapped for quantity * rate of buyToken
 ** @param _seller - address of seller who will get quantity * rate of buyToken
 ** @param _buyer - address of buyer who will get quantoty of sellToken
 ** @param _sellToken - the token being sold
 ** @param _buyToken - the token being bought at given rate
 ** @param _quantity - the quantity of the deal
 ** @param _rate - the rate of the FX as a % where 100% = 100% and 55% = 55 etc.
 ** @param _timeToLive - the time at which deal expires and cannot be executed
 */
contract FXDeal is Ownable, Deal {
    address private _seller;
    address private _buyer;
    ERC20StableCoin private _sellToken;
    ERC20StableCoin private _buyToken;
    uint256 private _quantity;
    uint256 private _rate;
    uint256 private _timeToLive;

    constructor(
        address seller_,
        address buyer_,
        ERC20StableCoin sellToken_,
        ERC20StableCoin buyToken_,
        uint256 quantity_,
        uint256 rate_
    ) Ownable() {
        require(rate_ > 0, "FXDeal: Conversion rate cannot be zero");
        require(quantity_ > 0, "FXDeal: Quantity must be greater than zero");
        require(seller_ != address(0), "FXDeal: Invalid seller address");
        require(buyer_ != address(0), "FXDeal: Invalid buyer address");

        _seller = seller_;
        _buyer = buyer_;
        _sellToken = sellToken_;
        _buyToken = buyToken_;
        _rate = rate_;
        _quantity = quantity_;
        _timeToLive = block.timestamp + 2 minutes; // deal only valid for 2 mins
    }

    /**
     ** @notice If buyer and seller have approved allowance to the deal, execute the token swap at given quantity and rate. This is one shot, so if successful execute cannot be called more than once.
     ** @return true if deal done.
     ** ToDo: extend so the deal has a 'time to live' limit, such that deal is only valid for a specified time.
     */
    function execute() public override onlyOwner returns (bool) {
        require(timeToLive() > 0, "FXDeal: Deal has expired");
        uint256 sellerAllowance = _sellToken.allowance(_seller, address(this));
        uint256 buyerAllowance = _buyToken.allowance(_buyer, address(this));
        require(
            sellerAllowance >= this.sellQuantity(),
            "FXDeal: Seller has not granted sufficent allowance for Deal"
        );
        require(
            buyerAllowance >= this.buyQuantity(),
            "FXDeal: Buyer has not granted sufficent allowance for Deal"
        );
        _sellToken.transferFrom(_seller, _buyer, this.sellQuantity());
        _buyToken.transferFrom(_buyer, _seller, this.buyQuantity());
        renounceOwnership(); // Deal is one shot, execute can be called only once
        return true;
    }

    /**
     ** @notice Describes the full details of the deal.
     ** @return Seller, Buyer, Sell Token, Buy Token, Rate and Quantity
     */
    function info()
        public
        view
        returns (
            address,
            address,
            ERC20StableCoin,
            ERC20StableCoin,
            uint256,
            uint256
        )
    {
        return (_seller, _buyer, _sellToken, _buyToken, _rate, _quantity);
    }

    /**
     ** @notice Gives the quantity of the buyToken recived by the seller
     ** @return The token quantity recived by the buyer = quantity * rate
     */
    function buyQuantity() public view returns (uint256) {
        return (_quantity * _rate) / 100;
    }

    /**
     ** @notice Gives the quantity of the SellToken recived by the buyer
     ** @return The token quantity recived by the seller = quantity
     */
    function sellQuantity() public view returns (uint256) {
        return _quantity;
    }

    /**
     ** @dev A ticker (symbol) for the deal
     */
    function ticker() public view override returns (string memory) {
        return (string.concat(_sellToken.isoCcyCode(), _buyToken.isoCcyCode()));
    }

    /**
     ** @notice The seller offering the deal.
     ** @return address of seller offering the deal
     */
    function seller() public view override returns (address) {
        return (_seller);
    }

    /**
     ** @notice The number of seconds the deal has remaining before it cannot be executed
     ** @return Number of seconds before deal cannot be executed.
     */
    function timeToLive() public view override returns (uint256) {
        uint256 timeInSecondsRemaining = 0;
        if (_timeToLive > block.timestamp) {
            timeInSecondsRemaining = _timeToLive - block.timestamp;
        }
        return (timeInSecondsRemaining);
    }
}
