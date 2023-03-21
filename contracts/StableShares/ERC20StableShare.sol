// SPDX-License-Identifier: MIT

// Base contract for ERC20 Based Stable Share

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ERC20StableShare is Ownable, ERC20Pausable {
    uint8 private _decimals;
    string private _isinCode;
    string private _token_symbol;
    string private _token_name;

    constructor(
        uint8 decimals_,
        string memory isinCode_,
        string memory token_symbol_,
        string memory token_name_
    ) ERC20(token_name_, token_symbol_) Ownable() Pausable() {
        _decimals = decimals_;
        _isinCode = isinCode_;
        _token_symbol = token_symbol_;
        _token_name = token_name_;
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
     * The number of shares per Token
     */
    function unitsPerToken() public virtual returns (uint256) {
        return 10 ** _decimals;
    }

    /**
     * The ISO Curreny Code that the stable coin is backed by
     */
    function isinCode() public view virtual returns (string memory) {
        return _isinCode;
    }

    function share_symbol() public view returns (string memory) {
        return string(abi.encodePacked(_token_symbol, "-", _isinCode));
    }
}
