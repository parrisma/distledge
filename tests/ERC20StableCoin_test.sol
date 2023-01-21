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
contract testSuite is ERC20USDStableCoin {
    address acc_owner;
    address msg_sender;
    address acc_1;

    /// 'beforeAll' runs before all other tests
    /// More special functions are: 'beforeEach', 'beforeAll', 'afterEach' & 'afterAll'
    function beforeAll() public {
        acc_owner = TestsAccounts.getAccount(0);
        msg_sender = acc_owner;
        acc_1 = TestsAccounts.getAccount(1);
    }

    /// 'beforeEach'
    function beforeEach() public {
    }

    function checkInitial() public {
        // Initial supply is zero.
        Assert.equal(
            this.totalSupply(),
            0,
            "Supply should be zero when token intially created"
        );
    }

    function checkMintAndBurn() public {
        // Check simple mint and burn and resulting total supply
        this.mint(1);
        Assert.equal(
            this.totalSupply(),
            1 * this.unitsPerToken(),
            "Supply should be one"
        );
        this.burn(1);
        Assert.equal(this.totalSupply(), 0, "Supply should be zero");
    }

    function checkOverBurn() public {
        // Check that we cannot burn more that total supply
        this.mint(10);
        try this.burn(this.totalSupply() + 1) {
            Assert.ok(
                false,
                "Failure as attempt to burn more than supply was not reverted"
            );
        } catch {
            Assert.ok(
                true,
                "Attempt to burn more than total supply was reverted"
            );
        }
    }

    function checkMethodsSubjectToBeingPaused() public {
        // Check that functions that cannot be called while contract paused fail when invoked on paused contract
        this.pause();
        try this.mint(1) {
            Assert.ok(
                false,
                "A pausable method was invoked without error even while contract was paused"
            );
        } catch {
            Assert.ok(
                true,
                "Pausable method was blocked as required while contract was paused"
            );
        }

        try this.burn(1) {
            Assert.ok(
                false,
                "A pausable method was invoked without error even while contract was paused"
            );
        } catch {
            Assert.ok(
                true,
                "Pausable method was blocked as required while contract was paused"
            );
        }
    }

    function checkTransferOfTokens() public {
        console.logString(Strings.toHexString(uint160(msg.sender), 20));

        Assert.ok(
            msg.sender == msg_sender,
            "msg.sender should be same as msg_sender"
        );
        this.mint(1);
        console.logString(
            string.concat(
                "Supply: ",
                Strings.toString(this.totalSupply())
            )
        );
        console.logString(
            string.concat(
                "Supply: ",
                Strings.toString(this.ownerBal())
            )
        );
        console.logString(
            string.concat(
                "Supply: ",
                Strings.toString(this.balanceOf(msg.sender))
            )
        );
        console.logString(Strings.toHexString(uint160(msg.sender), 20));
        console.logString(
            Strings.toHexString(uint160(this.ownerAddress()), 20)
        );
    }
}
