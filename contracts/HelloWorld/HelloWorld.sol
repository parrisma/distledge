// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 ** This is not part of the project, it's a simple contract for demo of dapp
 ** connectivity features.
 */
contract HelloWorld {
    string _aCtorStr;
    address _aCtorAddr;
    uint256 _aCtorUint;

    constructor(
        string memory aCtorStr_,
        address aCtorAddr_,
        uint256 aCtorUint_
    ) {
        _aCtorStr = aCtorStr_;
        _aCtorAddr = aCtorAddr_;
        _aCtorUint = aCtorUint_;
    }

    /** @dev Return a string message taking no paramters.
     **      We pass params of different types so we can test calling contract from Web3 & Other sources
     ** @return A string based on input parameters.
     */
    function message(
        string memory aStr,
        address anAddr,
        uint256 aUint
    ) public pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "Hello World Message - str: [",
                    aStr,
                    "] -addr: [",
                    Strings.toHexString(uint160(anAddr), 20),
                    "] -uint: [",
                    Strings.toString(aUint),
                    "]"
                )
            );
    }

    /** @dev Shows the values passed to the constructor
     ** @return A string based on constructor parameters.
     */
    function ctor_params() public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "Hello World Constructor - str: [",
                    _aCtorStr,
                    "] -addr: [",
                    Strings.toHexString(uint160(_aCtorAddr), 20),
                    "] -uint: [",
                    Strings.toString(_aCtorUint),
                    "]"
                )
            );
    }
}
