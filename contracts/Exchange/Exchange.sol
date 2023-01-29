// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../stable-coins/ERC20StableCoin.sol";
import "./Deal.sol";

contract Exchange is Ownable {

    struct MarketMaker {
        address marketMaker;
        ERC20StableCoin sellToken;
        ERC20StableCoin buyToken;
        uint256 rate;
        uint256 minSize;
        uint256 maxSize;
    }

    constructor() Ownable() {
    }
}