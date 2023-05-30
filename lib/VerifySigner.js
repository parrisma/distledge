/*
** To run this only [> npx hardhat test --grep "Full Simulation"]
*/

const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const crypto = require('crypto');
const { TASK_NODE } = require("hardhat/builtin-tasks/task-names");
const { ethers } = require("hardhat");

/**
 * This suite tests the VerifiedSigner library. This library is used to verify that
 * certain parameters came from a given signer.
 * 
 */
describe("Verified Signer Suite", function () {

    async function deployVerifiedSigner() {
        // Test Accounts to use.
        const [owner, buyer, seller] = await ethers.getSigners();

        // Deploy Library
        const VerifySignerLib = await ethers.getContractFactory("VerifySigner");
        const verifySignerLib = await VerifySignerLib.deploy();
        await verifySignerLib.deployed();

        // Deploy mock contract
        const MockVerifiedSigner = await ethers.getContractFactory("mockVerifiedSigner", {
            libraries: {
                VerifySigner: verifySignerLib.address,
            },
        });
        const mockVerifiedSigner = await MockVerifiedSigner.deploy();


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

        return { owner, buyer, seller, mockVerifiedSigner, num_, msg_, nonce_, secretMessageHash };
    }

    describe("Signer mock Contract tests to validate VerifiedSigner Lib", async function () {

        it("Ether only example of signature verification", async function () {
            /*
            ** This test is ethers only without calling out to solidity. 
            ** So it's just an example of teh sign recover cycle.
            */

            // Get first two of the ten signer accounts that are set-up by ethers
            const [owner] = await ethers.getSigners();

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

        it("Accept when signer not is as expected", async function () {
            // get test accounts and a mockVerifiedSigner that uses VerifiedSignerLib
            const { owner, buyer, seller, mockVerifiedSigner, num_, msg_, nonce_, secretMessageHash } = await loadFixture(deployVerifiedSigner);

            /*
            ** The message is now signed by the seller account, so it lines up with the verified signer
            ** set.
            */
            const sig = await seller.signMessage(ethers.utils.arrayify(secretMessageHash)); // Don't forget to arrayify to send bytes

            /*
            ** We now use send the message and the locally calculated hash to 'mockVerifiedSigner' and
            ** it will verify that the signer of the data was the same account set.
            */
            mockVerifiedSigner.connect(owner).setExpectedSigner(seller.address);

            /*
            ** Note, unlike the Ethers example we don not pass the message hash, we pass the real parameters. So the mockVerifiedSigner
            ** contract will take the params and hash them and then try to recover the signer. So this is how we can send
            ** arbitrary parameters to a solidity contract and it will be able to verify the parameters are from a known
            ** account.
            */
            const actual = await mockVerifiedSigner.verifiedData(num_, msg_, nonce_, ethers.utils.arrayify(sig));
            expect(actual).to.equal(true) // method with throw if error else return true
        });

        it("Reject when signer not as expected", async function () {
            // get test accounts and a mockVerifiedSigner that uses VerifiedSignerLib
            const { owner, buyer, seller, mockVerifiedSigner, num_, msg_, nonce_, secretMessageHash } = await loadFixture(deployVerifiedSigner);

            /*
            ** The message is now signed by the *buyer* account, so will mismatch the seller account
            ** set as the only verified signer.
            */
            const sig = await buyer.signMessage(ethers.utils.arrayify(secretMessageHash)); // Don't forget to arrayify to send bytes

            /*
            ** We now use send the message and the locally calculated hash to 'mockVerifiedSigner' and
            ** it will verify that the signer of the data was the same account set.
            */
            mockVerifiedSigner.connect(owner).setExpectedSigner(seller.address);

            /*
            ** Note, unlike the Ethers example we don not pass the message hash, we pass the real parameters. So the mockVerifiedSigner
            ** contract will take the params and hash them and then try to recover the signer. So this is how we can send
            ** arbitrary parameters to a solidity contract and it will be able to verify the parameters are from a known
            ** account.
            ** This is expected to throw as signed by buyer, but seller required as signer
            */           
            await expect(mockVerifiedSigner.verifiedData(num_, msg_, nonce_, ethers.utils.arrayify(sig))).to.be.revertedWith(
                "mockVerifiedSigned: Required sender did not sign data"
            );

        });
    });
});