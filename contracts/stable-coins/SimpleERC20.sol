// contracts/OceanToken.sol
// SPDX-License-Identifier: MIT

// Base contract for ERC20 Based Stable Coin

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Ownable.sol";

contract SimpleERC20 is Ownable, ERC20 {

    constructor() ERC20("Simple Token","TKN")
    {}

    // All minting is to the owner account, the minted funds are then transfered out
    function mint(address account, uint8 amount) public{
        super._mint(account, amount);
    }

}
