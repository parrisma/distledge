// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";

/**
 ** This is not part of the project, it's a simple contract for demo of dapp
 ** connectivity features.
 */
contract HelloWorld {
    /** @dev Return a string message taking no paramters.
     ** @return Hello World fixed string message.
     */
    function message() public pure returns (string memory) {
        return "Hello World";
    }
}
