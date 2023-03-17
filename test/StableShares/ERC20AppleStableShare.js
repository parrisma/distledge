const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("ERC20AppleStableShare", function () {

    async function deployERC20AppleStableShare() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const ERC20AppleStableShare = await ethers.getContractFactory("ERC20AppleStableShare");
        const appleSS = await ERC20AppleStableShare.deploy();

        const unitsPerToken = await appleSS.unitsPerToken();

        return { appleSS, owner, otherAccount, unitsPerToken };
    }

    describe("Initialization phase of Stable shares", function () {
        it("Should have zero in the unit per token", async function () {
            const { appleSS } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.unitsPerToken()).to.equal(0);
        });
    });

});