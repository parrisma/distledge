// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ERC20StableAsset.sol";

/**
 ** @title Stable Share for Apple
 */
contract ERC20AppleStableShare is ERC20StableAsset {
    string private constant _token_symbol = "AppleSS";
    string private constant _token_name = "AppleStableShare";
    string private constant _asset_code = "US0378331005"; // isin code
    uint8 private constant _2decimal_places = 2;

    constructor()
        ERC20StableAsset(
            _2decimal_places,
            _asset_code,
            _token_symbol,
            _token_name
        )
    {}

    // All minting is to the owner account, the minted funds are then transfered out
    function mint(uint256 amount) public override onlyOwner whenNotPaused {
        super._mint(this.owner(), amount * unitsPerToken());
    }

    // All burning is from the owner account, based on return (transfer in) of funds
    function burn(uint256 amount) public override onlyOwner whenNotPaused {
        super._burn(this.owner(), amount * unitsPerToken());
    }

    /**
     * Combine symbol and ISIN code of stable share
     */

    function share_symbol() public pure returns (string memory) {
        return string(abi.encodePacked(_token_symbol, "-", _asset_code));
    }
}
