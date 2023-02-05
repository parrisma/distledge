const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const crypto = require('crypto');

describe("Escrow Currency Account", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployECA() {
        // Contracts are deployed using the first signer/account by default
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
        it("web3.eth demo/test of sign/recover", async function () {
            /*
            ** This is fully web-3 based demo of the sign, recover cycle - so not really a test as such
            */
            var account = await web3.eth.accounts.create(); // create account with private key etc.
            var wallet = await web3.eth.accounts.wallet.create(1, 'random string');
            account = await web3.eth.accounts.privateKeyToAccount(account.privateKey);
            // await web3.eth.accounts.wallet.add(account); // register the pvt key in Wallet.
            await wallet.add(account); // register the pvt key in Wallet.

            const secretMessage = "Hello World!"; // define the message to sign
            const secretMessageHash = web3.utils.keccak256(secretMessage);
            const sig = await web3.eth.sign(secretMessageHash, account.address); // Sign
            const recoveredSigner = await web3.eth.accounts.recover(secretMessageHash, sig); // get the account that signed
            expect(recoveredSigner).to.equal(account.address); // recovered account should be account that signed.
        });

        it("String - web3.eth signed with solidity verified signer", async function () {
            /*
            ** This signs a message with we3.eth and recovers signer with a solidty contract using ecrecover()
            */
            const account = await web3.eth.accounts.create(); // create account with private key etc.
            await web3.eth.accounts.wallet.add(account.privateKey); // register the pvt key in Wallet.
            const secretMessage = "Hello World!"; // define the message to sign
            const secretMessageHash = web3.utils.keccak256(secretMessage);

            /* recover with web3.eth to verify working
            */
            const sig = await web3.eth.sign(secretMessageHash, account.address); // Sign
            const recoveredSigner = await web3.eth.accounts.recover(secretMessageHash, sig); // get the account that signed
            expect(recoveredSigner).to.equal(account.address); // recovered account should be account that signed.

            /* Now recover with Solidity contract using ecrecover()
            */
            const { verifySig } = await loadFixture(deployECA); // get instance of contract
            const solidityRecoveredSigner = await verifySig.recoverSigner(ethers.utils.arrayify(secretMessageHash), ethers.utils.arrayify(sig));
            expect(solidityRecoveredSigner).to.equal(account.address); // recovered account should be account that signed.
        });

        it("Object - web3.eth signed with solidity verified signer", async function () {
            /*
            ** This encodes the data fields and signs the hash, such that solidity can verify the source of
            ** the data by re-hashing data locally and getting signer from the local hash and signature.
            */
            const account = await web3.eth.accounts.create(); // create account with private key etc.
            await web3.eth.accounts.wallet.add(account.privateKey); // register the pvt key in Wallet.
            // We have to create hash the way solidity will when it calls keccak256(abi.encodePacked())
            const num_ = 3142;
            const msg_ = "Hello World!";
            const secretMessage = web3.utils.encodePacked({ value: num_, type: "uint256" }, { value: msg_, type: "string" });
            const secretMessageHash = web3.utils.keccak256(secretMessage);
            const { verifySig } = await loadFixture(deployECA); // get instance of contract
            const sig = await web3.eth.sign(secretMessageHash, account.address); // Sign
            const solidityRecoveredSigner = await verifySig.verifiedData(num_, msg_, ethers.utils.arrayify(sig));

            expect(solidityRecoveredSigner).to.equal(account.address); // recovered account should be account that signed.
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

