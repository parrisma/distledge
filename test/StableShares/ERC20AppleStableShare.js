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
        it("Should have 100 in the unit per token", async function () {
            const { appleSS } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.unitsPerToken()).to.equal(100);
        });
        it("Should have the isincode as US0378331005", async function () {
            const { appleSS } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.isinCode()).to.equal("US0378331005");
        });
        it("Should have the token name as AppleStableShare", async function () {
            const { appleSS } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.token_name()).to.equal("AppleStableShare");
        });
        it("Should have the token symbol as AppleSS", async function () {
            const { appleSS } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.token_symbol()).to.equal("AppleSS");
        });
        it("Should have zero total at inception", async function () {
            const { appleSS } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.totalSupply()).to.equal(0);
        });

        it("Should have the correct owner (Account 0)", async function () {
            const { appleSS, owner } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.owner()).to.equal(owner.address);
        });

        it("Should not be paused at inception", async function () {
            const { appleSS, owner } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.paused()).to.equal(false);
        });

    });

    describe("MintAndBurn", function () {

        // Access control 
        // --------------
        it("Should fail if caller of mint is not the owner", async function () {
            const { appleSS, owner, otherAccount } = await loadFixture(deployERC20AppleStableShare);
            await expect(appleSS.connect(otherAccount).mint(1)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });

        it("Should fail if caller of burn is not the owner", async function () {
            const { appleSS, owner, otherAccount } = await loadFixture(deployERC20AppleStableShare);
            await expect(appleSS.connect(otherAccount).burn(0)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });
    });

    describe("Pausable", function () {

        // Functions that modify contract state cannot be called when it is paused 
        // -----------------------------------------------------------------------
        it("Mint should fail if Paused", async function () {
            const { appleSS, owner, otherAccount } = await loadFixture(deployERC20AppleStableShare);
            await appleSS.pause();
            await expect(appleSS.connect(owner).mint(1)).to.be.revertedWith(
                "Pausable: paused"
            );
        });

        it("Burn should fail if Paused", async function () {
            const { appleSS, owner, otherAccount } = await loadFixture(deployERC20AppleStableShare);
            await appleSS.pause();
            await expect(appleSS.connect(owner).burn(0)).to.be.revertedWith(
                "Pausable: paused"
            );
        });

        it("Transfer should fail if Paused", async function () {
            const { appleSS, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20AppleStableShare);
            await appleSS.connect(owner).mint(1)
            await appleSS.pause();
            await expect(appleSS.connect(owner).transfer(otherAccount.address, 1 * unitsPerToken)).to.be.revertedWith(
                "ERC20Pausable: token transfer while paused"
            );
        });

        it("TransferFrom should fail if Paused", async function () {
            const { appleSS, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20AppleStableShare);
            await appleSS.connect(owner).mint(1)
            await appleSS.connect(owner).approve(owner.address, 1 * unitsPerToken)
            await appleSS.pause();
            await expect(appleSS.connect(owner).transferFrom(owner.address, otherAccount.address, 1 * unitsPerToken)).to.be.revertedWith(
                "ERC20Pausable: token transfer while paused"
            );
        });

    });
});