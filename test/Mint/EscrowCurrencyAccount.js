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

        const escrowSigner = await web3.eth.accounts.create(); // create account with private key etc.
        await web3.eth.accounts.wallet.add(escrowSigner.privateKey); // register the pvt key in Wallet.

        const ERC20USDStableCoin = await ethers.getContractFactory("ERC20USDStableCoin");
        const erc20USDStableCoin = await ERC20USDStableCoin.deploy();

        return { erc20USDStableCoin, owner, escrow, escrowSigner, player1, player2, player3 }
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
        ** Token must be fully managed by escrow account
        */
        await erc20USDStableCoin.transferOwnership(escrow.address);

        /* 
        ** Create escrow account that will manage the token.
        */
        const onePercentReserve = 1;
        const EscrowCurrenyAccount = await ethers.getContractFactory("EscrowCurrenyAccount");
        const escrowCurrenyAccount = await EscrowCurrenyAccount.connect(escrow).deploy(erc20USDStableCoin.address, onePercentReserve);

        return { escrowCurrenyAccount };
    }

    describe("Testing Escrow Process", async function () {
        it("Create and Link Token to Account", async function () {
            /*
            ** Create a token and link it to an escrow account
            */
            var { erc20USDStableCoin, owner, escrow, escrowSigner, player1 } = await loadFixture(deployAccountAndToken);
            var { escrowCurrenyAccount } = await escrowSetUp(erc20USDStableCoin, owner, escrow);

            /* 
            ** Token must be fully managed by escrow account
            */
            expect(await erc20USDStableCoin.owner()).to.equal(escrow.address);

            /* 
            ** Create escrow account that will manage the token.
            */
            expect(await escrowCurrenyAccount.owner()).to.equal(escrow.address);
            expect(await escrowCurrenyAccount.isBalanced()).to.equal(true);
        });

        it("Test Transactions", async function () {
            /*
            ** Create a token and link it to an escrow account
            */
            var { erc20USDStableCoin, owner, escrow, escrowSigner, player1 } = await loadFixture(deployAccountAndToken);
            var { escrowCurrenyAccount } = await escrowSetUp(erc20USDStableCoin, owner, escrow);

            /* 
            ** Execute deposit transaction and ensure supply is minted.
            */
            const transId1 = crypto.randomUUID();
            const quantity = 632;
            const done = await escrowCurrenyAccount.connect(escrow).processDepositTransaction(player1.address, quantity, transId1);
        });
    });
});

