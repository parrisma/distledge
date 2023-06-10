const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
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

        const unitsPerToken = await erc20USDStableCoin.unitsPerToken();

        return { erc20USDStableCoin, owner, otherAccount, unitsPerToken };
    }

    describe("Deployment", function () {
        it("Should have zero total at inception", async function () {
            const { erc20USDStableCoin } = await loadFixture(deployERC20USDStableCoin);
            expect(await erc20USDStableCoin.totalSupply()).to.equal(0);
        });

        it("Should have the correct owner (Account 0)", async function () {
            const { erc20USDStableCoin, owner } = await loadFixture(deployERC20USDStableCoin);
            expect(await erc20USDStableCoin.owner()).to.equal(owner.address);
        });

        it("Should not be paused at inception", async function () {
            const { erc20USDStableCoin, owner } = await loadFixture(deployERC20USDStableCoin);
            expect(await erc20USDStableCoin.paused()).to.equal(false);
        });

        it("Should have unit per token 100 for USD stable coin", async function () {
            const { erc20USDStableCoin, owner } = await loadFixture(deployERC20USDStableCoin);
            expect(await erc20USDStableCoin.unitsPerToken()).to.equal(100);
        });

        it("Should have decimal 2 for USD stable coin", async function () {
            const { erc20USDStableCoin, owner } = await loadFixture(deployERC20USDStableCoin);
            expect(await erc20USDStableCoin.decimals()).to.equal(2);
        });

        it("Should have iso code 'USD' for USD stable coin", async function () {
            const { erc20USDStableCoin, owner } = await loadFixture(deployERC20USDStableCoin);
            expect(await erc20USDStableCoin.assetCode()).to.equal("USD");
        });

        it("Should have symbol 'USDS'", async function () {
            const { erc20USDStableCoin, owner } = await loadFixture(deployERC20USDStableCoin);
            expect(await erc20USDStableCoin.symbol()).to.equal("USDS");
        });

        it("Should have name 'USDStableCoin'", async function () {
            const { erc20USDStableCoin, owner } = await loadFixture(deployERC20USDStableCoin);
            expect(await erc20USDStableCoin.name()).to.equal("USDStableCoin");
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
            const { erc20USDStableCoin, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20USDStableCoin);
            const qty = 1 * unitsPerToken
            await erc20USDStableCoin.connect(owner).mint(qty)
            // after minting we have supply scaled by number of decimals
            expect(await erc20USDStableCoin.totalSupply()).to.equal(qty);
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(qty);
        });

        // Mint twice totals checks
        // ------------------
        it("TotalSupply and Owner balance should be sum units after minting twice", async function () {
            const { erc20USDStableCoin, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20USDStableCoin);
            const mintQty1 = 1 * unitsPerToken
            const mintQty2 = 2 * unitsPerToken
            const mintQty3 = 3 * unitsPerToken
            await erc20USDStableCoin.connect(owner).mint(mintQty1)
            // after minting we have supply scaled by number of decimals
            expect(await erc20USDStableCoin.totalSupply()).to.equal(mintQty1);
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(mintQty1);

            await erc20USDStableCoin.connect(owner).mint(mintQty2)
            // after minting we have supply scaled by number of decimals
            expect(await erc20USDStableCoin.totalSupply()).to.equal(mintQty3);
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(mintQty3);
        });

        // Burn fundamentals
        // -----------------
        it("Should fail as we burn more than supply", async function () {
            const { erc20USDStableCoin, owner, otherAccount } = await loadFixture(deployERC20USDStableCoin);
            await expect(erc20USDStableCoin.connect(owner).burn(100)).to.be.revertedWith(
                "ERC20: burn amount exceeds balance"
            );
        });

        // Burn some units checks
        // ------------------
        it("TotalSupply and Owner should remain units after burning some units", async function () {
            const { erc20USDStableCoin, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20USDStableCoin);

            const mintQty = 3 * unitsPerToken
            const burnQty = 1 * unitsPerToken
            const balanceQty = 2 * unitsPerToken
            await erc20USDStableCoin.connect(owner).mint(mintQty)
            expect(await erc20USDStableCoin.totalSupply()).to.equal(mintQty);

            totalSupply = await erc20USDStableCoin.totalSupply();
            await erc20USDStableCoin.connect(owner).burn(burnQty)
            expect(await erc20USDStableCoin.totalSupply()).to.equal(balanceQty);
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(balanceQty);
        });

        // Burn totals checks
        // ------------------
        it("TotalSupply and Owner should have zero units after burning totalSupply", async function () {
            const { erc20USDStableCoin, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20USDStableCoin);

            const qty = 1 * unitsPerToken
            await erc20USDStableCoin.connect(owner).mint(qty)
            expect(await erc20USDStableCoin.totalSupply()).to.equal(qty);

            totalSupply = await erc20USDStableCoin.totalSupply();
            await erc20USDStableCoin.connect(owner).burn(totalSupply)
            expect(await erc20USDStableCoin.totalSupply()).to.equal(0);
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(0);
        });
    });

    describe("Pausable", function () {

        // Functions that modify contract state cannot be called when it is paused 
        // -----------------------------------------------------------------------
        it("Mint should fail if Paused", async function () {
            const { erc20USDStableCoin, owner, otherAccount } = await loadFixture(deployERC20USDStableCoin);
            await erc20USDStableCoin.pause();
            await expect(erc20USDStableCoin.connect(owner).mint(1)).to.be.revertedWith(
                "Pausable: paused"
            );
        });

        it("Burn should fail if Paused", async function () {
            const { erc20USDStableCoin, owner, otherAccount } = await loadFixture(deployERC20USDStableCoin);
            await erc20USDStableCoin.pause();
            await expect(erc20USDStableCoin.connect(owner).burn(0)).to.be.revertedWith(
                "Pausable: paused"
            );
        });

        it("Transfer should fail if Paused", async function () {
            const { erc20USDStableCoin, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20USDStableCoin);
            await erc20USDStableCoin.connect(owner).mint(1)
            await erc20USDStableCoin.pause();
            await expect(erc20USDStableCoin.connect(owner).transfer(otherAccount.address, 1 * unitsPerToken)).to.be.revertedWith(
                "ERC20Pausable: token transfer while paused"
            );
        });

        it("TransferFrom should fail if Paused", async function () {
            const { erc20USDStableCoin, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20USDStableCoin);
            await erc20USDStableCoin.connect(owner).mint(1)
            await erc20USDStableCoin.connect(owner).approve(owner.address, 1 * unitsPerToken)
            await erc20USDStableCoin.pause();
            await expect(erc20USDStableCoin.connect(owner).transferFrom(owner.address, otherAccount.address, 1 * unitsPerToken)).to.be.revertedWith(
                "ERC20Pausable: token transfer while paused"
            );
        });
    });

    describe("Transfer", function () {

        // Transfer between owner and token buyer
        // --------------------------------------
        it("Transfer Owner to any other token buyer account", async function () {
            const { erc20USDStableCoin, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20USDStableCoin);

            const qty = 1 * unitsPerToken
            await erc20USDStableCoin.connect(owner).mint(qty)
            await erc20USDStableCoin.connect(owner).transfer(otherAccount.address, 0.25 * unitsPerToken)
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(0.75 * unitsPerToken);
            expect(await erc20USDStableCoin.balanceOf(otherAccount.address)).to.equal(0.25 * unitsPerToken);
        });

        // TransferFrom owner to token buyer, reverted as no allowance
        // it will fail even though owner has a sufficient balance.
        // ------------------------------------------------------------
        it("TransferFrom owner to other account should revert without allowance", async function () {
            const { erc20USDStableCoin, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20USDStableCoin);

            const qty = 1 * unitsPerToken
            await erc20USDStableCoin.connect(owner).mint(qty)
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(1 * unitsPerToken);
            await expect(erc20USDStableCoin.connect(owner).transferFrom(owner.address, otherAccount.address, 0.25 * unitsPerToken)).to.be.revertedWith(
                "ERC20: insufficient allowance"
            );
        });

        // TransferFrom owner to token buyer with owner sufficient balance
        // --------------------------------------------------------------
        it("TransferFrom owner to other account with approved balance", async function () {
            const { erc20USDStableCoin, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20USDStableCoin);

            const qty = 1 * unitsPerToken
            await erc20USDStableCoin.connect(owner).mint(qty)
            await erc20USDStableCoin.connect(owner).approve(owner.address, 0.25 * unitsPerToken)
            await erc20USDStableCoin.connect(owner).transfer(otherAccount.address, 0.25 * unitsPerToken)
            expect(await erc20USDStableCoin.balanceOf(owner.address)).to.equal(0.75 * unitsPerToken);
            expect(await erc20USDStableCoin.balanceOf(otherAccount.address)).to.equal(0.25 * unitsPerToken);
        });

    });
});
