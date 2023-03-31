// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ERC20StableAsset.sol";

/**
 ** @title Stable Coin Token for Euro
 */
contract ERC20EURStableCoin is ERC20StableAsset {
    string private constant _token_symbol = "EURS";
    string private constant _token_name = "EURStableCoin";
    string private constant _asset_code = "EUR"; // iso ccy code
    uint8 private constant _2decimal_places = 2; // cents

    constructor()
        ERC20StableAsset(
            _2decimal_places,
            _asset_code,
            _token_name,
            _token_symbol
        )
    {}
}
