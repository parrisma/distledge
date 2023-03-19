// SPDX-License-Identifier: MIT

// Base contract for ERC20 Based Stable Coins

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 ** @title Stable Coin Token interface.
 */
abstract contract ERC20StableCoin is Ownable, ERC20Pausable {
    uint8 private _decimals;
    string private _isoCcyCode;

    /**
     ** @param decimals_ The number of decimals the token is quoted to
     ** @param isoCcyCode_ The ISO curreny code the token represents
     */
    constructor(
        uint8 decimals_,
        string memory isoCcyCode_
    ) Ownable() Pausable() {
        _decimals = decimals_;
        _isoCcyCode = isoCcyCode_;
    }

    /**
     ** @notice Mint the given number of tokens and assign to Token owner
     ** @param The number of tokens to mint.
     */
    function mint(uint256 amount) public onlyOwner whenNotPaused {
        super._mint(owner(), amount);
    }

    /**
     ** @notice Burn the given number of tokens
     ** @param amount The number of tokens to burn (must be less than total supply)
     */
    function burn(uint256 amount) public onlyOwner whenNotPaused {
        super._burn(owner(), amount);
    }

    /**
     ** @notice Pause all change activity on the contract
     */
    function pause() public onlyOwner {
        if (!paused()) {
            super._pause();
        }
    }

    /**
     ** @notice Un pause all change activity on the contract
     */
    function uppause() public onlyOwner {
        if (paused()) {
            super._unpause();
        }
    }

    /**
     ** @notice Get the number of decimals to which the token is quoted
     ** @return decimals places to which token is quoted
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     ** @notice The number of units for a single token
     ** @return units per token
     */
    function unitsPerToken() public view virtual returns (uint256) {
        return 10 ** decimals();
    }

    /**
     ** @notice Get the ISO ccy code of the token
     ** @return ISOCode of teh token
     */
    function isoCcyCode() public view virtual returns (string memory) {
        return _isoCcyCode;
    }
}
