// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "../stable-coins/ERC20StableCoin.sol";

contract TokenizedOptions {
    address payable contractAddr;
    struct CallOption {
        uint id; // Unique ID of option, also array index
        string underlying; // Underlying of this option
        uint strike; // Price in USD (18 decimal places) option allows buyer to purchase tokens at
        uint premium; // Fee in contract token that option writer charges
        uint expiry; // Unix timestamp of expiration time
        uint quantity; // Amount of tokens the option contract is for
        bool exercised; // Has option been exercised
        bool canceled; // Has option been canceled
        address payable seller; // Seller of option
        address payable buyer; // Buyer of option
    }
    // Options stored in arrays of structs
    CallOption[] public callOptions;

    constructor() {
        contractAddr = payable(address(this));
    }

    function getLatestPrice(
        string memory _underlying
    ) public pure returns (uint) {
        // TODO call data from price feeds
        return 1000;
    }

    function getStableCoinAddress(
        string memory _underlying
    ) public pure returns (adress) {
        // TODO call address of stable coin
        return address(0);
    }

    // function ERC20StableCoin

    function issueCallOption(
        string memory _underlying,
        uint _strike,
        uint _premium,
        uint _expiry,
        uint _quantity
    ) public payable {
        // , bool _exercised, bool _canceled,
        ERC20StableCoin paymentToken = ERC20StableCoin(_underlying);
        require(
            paymentToken.allowance(msg.sender, address(this)) >= _quantity,
            "Insuficient Allowance"
        );
        require(
            paymentToken.transferFrom(msg.sender, address(this), _quantity),
            "transfer Failed"
        );
        uint latestPrice = getLatestPrice(_underlying);
        callOptions.push(
            CallOption(
                callOptions.length,
                _underlying,
                _strike,
                _premium,
                _expiry,
                _quantity,
                false,
                false,
                msg.sender,
                address(0)
            )
        );
    }
}
