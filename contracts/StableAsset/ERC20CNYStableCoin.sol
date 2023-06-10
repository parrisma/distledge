// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ERC20StableAsset.sol";

/**
 ** @title Stable Coin Token for Chinese Yuan
 */
contract ERC20CNYStableCoin is ERC20StableAsset {
    string private constant _token_symbol = "CNYS";
    string private constant _token_name = "CNYStableCoin";
    string private constant _asset_code = "CNY"; // iso ccy code
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
