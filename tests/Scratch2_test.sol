// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

// This import is automatically injected by Remix
import "remix_tests.sol";

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "remix_accounts.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../contracts/stable-coins/ERC20USDStableCoin.sol";
import "hardhat/console.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract ERC20USDStableCoinTestSuite is ERC20USDStableCoin {
    /// 'beforeAll' runs before all other tests
    function beforeAll() public {}

    /// 'beforeEach'
    function beforeEach() public {}

    function checkInitial() public {
        Assert.equal(
            this.totalSupply(),
            0,
            "Supply should be zero when token intially created"
        );
    }

    function checkMintAndBurn() public {
        // Check simple mint and burn and resulting total supply
        // Initial supply is zero.
        this.mint(1);
    }
}
