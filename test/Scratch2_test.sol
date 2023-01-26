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
contract ERC20USDStableCoinTestSuite  {

    ERC20USDStableCoin public usdStableCoin;

    /// 'beforeAll' runs before all other tests
    function beforeAll() public {
        usdStableCoin = new ERC20USDStableCoin(msg.sender);
        usdStableCoin.dummy();
    }

    /// 'beforeEach'
    function beforeEach() public {}

    function checkInitial() public {
        Assert.equal(
            usdStableCoin.totalSupply(),
            0,
            "Supply should be zero when token intially created"
        );
    }

    function checkMintAndBurn() public {
        // Check simple mint and burn and resulting total supply
        // Initial supply is zero.
        console.logString(Strings.toHexString(uint160(msg.sender), 20));
        console.logString(
            Strings.toHexString(uint160(usdStableCoin.ownerAddress()), 20)
        );

        uint8 numToMint = 1;
        usdStableCoin.mint(numToMint);
        Assert.equal(
            usdStableCoin.totalSupply(),
            numToMint * 10 ** usdStableCoin.decimals(),
            "Supply should be equal to the number minted"
        );

        //uint8 numToBurn = numToMint;
        //usdStableCoin.mint(numToBurn);
        //Assert.equal(
        //    usdStableCoin.totalSupply(),
         //   numToBurn * 10 ** usdStableCoin.decimals(),
        //    "Supply should be zero when token intially created"
        //);

    }
}
