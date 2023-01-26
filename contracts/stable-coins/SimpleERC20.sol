// contracts/OceanToken.sol
// SPDX-License-Identifier: MIT

// Simple ERC20 Token

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleERC20 is Ownable, ERC20 {
    constructor() ERC20("Simple Token", "TKN") {}

    // All minting is to the owner account, the minted funds are then transfered out
    function mint(uint8 amount) public onlyOwner {
        super._mint(this.owner(), amount);
    }

    function burn(uint8 amount) public onlyOwner {
        super._burn(this.owner(), amount);
    }
}
