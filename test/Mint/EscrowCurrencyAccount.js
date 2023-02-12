const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const crypto = require('crypto');

describe("Escrow Currency Account", function () {
    /* We define a fixture to reuse the same setup in every test.
    ** We use loadFixture to run this setup once, snapshot that state,
    ** and reset Hardhat Network to that snapshot in every test.
    */
    async function deployECA() {
        // remember contracts are deployed using the first signer/account by default (owner account)
        const VerifySignature = await ethers.getContractFactory("VerifySignature");
        const verifySig = await VerifySignature.deploy();
        return { verifySig }
    }

    async function deployAccountAndToken() {
        // Contracts are deployed using the first signer/account by default
        const [owner, escrow, player1, player2, player3] = await ethers.getSigners();

        const ERC20USDStableCoin = await ethers.getContractFactory("ERC20USDStableCoin");
        const erc20USDStableCoin = await ERC20USDStableCoin.connect(owner).deploy();

        return { erc20USDStableCoin, owner, escrow, player1, player2, player3 }
    }

    describe("Testing Signing and Account sender verification", async function () {
        it("Ether only example of signature verification", async function () {
            /*
            ** This test is ethers only without calling out to solidity. 
            ** So it's just an example of teh sign recover cycle.
            */

            // Get first two of the ten signer accounts that are set-up by ethers
            const [owner, other] = await ethers.getSigners();

            // The message we are going to sign and verify is a string and a number, but could be anything
            const num_ = 4672334421876;
            const msg_ = "Hello World!";
            const nonce_ = Math.floor(Date.now() + (10000 * Math.random())); // A randomized by monotonically incrementing value so hash cannot be re-used

            /* We have to pack the message in the same way that Solidity will when the parameters arrive in
            ** the remote solidity call. 
            */
            const secretMessage = ethers.utils.solidityPack(["uint256", "string", "uint256"], [num_, msg_, nonce_]);

            /* We now hash the message, and we will sign the hash of the message rather than the raw
            ** raw encoded (packed) message
            */
            const secretMessageHash = ethers.utils.keccak256(secretMessage);

            /*
            ** The message is now signed by the owner account that is set-up by ethers by default for testing
            ** this account is a signer, meaning it is associated with a public/private key par that lets it
            ** sign things.
            */
            const sig = await owner.signMessage(ethers.utils.arrayify(secretMessageHash)); // Don't forget to arrayify to send bytes

            /*
            ** We now use ethers to verify the message, this will return the account that signed the message. ONLY is the message and
            ** signature match. In most cases this function will return an address, but it will only return the signer address if
            ** every thing lines up.
            */
            const ethersRecoveredSigner = await ethers.utils.verifyMessage(ethers.utils.arrayify(secretMessageHash), ethers.utils.arrayify(sig)); // arrayify 

            /*
            ** The recovered signed should match the owner account address that signed the message.
            ** 'verifyMessage' in the real example (see following test case) would be done in solidity 
            ** so that the solidity contract could verify the sender.
            */
            expect(ethersRecoveredSigner).to.equal(owner.address);
        });

        it("Ether-Solidity example of signature verification", async function () {
            /*
            ** This test that a message created by ethers can have its signer account verified by solidity.
            */

            // Get first two of the ten signer accounts that are set-up by ethers
            const [owner, other] = await ethers.getSigners();

            // The message we are going to sign and verify is a string and a number, but could be anything
            const num_ = 4672334421876;
            const msg_ = "Hello World!";
            const nonce_ = Math.floor(Date.now() + (10000 * Math.random())); // A randomized by monotonically incrementing value so hash cannot be re-used

            /* We have to pack the message in the same way that Solidity will when the parameters arrive in
            ** the remote solidity call. 
            */
            const secretMessage = ethers.utils.solidityPack(["uint256", "string", "uint256"], [num_, msg_, nonce_]);

            /* We now hash the message, and we will sign the hash of the message rather than the raw
            ** raw encoded (packed) message
            */
            const secretMessageHash = ethers.utils.keccak256(secretMessage);

            /*
            ** The message is now signed by the owner account that is set-up by ethers by default for testing
            ** this account is a signer, meaning it is associated with a public/private key par that lets it
            ** sign things.
            */
            const sig = await owner.signMessage(ethers.utils.arrayify(secretMessageHash)); // Don't forget to arrayify to send bytes

            /*
            ** We now use ethers to verify the message, this will return the account that signed the message. ONLY is the message and
            ** signature match. In most cases this function will return an address, but it will only return the signer address if
            ** every thing lines up.
            */
            const { verifySig } = await loadFixture(deployECA); // get instance of solidity contract

            /*
            ** Note, unlike the Ethers example we don not pass the message hash, we pass the real parameters. So the verifySig
            ** contract will take the params and hash them and then try to recover the signer. So this is how we can send
            ** arbitrary parameters to a solidity contract and it will be able to verify the parameters are from a known
            ** account.
            */
            const solidityRecoveredSigner = await verifySig.verifiedData(num_, msg_, nonce_, ethers.utils.arrayify(sig));

            /*
            ** The recovered signed should match the owner account address that signed the message.
            ** 'verifyMessage' in the real example (see following test case) would be done in solidity 
            ** so that the solidity contract could verify the sender.
            */
            expect(solidityRecoveredSigner).to.equal(owner.address);
        });
    });

    async function escrowSetUp(erc20USDStableCoin, owner, escrow) {
        /* 
        ** Create escrow account that will manage the token.
        */
        const onePercentReserve = 1;
        const EscrowCurrenyAccount = await ethers.getContractFactory("EscrowCurrenyAccount");
        const escrowCurrenyAccount = await EscrowCurrenyAccount.connect(escrow).deploy(erc20USDStableCoin.address, onePercentReserve);

        const escrowContractAddress = await escrowCurrenyAccount.connect(escrow).contractAddress();
        await erc20USDStableCoin.transferOwnership(escrowContractAddress); // make escrow owner of token
        await escrowCurrenyAccount.connect(escrow).unPause(); // un pause the escrow contract.
        return { escrowCurrenyAccount };
    }

    describe("Testing Escrow Process", async function () {
        it("Create and Link Token to Escrow Account", async function () {
            /*
            ** Create a token and link it to an escrow account
            */
            var { erc20USDStableCoin, owner, escrow, player1 } = await loadFixture(deployAccountAndToken);

            /*
            ** Create the escrow current account to test
            */
            const onePercentReserve = 1;
            const EscrowCurrenyAccount = await ethers.getContractFactory("EscrowCurrenyAccount");
            const escrowCurrenyAccount = await EscrowCurrenyAccount.connect(escrow).deploy(erc20USDStableCoin.address, onePercentReserve);

            // Test paused at time of construction
            expect(await escrowCurrenyAccount.connect(escrow).paused()).to.equal(true);
            expect(await escrowCurrenyAccount.connect(escrow).isBalanced()).to.equal(true);
            expect(await escrowCurrenyAccount.connect(escrow).managedTokenAddress()).to.equal(erc20USDStableCoin.address);

            // Test paused enforcement
            await expect(escrowCurrenyAccount.connect(escrow).balanceOnHand()).to.be.revertedWith(
                "Pausable: paused"
            );

            /*
            ** Cannot un-pause if escrow not owner of the token
            */
            await expect(escrowCurrenyAccount.connect(escrow).unPause()).to.be.revertedWith(
                "EscrowCurrenyAccount not owner of managed token"
            );

            /* 
            ** Make escrow account owner of token.
            ** From this point, only the escrow account can manage the mint/burn and other owner functions.
            ** this means tokens are only minted/burnt in line with the supervisory controls imposed by the
            ** escrow process.
            */
            const escrowContractAddress = await escrowCurrenyAccount.connect(escrow).contractAddress();
            await erc20USDStableCoin.transferOwnership(escrowContractAddress);
            expect(await erc20USDStableCoin.owner()).to.equal(escrowContractAddress);

            // Un pause for owner tests
            await escrowCurrenyAccount.connect(escrow).unPause();
            expect(await escrowCurrenyAccount.connect(escrow).paused()).to.equal(false);

            // Test onlyOwner enforcement
            await expect(escrowCurrenyAccount.connect(player1).contractAddress()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
            await expect(escrowCurrenyAccount.connect(player1).processDepositTransaction(ethers.constants.AddressZero, 0, "")).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
            await expect(escrowCurrenyAccount.connect(player1).processWithdrawalTransaction(ethers.constants.AddressZero, 0, "")).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
            await expect(escrowCurrenyAccount.connect(player1).managedTokenAddress()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });

        it("Test Transactions", async function () {
            /*
            ** Create a token and link it to an escrow account
            */
            var { erc20USDStableCoin, owner, escrow, player1 } = await loadFixture(deployAccountAndToken);
            var { escrowCurrenyAccount } = await escrowSetUp(erc20USDStableCoin, owner, escrow);

            /* 
            ** Execute deposit transaction and ensure supply is minted.
            */
            const transId1 = crypto.randomUUID();
            const quantity = 632;

            // Test zero quantity
            await expect(escrowCurrenyAccount.connect(escrow).processDepositTransaction(player1.address, 0, transId1)).to.be.revertedWith(
                "Transaction quantity must be greater than zero"
            );

            // Test bad transaction address
            await expect(escrowCurrenyAccount.connect(escrow).processDepositTransaction(ethers.constants.AddressZero, quantity, transId1)).to.be.revertedWith(
                "Transaction counter-party address must be valid"
            );

            // Test valid transaction and confirm tokens are minted.
            const unitsPerToken = await erc20USDStableCoin.unitsPerToken();
            const depositQty = quantity * unitsPerToken;

            expect(await erc20USDStableCoin.balanceOf(player1.address)).to.equal(0); // player 1 should be zero before deposit

            await expect(escrowCurrenyAccount.connect(escrow).processDepositTransaction(player1.address, depositQty, transId1))
                .to.emit(escrowCurrenyAccount, 'Deposit')
                .withArgs(player1.address, depositQty, transId1, depositQty);

            expect(await erc20USDStableCoin.totalSupply()).to.equal(depositQty); // Total supply should be equal to amount of deposit (minted)
            expect(await await escrowCurrenyAccount.connect(escrow).balanceOnHand()).to.equal(depositQty); // physical balance shld be eql to deposit
            expect(await escrowCurrenyAccount.connect(escrow).isBalanced()).to.equal(true); // Escrow account physical and token balance should be in line            
            expect(await erc20USDStableCoin.balanceOf(player1.address)).to.equal(depositQty); // player 1 should now have tokens = deposit made
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(0); // Owner account should be zero
            expect(await erc20USDStableCoin.balanceOf(escrow.address)).to.equal(0); // Escrow account should be zero
            expect(await erc20USDStableCoin.balanceOf(await escrowCurrenyAccount.connect(escrow).contractAddress())).to.equal(0); // owner balance should be zero.

            // Make a corresponding withdrawal and see balances zero out.
            const withdrawQty = depositQty;

            // Seller did not permission transfer of tokens to escrow account.
            await expect(escrowCurrenyAccount.connect(escrow).processWithdrawalTransaction(player1.address, depositQty, transId1))
                .to.be.revertedWith(
                    "ERC20: insufficient allowance"
                );


            // TODO: Fix this test, currently failing with 'insufficient allowance'
            const escrowContractAddr = await escrowCurrenyAccount.connect(escrow).contractAddress();
            await erc20USDStableCoin.connect(player1).approve(escrowContractAddr, withdrawQty); // Permission transfer between player and escrow
            expect(await erc20USDStableCoin.allowance(player1.address, escrowContractAddr)).to.equal(withdrawQty); // escrow contract should have allowance to txfr

            //await escrowCurrenyAccount.txfr(player1.address, escrow.address, withdrawQty);
            await expect(escrowCurrenyAccount.connect(escrow).processWithdrawalTransaction(player1.address, withdrawQty, transId1))
                .to.emit(escrowCurrenyAccount, 'Withdrawal')
                .withArgs(player1.address, withdrawQty, transId1, 0);

            expect(await erc20USDStableCoin.totalSupply()).to.equal(0); // Total supply should be equal to zero as now burned
            expect(await await escrowCurrenyAccount.connect(escrow).balanceOnHand()).to.equal(0); // physical balance shld be eql to zero
            expect(await erc20USDStableCoin.balanceOf(player1.address)).to.equal(0); // player 1 should now have zero tokens as swapped for physical
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(0); // Owner account should be zero
            expect(await erc20USDStableCoin.balanceOf(escrow.address)).to.equal(0); // Escrow account should be zero
            expect(await erc20USDStableCoin.balanceOf(await escrowCurrenyAccount.connect(escrow).contractAddress())).to.equal(0); // owner balance should be zero.            
        });
    });
});

