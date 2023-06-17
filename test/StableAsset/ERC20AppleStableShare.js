const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
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
        it("Should have 1 in the unit per token", async function () {
            const { appleSS } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.unitsPerToken()).to.equal(1);
        });
        it("Should have the ISIN code as US0378331005", async function () {
            const { appleSS } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.assetCode()).to.equal("US0378331005");
        });
        it("Should have the token name as AppleStableShare", async function () {
            const { appleSS } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.name()).to.equal("AppleStableShare");
        });
        it("Should have the token symbol as APLSS", async function () {
            const { appleSS } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.symbol()).to.equal("APLSS");
        });
        it("Should have the share symbol as APLSS-US0378331005", async function () {
            const { appleSS } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.share_symbol()).to.equal("APLSS-US0378331005");
        });
        it("Should have zero total at inception", async function () {
            const { appleSS } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.totalSupply()).to.equal(0);
        });
        it("Should have 0 decimal places", async function () {
            const { appleSS } = await loadFixture(deployERC20AppleStableShare);
            expect(await appleSS.decimals()).to.equal(0);
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

    describe("Transfer", function () {

        // Transfer between owner and token buyer
        // --------------------------------------
        it("Transfer Owner to any other token buyer account", async function () {
            const { appleSS, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20AppleStableShare);

            const qty = 100;
            await appleSS.connect(owner).mint(qty * unitsPerToken);
            expect(await appleSS.balanceOf(owner.address)).to.equal(qty * unitsPerToken);
            await appleSS.connect(owner).transfer(otherAccount.address, qty * 0.25 * unitsPerToken);
            expect(await appleSS.balanceOf(owner.address)).to.equal(qty * 0.75 * unitsPerToken);
            expect(await appleSS.balanceOf(otherAccount.address)).to.equal(qty * 0.25 * unitsPerToken);
        });

        // TransferFrom owner to token buyer, reverted as no allowance
        // it will fail even though owner has a sufficient balance.
        // ------------------------------------------------------------
        it("TransferFrom owner to other account should revert without allowance", async function () {
            const { appleSS, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20AppleStableShare);

            const qty = 100;
            await appleSS.connect(owner).mint(qty * unitsPerToken)
            expect(await appleSS.balanceOf(owner.address)).to.equal(qty * unitsPerToken);
            await expect(appleSS.connect(owner).transferFrom(owner.address, otherAccount.address, qty * 0.25 * unitsPerToken)).to.be.revertedWith(
                "ERC20: insufficient allowance"
            );
        });

        // TransferFrom owner to token buyer with owner sufficient balance
        // Q: is approve function used to allow a 3rd account 
        // --------------------------------------------------------------
        it("TransferFrom owner to other account with approved balance", async function () {
            const { appleSS, owner, otherAccount, unitsPerToken } = await loadFixture(deployERC20AppleStableShare);

            const qty = 100;
            await appleSS.connect(owner).mint(qty * unitsPerToken);
            await appleSS.connect(owner).approve(owner.address, qty * 0.25 * unitsPerToken)
            await appleSS.connect(owner).transfer(otherAccount.address, qty * 0.25 * unitsPerToken)
            expect(await appleSS.balanceOf(owner.address)).to.equal(qty * 0.75 * unitsPerToken);
            expect(await appleSS.balanceOf(otherAccount.address)).to.equal(qty * 0.25 * unitsPerToken);
        });
    });
});
