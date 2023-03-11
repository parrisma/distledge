const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const crypto = require('crypto');

const symbol = "SECS";
const description = "Secure Source Description";

describe("Secure Level Test Suite", function () {
    async function deployAccountAndToken() {
        // Get named accounts & deploy SecureLevel contract
        const [owner, secure_source, other_source] = await ethers.getSigners();

        // Deploy Library
        const VerifySignerLib = await ethers.getContractFactory("VerifySigner");
        const verifySignerLib = await VerifySignerLib.deploy();
        await verifySignerLib.deployed();

        const SecureLevel = await ethers.getContractFactory("SecureLevel", {
            libraries: {
                VerifySigner: verifySignerLib.address,
            },
        });
        const secureLevel = await SecureLevel.connect(owner).deploy(symbol, description);

        return { secureLevel, owner, secure_source, other_source }
    }

    async function signedMessage(owner) {
        // Create a signed message
        const value = 4672334421876;
        const nonce = Math.floor(Date.now());
        const secretMessage = ethers.utils.solidityPack(["uint256", "uint256"], [value, nonce]);
        const secretMessageHash = ethers.utils.keccak256(secretMessage);
        return { value, nonce, secretMessage, secretMessageHash }
    }

    describe("Secure Level Basics", async function () {
        it("Construction", async function () {
            var { secureLevel, owner, secure_source, other_source } = await loadFixture(deployAccountAndToken);
            const [symbol_, description_, live_, value_, lastUpdate_] = await secureLevel.getDetails()
            expect(symbol_).to.equal(symbol);
            expect(description_).to.equal(description);
            expect(live_).to.equal(false);
            expect(value_).to.equal(0);
        })
    })

    describe("Secure Level Security and Access control", async function () {
        it("Only owner can change verified source", async function () {
            var { secureLevel, owner, secure_source, other_source } = await loadFixture(deployAccountAndToken);
            await expect(secureLevel.connect(other_source).setExpectedSigner(ethers.constants.AddressZero)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        })
        it("Bad address passed as verified source", async function () {
            var { secureLevel, owner, secure_source, other_source } = await loadFixture(deployAccountAndToken);
            await expect(secureLevel.connect(owner).setExpectedSigner(ethers.constants.AddressZero)).to.be.revertedWith(
                "SecureLevel: Bad expected signer address"
            );
        })
        it("Only verified source can set level", async function () {
            var { secureLevel, owner, secure_source, other_source } = await loadFixture(deployAccountAndToken);
            var { value, nonce, secretMessage, secretMessageHash } = await loadFixture(signedMessage);

            await secureLevel.connect(owner).setExpectedSigner(secure_source.address);

            const sig = await owner.signMessage(ethers.utils.arrayify(secretMessageHash)); // Don't forget to arrayify to send bytes
            await expect(secureLevel.connect(other_source).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig))).to.be.revertedWith(
                "SecureLevel: caller is not the verified signer"
            );
        })
    })

    describe("Change of secure source", async function () {
        it("Valid change of verified source", async function () {
            var { secureLevel, owner, secure_source, other_source } = await loadFixture(deployAccountAndToken);
            await expect(secureLevel.connect(owner).setExpectedSigner(secure_source.address))
                .to.emit(secureLevel, 'ChangeOfSource')
                .withArgs(owner.address, secure_source.address);
        })
    })

    describe("Set level", async function () {
        it("Verified source must sign to set level", async function () {
            var { secureLevel, owner, secure_source, other_source } = await loadFixture(deployAccountAndToken);
            var { value, nonce, secretMessage, secretMessageHash } = await loadFixture(signedMessage);

            await secureLevel.connect(owner).setExpectedSigner(secure_source.address);

            var sig = await owner.signMessage(ethers.utils.arrayify(secretMessageHash)); // Signed as owner *not* secure source
            await expect(secureLevel.connect(secure_source).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig))).to.be.revertedWith(
                "SecureLevel: Required sender did not sign data"
            );

            sig = await secure_source.signMessage(ethers.utils.arrayify(secretMessageHash)); // Now signed as secure source
            await expect(secureLevel.connect(secure_source).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig)))
                .to.emit(secureLevel, 'LevelUpdated')
                .withArgs(value);
        })

        it("Set Value and check timestamp", async function () {
            var { secureLevel, owner, secure_source, other_source } = await loadFixture(deployAccountAndToken);
            var { value, nonce, secretMessage, secretMessageHash } = await loadFixture(signedMessage);

            await secureLevel.connect(owner).setExpectedSigner(secure_source.address);

            // Live should be false before set.
            var [symbol_, description_, live_, value_, lastUpdate_] = await secureLevel.getDetails()
            expect(live_).to.equal(false);

            sig = await secure_source.signMessage(ethers.utils.arrayify(secretMessageHash)); // Now signed as secure source
            await expect(secureLevel.connect(secure_source).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig)))
                .to.emit(secureLevel, 'LevelUpdated')
                .withArgs(value);

            // Value and timestamp should be current.
            const [actualValue, actualUpdated] = await secureLevel.connect(other_source).getVerifiedValue();
            expect(actualValue).to.equal(value);
            expect(actualUpdated).to.be.lessThan(Math.floor(Date.now()));

            // All values should align after set and be live.
            [symbol_, description_, live_, value_, lastUpdate_] = await secureLevel.getDetails()
            expect(symbol_).to.equal(symbol);
            expect(description_).to.equal(description);
            expect(live_).to.equal(true);
            expect(value_).to.equal(value);
            expect(lastUpdate_).to.be.lessThan(Math.floor(Date.now()));
        })
    })
});