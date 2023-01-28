// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../stable-coins/ERC20StableCoin.sol";

contract Deal is Ownable {
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
        ERC20StableCoin  buyToken_,
        uint256 quantity_,
        uint256 rate_
    ) Ownable() {
        _seller = seller_;
        _buyer = buyer_;
        _sellToken = sellToken_;
        _buyToken = buyToken_;
        _rate = rate_;
        _quantity = quantity_;
    }

    /*
    ** Seller will transfer Quantity of sellToken to Buyer
    ** Buyer will transter Quatity * rate of buyToken to Seller
    */
    function execute() public onlyOwner {
        console.log("Execute");
        _sellToken.transferFrom(_seller, _buyer, _quantity);
        _buyToken.transferFrom(_buyer, _seller, _quantity * (_rate / 100));
        renounceOwnership(); // Deal is on shot, after this execute cannot be called by anyone
    }

    function info() public {
        return {_seller, _buyer, _sellToken, _buyToken, _rate, _quantity};
    }

    function fxQuntity() private {
        return _quantity * (_rate / 100);
    }
}
