// SPDX-License-Identifier: MIT

// Base contract for ERC20 Based Stable Coins

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ERC20StableCoin is Ownable, ERC20Pausable {
    uint8 private _decimals;
    string private _isoCcyCode;

    constructor(uint8 decimals_, string memory isoCcyCode_)
        Ownable()
        Pausable()
    {
        _decimals = decimals_;
        _isoCcyCode = isoCcyCode_;
    }

    // All minting is to the owner account, the minted funds are then transfered out
    function mint(uint256 amount) public onlyOwner whenNotPaused {
        super._mint(this.owner(), amount * unitsPerToken());
    }

    // All burning is from the owner account, based on return (transfer in) of funds
    function burn(uint256 amount) public onlyOwner whenNotPaused {
        super._burn(this.owner(), amount * unitsPerToken());
    }

    // Pause all change activity on the contract
    function pause() public onlyOwner {
        if (!paused()) {
            super._pause();
        }
    }

    // Un pause all change activity on the contract
    function uppause() public onlyOwner {
        if (paused()) {
            super._unpause();
        }
    }

    /**
     * Two decimal places as this is a current representation
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * The number of units per one of the Token
     */
    function unitsPerToken() public view virtual returns (uint256) {
        return 10**decimals();
    }

    /**
     * The ISO Curreny Code that the stable coin is backed by
     */
    function isoCcyCode() public view virtual returns (string memory) {
        return _isoCcyCode;
    }
}
