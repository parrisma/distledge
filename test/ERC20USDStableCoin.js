const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("ERC20USDStableCoin", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployERC20USDStableCoin() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const ERC20USDStableCoin = await ethers.getContractFactory("ERC20USDStableCoin");
        const erc20USDStableCoin = await ERC20USDStableCoin.deploy();

        const dps = await erc20USDStableCoin.decimals();
        console.log(dps);

        return { erc20USDStableCoin, owner, otherAccount, dps };
    }

    describe("Deployment", function () {
        it("Should have zero total at inception", async function () {
            const { erc20USDStableCoin } = await loadFixture(deployERC20USDStableCoin);
            expect(await erc20USDStableCoin.totalSupply()).to.equal(0);
        });

        it("Should set the right owner", async function () {
            const { erc20USDStableCoin, owner } = await loadFixture(deployERC20USDStableCoin);
            expect(await erc20USDStableCoin.owner()).to.equal(owner.address);
        });
    });

    describe("MintAndBurn", function () {

        // Access control 
        // --------------
        it("Should fail if caller of mint is not the owner", async function () {
            const { erc20USDStableCoin, owner, otherAccount } = await loadFixture(deployERC20USDStableCoin);
            await expect(erc20USDStableCoin.connect(otherAccount).mint(1)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });

        it("Should fail if caller of burn is not the owner", async function () {
            const { erc20USDStableCoin, owner, otherAccount } = await loadFixture(deployERC20USDStableCoin);
            await expect(erc20USDStableCoin.connect(otherAccount).burn(0)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });

        // Mint totals checks
        // ------------------
        it("TotalSupply and Owner balance should be one unit after minting one", async function () {
            const { erc20USDStableCoin, owner, otherAccount, dps } = await loadFixture(deployERC20USDStableCoin);
            await erc20USDStableCoin.connect(owner).mint(1)
            // after minting we have supply scaled by number of decimals
            expect(await erc20USDStableCoin.totalSupply()).to.equal(1 * 10 ** dps);
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(1 * 10 ** dps);
        });

        // Burn totals checks
        // ------------------
        it("TotalSupply and Owner should have zero units after burning totalSupply", async function () {
            const { erc20USDStableCoin, owner, otherAccount, dps } = await loadFixture(deployERC20USDStableCoin);

            await erc20USDStableCoin.connect(owner).mint(1)
            expect(await erc20USDStableCoin.totalSupply()).to.equal(1 * 10 ** dps);

            totalSupply = await erc20USDStableCoin.totalSupply();
            await erc20USDStableCoin.connect(owner).burn(totalSupply / (10 ** dps))
            expect(await erc20USDStableCoin.totalSupply()).to.equal(0);
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(0);
        });
    });
});
