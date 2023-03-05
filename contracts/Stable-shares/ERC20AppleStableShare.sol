// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ERC20StableShare.sol";

contract ERC20AppleStableShare is ERC20StableShare {
    string private constant _token_symbol = "AppleSS";
    string private constant _token_name = "AppleStableShare";
    string private constant _isinCode = "US0378331005";
    uint8 private constant _2decimal_places = 2;

    constructor()
        ERC20StableShare(
            _2decimal_places,
            _isinCode,
            _token_symbol,
            _token_name
        )
    {}

    function unitsPerToken() public override returns (uint256) {
        return 10 ** _2decimal_places;
    }
}
