const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const crypto = require('crypto');

describe("Escrow Account", function () {
    /* We define a fixture to reuse the same setup in every test.
    ** We use loadFixture to run this setup once, snapshot that state,
    ** and reset Hardhat Network to that snapshot in every test.
    */
    async function deployAccountAndToken() {
        // Contracts are deployed using the first signer/account by default
        const [owner, escrow, player1, player2, player3] = await ethers.getSigners();

        const ERC20USDStableCoin = await ethers.getContractFactory("ERC20USDStableCoin");
        const erc20USDStableCoin = await ERC20USDStableCoin.connect(owner).deploy();

        return { erc20USDStableCoin, owner, escrow, player1, player2, player3 }
    }

    async function escrowSetUp(erc20USDStableCoin, owner, escrow) {
        /* 
        ** Create escrow account that will manage the token.
        */
        const onePercentReserve = 1;
        const EscrowAccount = await ethers.getContractFactory("EscrowAccount");
        const escrowAccount = await EscrowAccount.connect(escrow).deploy(erc20USDStableCoin.address, onePercentReserve);

        const escrowContractAddress = await escrowAccount.connect(escrow).contractAddress();
        await erc20USDStableCoin.transferOwnership(escrowContractAddress); // make escrow owner of token
        await escrowAccount.connect(escrow).unPause(); // un pause the escrow contract.
        return { escrowAccount };
    }

    describe("Testing Escrow Process", async function () {
        it("Create and Link Token to Escrow Account", async function () {
            /*
            ** Create a token and link it to an escrow account
            */
            var { erc20USDStableCoin, owner, escrow, player1 } = await loadFixture(deployAccountAndToken);

            /*
            ** Create the escrow account to test
            */
            const onePercentReserve = 1;
            const EscrowAccount = await ethers.getContractFactory("EscrowAccount");
            const escrowAccount = await EscrowAccount.connect(escrow).deploy(erc20USDStableCoin.address, onePercentReserve);

            // Test paused at time of construction
            expect(await escrowAccount.connect(escrow).paused()).to.equal(true);
            expect(await escrowAccount.connect(escrow).isBalanced()).to.equal(true);
            expect(await escrowAccount.connect(escrow).managedTokenAddress()).to.equal(erc20USDStableCoin.address);

            // Test paused enforcement
            await expect(escrowAccount.connect(escrow).balanceOnHand()).to.be.revertedWith(
                "Pausable: paused"
            );

            /*
            ** Cannot un-pause if escrow not owner of the token
            */
            await expect(escrowAccount.connect(escrow).unPause()).to.be.revertedWith(
                "EscrowAccount not owner of managed token"
            );

            /* 
            ** Make escrow account owner of token.
            ** From this point, only the escrow account can manage the mint/burn and other owner functions.
            ** this means tokens are only minted/burnt in line with the supervisory controls imposed by the
            ** escrow process.
            */
            const escrowContractAddress = await escrowAccount.connect(escrow).contractAddress();
            await erc20USDStableCoin.transferOwnership(escrowContractAddress);
            expect(await erc20USDStableCoin.owner()).to.equal(escrowContractAddress);

            // Un pause for owner tests
            await escrowAccount.connect(escrow).unPause();
            expect(await escrowAccount.connect(escrow).paused()).to.equal(false);

            // Test onlyOwner enforcement
            await expect(escrowAccount.connect(player1).contractAddress()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
            await expect(escrowAccount.connect(player1).processDepositTransaction(ethers.constants.AddressZero, 0, "")).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
            await expect(escrowAccount.connect(player1).processWithdrawalTransaction(ethers.constants.AddressZero, 0, "")).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
            await expect(escrowAccount.connect(player1).managedTokenAddress()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });

        it("Test Transactions", async function () {
            /*
            ** Create a token and link it to an escrow account
            */
            var { erc20USDStableCoin, owner, escrow, player1 } = await loadFixture(deployAccountAndToken);
            var { escrowAccount } = await escrowSetUp(erc20USDStableCoin, owner, escrow);

            /* 
            ** Execute deposit transaction and ensure supply is minted.
            */
            const transId1 = crypto.randomUUID();
            const quantity = 632;

            // Test zero quantity
            await expect(escrowAccount.connect(escrow).processDepositTransaction(player1.address, 0, transId1)).to.be.revertedWith(
                "Transaction quantity must be greater than zero"
            );

            // Test bad transaction address
            await expect(escrowAccount.connect(escrow).processDepositTransaction(ethers.constants.AddressZero, quantity, transId1)).to.be.revertedWith(
                "Transaction counter-party address must be valid"
            );

            // Test valid transaction and confirm tokens are minted.
            const unitsPerToken = await erc20USDStableCoin.unitsPerToken();
            const depositQty = quantity * unitsPerToken;

            expect(await erc20USDStableCoin.balanceOf(player1.address)).to.equal(0); // player 1 should be zero before deposit

            await expect(escrowAccount.connect(escrow).processDepositTransaction(player1.address, depositQty, transId1))
                .to.emit(escrowAccount, 'Deposit')
                .withArgs("USD", player1.address, depositQty, transId1, depositQty);

            expect(await erc20USDStableCoin.totalSupply()).to.equal(depositQty); // Total supply should be equal to amount of deposit (minted)
            expect(await await escrowAccount.connect(escrow).balanceOnHand()).to.equal(depositQty); // physical balance shld be eql to deposit
            expect(await escrowAccount.connect(escrow).isBalanced()).to.equal(true); // Escrow account physical and token balance should be in line            
            expect(await erc20USDStableCoin.balanceOf(player1.address)).to.equal(depositQty); // player 1 should now have tokens = deposit made
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(0); // Owner account should be zero
            expect(await erc20USDStableCoin.balanceOf(escrow.address)).to.equal(0); // Escrow account should be zero
            expect(await erc20USDStableCoin.balanceOf(await escrowAccount.connect(escrow).contractAddress())).to.equal(0); // owner balance should be zero.

            // Make a corresponding withdrawal and see balances zero out.
            const withdrawQty = depositQty;

            // Seller did not permission transfer of tokens to escrow account.
            await expect(escrowAccount.connect(escrow).processWithdrawalTransaction(player1.address, depositQty, transId1))
                .to.be.revertedWith(
                    "ERC20: insufficient allowance"
                );


            const escrowContractAddr = await escrowAccount.connect(escrow).contractAddress();
            await erc20USDStableCoin.connect(player1).approve(escrowContractAddr, withdrawQty); // Permission transfer between player and escrow
            expect(await erc20USDStableCoin.allowance(player1.address, escrowContractAddr)).to.equal(withdrawQty); // escrow contract should have allowance to txfr

            //await escrowCurrenyAccount.txfr(player1.address, escrow.address, withdrawQty);
            await expect(escrowAccount.connect(escrow).processWithdrawalTransaction(player1.address, withdrawQty, transId1))
                .to.emit(escrowAccount, 'Withdrawal')
                .withArgs("USD", player1.address, withdrawQty, transId1, 0);

            expect(await erc20USDStableCoin.totalSupply()).to.equal(0); // Total supply should be equal to zero as now burned
            expect(await await escrowAccount.connect(escrow).balanceOnHand()).to.equal(0); // physical balance shld be eql to zero
            expect(await erc20USDStableCoin.balanceOf(player1.address)).to.equal(0); // player 1 should now have zero tokens as swapped for physical
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(0); // Owner account should be zero
            expect(await erc20USDStableCoin.balanceOf(escrow.address)).to.equal(0); // Escrow account should be zero
            expect(await erc20USDStableCoin.balanceOf(await escrowAccount.connect(escrow).contractAddress())).to.equal(0); // owner balance should be zero.            
        });
    });
});

