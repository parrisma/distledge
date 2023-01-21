// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

// This import is automatically injected by Remix
import "remix_tests.sol";

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "remix_accounts.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../contracts/stable-coins/Sender.sol";
import "hardhat/console.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract testSuite2 is Sender {
    function beforeAll() public {
        console.logString(Strings.toHexString(uint160(msg.sender), 20));
    }

    function beforeEach() public {
        console.logString(Strings.toHexString(uint160(msg.sender), 20));
    }

    function checkTransferOfTokens() public {
        console.logString(Strings.toHexString(uint160(msg.sender), 20));
        console.logString(Strings.toHexString(uint160(getOwner()), 20));
        Assert.ok(true, "");
    }
}
