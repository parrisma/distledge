// SPDX-License-Identifier: MIT

// Base contract for ERC20 Based Stable Asset

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ERC20StableAsset is Ownable, ERC20Pausable {
    uint8 private _decimals;
    string private _asset_code;
    string private _token_symbol;
    string private _token_name;

    constructor(
        uint8 decimals_,
        string memory asset_code_,
        string memory token_symbol_,
        string memory token_name_
    ) ERC20(token_name_, token_symbol_) Ownable() Pausable() {
        _decimals = decimals_;
        _asset_code = asset_code_;
        _token_symbol = token_symbol_;
        _token_name = token_name_;
    }

    // All minting is to the owner account, the minted funds are then transfered out
    function mint(uint256 amount) public onlyOwner whenNotPaused {
        super._mint(this.owner(), amount);
    }

    // All burning is from the owner account, based on return (transfer in) of funds
    function burn(uint256 amount) public onlyOwner whenNotPaused {
        super._burn(this.owner(), amount);
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
     * The Asset Code that identity the stable asset
     */
    function assetCode() public view virtual returns (string memory) {
        return _asset_code;
    }

    /**
     * The units per Token
     */
    function unitsPerToken() public view virtual returns (uint256) {
        return 10 ** decimals();
    }
}
