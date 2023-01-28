// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Exchange is Ownable {

    constructor(uint8 decimals_) Ownable() {
    }
}