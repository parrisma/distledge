// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ERC20StableAsset.sol";

/**
 ** @title Stable Share for AppTeslale
 */
contract ERC20TeslaStableShare is ERC20StableAsset {
    string private constant _token_symbol = "TeslaSS";
    string private constant _token_name = "TeslaStableShare";
    string private constant _asset_code = "US88160R1014"; // isin code
    uint8 private constant _2decimal_places = 2;

    constructor()
        ERC20StableAsset(
            _2decimal_places,
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
