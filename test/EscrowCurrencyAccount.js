const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

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

    describe("Verify Web3", async function () {
        it("web3.eth demo/test of sign/recover", async function () {
            /*
            ** This is fully web-3 based demo of the sign, recover cycle - so not really a test as such
            */
            const account = await web3.eth.accounts.create(); // create account with private key etc.
            await web3.eth.accounts.wallet.add(account.privateKey); // register the pvt key in Wallet.
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
            ** This is fully web-3 based demo of the sign, recover cycle - so not really a test as such
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
});

