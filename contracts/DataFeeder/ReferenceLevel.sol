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
 ** @title Implements protocol for option reference levels
 */
abstract contract RefernceLevel is Ownable, ERC20Pausable {
    
    /**
     ** @notice Get the current price of the reference entity
     ** @return The current price of thereference level
     */
    function getPrice() public virtual view returns(int256);
}
