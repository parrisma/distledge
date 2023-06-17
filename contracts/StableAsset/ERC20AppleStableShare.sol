// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ERC20StableAsset.sol";

/**
 ** @title Stable Share for Apple
 **
 ** TODO: Also, we can move share_symbol() into base class and rename it token_symbol.
 */
contract ERC20AppleStableShare is ERC20StableAsset {
    string private constant _token_symbol = "APLSS";
    string private constant _token_name = "AppleStableShare";
    string private constant _asset_code = "US0378331005"; // isin code
    uint8 private constant _decimal_places = 0;

    constructor()
        ERC20StableAsset(
            _decimal_places,
            _asset_code,
            _token_symbol,
            _token_name
        )
    {}

    /**
     * @notice Combine symbol and ISIN code of stable share
     */

    function share_symbol() public pure returns (string memory) {
        return string(abi.encodePacked(_token_symbol, "-", _asset_code));
    }
}
