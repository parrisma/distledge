// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../stable-coins/ERC20StableCoin.sol";
import "./Deal.sol";

/*
** @author Mark Parris
** @title A Token FX deal (token swap) quanity of sellToken swapped for quantity * rate of buyToken
** @param seller - address of seller who will get quantity * rate of buyToken
** @param buyer - address of buyer who will get quantoty of sellToken
** @param sellToken - the token being sold 
** @param buyToken - the token being bought at given rate 
** @param quantity - the quantity of the deal
** @param rate - the rate of the FX as a % where 100% = 100% and 55% = 55 etc.
*/
contract FXDeal is Ownable, Deal {
    address private _seller;
    address private _buyer;
    ERC20StableCoin private _sellToken;
    ERC20StableCoin private _buyToken;
    uint256 private _quantity;
    uint256 private _rate;

    constructor(
        address seller_,
        address buyer_,
        ERC20StableCoin sellToken_,
        ERC20StableCoin buyToken_,
        uint256 quantity_,
        uint256 rate_
    ) Ownable() {
        require(rate_ > 0, "Deal: Conversion rate cannot be zero");
        require(quantity_ > 0, "Deal: Quantity must be greater than zero");
        require(seller_ != address(0), "Deal: Invalid seller address");
        require(buyer_ != address(0), "Deal: Invalid buyer address");

        _seller = seller_;
        _buyer = buyer_;
        _sellToken = sellToken_;
        _buyToken = buyToken_;
        _rate = rate_;
        _quantity = quantity_;
    }

    /*
     ** @author Mark Parris
     ** @notice If buyer and seller have approved allowance to the deal, execute the token swap at given quantity and rate. This is one shot, so if successful execute cannot be called more than once.
     ** @return true if deal done.
     ** ToDo: extend so the deal has a 'time to live' limit, such that deal is only valid for a specified time.
     */
    function execute() public override onlyOwner returns (bool) {
        uint256 sellerAllowance = _sellToken.allowance(_seller, address(this));
        uint256 buyerAllowance = _buyToken.allowance(_buyer, address(this));
        require(
            sellerAllowance >= this.sellQuantity(),
            "Seller has not granted sufficent allowance for Deal"
        );
        require(
            buyerAllowance >= this.buyQuantity(),
            "Buyer has not granted sufficent allowance for Deal"
        );
        _sellToken.transferFrom(_seller, _buyer, this.sellQuantity());
        _buyToken.transferFrom(_buyer, _seller, this.buyQuantity());
        renounceOwnership(); // Deal is one shot, execute can be called only once
        return true;
    }

    /*
     ** @author Mark Parris
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

    /*
     ** @author Mark Parris
     ** @notice Gives the quantity of the buyToken recived by the seller
     ** @return The token quantity recived by the buyer = quantity * rate
     */
    function buyQuantity() public view returns (uint256) {
        return (_quantity * _rate) / 100;
    }

    /*
     ** @author Mark Parris
     ** @notice Gives the quantity of the SellToken recived by the buyer
     ** @return The token quantity recived by the seller = quantity
     */
    function sellQuantity() public view returns (uint256) {
        return _quantity;
    }
}
