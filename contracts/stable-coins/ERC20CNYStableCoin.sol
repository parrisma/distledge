// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ERC20StableCoin.sol";

contract ERC20CNYStableCoin is ERC20StableCoin {
    string private constant _token_symbol = "CNY";
    string private constant _token_name = "CNYStableCoin";
    uint8 private constant _2decimal_places = 2; // cents

    constructor()
        ERC20StableCoin(_2decimal_places)
        ERC20(_token_name, _token_symbol)
    {}
}
