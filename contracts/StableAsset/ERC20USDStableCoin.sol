// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ERC20StableAsset.sol";

/**
 ** @title Stable Coin Token for USD
 */
contract ERC20USDStableCoin is ERC20StableAsset {
    string private constant _token_symbol = "USDS";
    string private constant _token_name = "USDStableCoin";
    string private constant _asset_code = "USD"; // iso ccy code
    uint8 private constant _2decimal_places = 2; // cents

    constructor()
        ERC20StableAsset(
            _2decimal_places,
            _asset_code,
            _token_symbol,
            _token_name
        )
    {}
}
