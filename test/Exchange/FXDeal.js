/*
** Test-set Exchange
*/
const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("FXDeal", function () {
    /* We define a fixture to reuse the same setup in every test.
    ** We use loadFixture to run this setup once, snapshot that state,
    ** and reset Hardhat Network to that snapshot in every test.
    */ 
    async function deployFXDeal() {
        // Contracts are deployed using the first signer/account by default
        const [owner, buyer, seller] = await ethers.getSigners();

        const ERC20USDStableCoin = await ethers.getContractFactory("ERC20USDStableCoin");
        const token1 = await ERC20USDStableCoin.deploy();
        const mintAmountToken1 = 100;
        token1.mint(mintAmountToken1); // initial supply
        expect(await token1.totalSupply()).to.equal(mintAmountToken1 * await token1.unitsPerToken());

        const ERC20CNYStableCoin = await ethers.getContractFactory("ERC20CNYStableCoin");
        const token2 = await ERC20CNYStableCoin.deploy();
        const mintAmountToken2 = 100;
        token2.mint(mintAmountToken2); // initial supply
        expect(await token2.totalSupply()).to.equal(mintAmountToken2 * await token2.unitsPerToken());

        return { owner, seller, buyer, token1, token2 };
    }

    describe("Construct FXDeal", function () {

        it("Should fail rate is zero", async function () {
            const { owner, buyer, seller, token1, token2 } = await loadFixture(deployFXDeal);
            const Deal = await ethers.getContractFactory("FXDeal");
            const rate = 0; // Bad rate
            const quantity = 1; // Valid Quantity
            await expect(Deal.deploy(seller.address, buyer.address, token1.address, token2.address, quantity, rate)).to.be.revertedWith(
                "Deal: Conversion rate cannot be zero"
            );
        });

        it("Should fail quantity is zero", async function () {
            const { owner, buyer, seller, token1, token2 } = await loadFixture(deployFXDeal);
            const Deal = await ethers.getContractFactory("FXDeal");
            const rate = 1; // Valid rate
            const quantity = 0; // InValid Quantity
            await expect(Deal.deploy(seller.address, buyer.address, token1.address, token2.address, quantity, rate)).to.be.revertedWith(
                "Deal: Quantity must be greater than zero"
            );
        });

        it("Should fail seller address is not valid", async function () {
            const { owner, buyer, seller, token1, token2 } = await loadFixture(deployFXDeal);
            const Deal = await ethers.getContractFactory("FXDeal");
            const rate = 1; // Valid rate
            const quantity = 1; // Valid Quantity
            await expect(Deal.deploy(ethers.constants.AddressZero, buyer.address, token1.address, token2.address, quantity, rate)).to.be.revertedWith(
                "Deal: Invalid seller address"
            );
        });

        it("Should fail buyer address is not valid", async function () {
            const { owner, buyer, seller, token1, token2 } = await loadFixture(deployFXDeal);
            const Deal = await ethers.getContractFactory("FXDeal");
            const rate = 1; // Valid rate
            const quantity = 1; // Valid Quantity
            await expect(Deal.deploy(seller.address, ethers.constants.AddressZero, token1.address, token2.address, quantity, rate)).to.be.revertedWith(
                "Deal: Invalid buyer address"
            );
        });

        it("Contract should represent deal info as passed", async function () {
            const { owner, buyer, seller, token1, token2 } = await loadFixture(deployFXDeal);
            const Deal = await ethers.getContractFactory("FXDeal");
            const rate = 123; // Valid rate
            const quantity = 456; // Valid Quantity
            const deal = await Deal.deploy(seller.address, buyer.address, token1.address, token2.address, quantity, rate);
            const [buyer_, seller_, token1_, token2_, rate_, quantity_] = await deal.info();
            expect(rate_).to.equal(rate);
            expect(quantity_).to.equal(quantity);
        });
    });

    describe("Good FXDeals", function () {
        it("Simple deal", async function () {
            const { owner, buyer, seller, token1, token2 } = await loadFixture(deployFXDeal);

            const Deal = await ethers.getContractFactory("FXDeal");
            const rate = 50; // 50%
            const quantity = 100;
            const deal = await Deal.deploy(seller.address, buyer.address, token1.address, token2.address, quantity, rate);

            // Grant total supply of each Token to the buyer and seller so they can 'trade'
            //
            await token1.connect(owner).transfer(seller.address, await token1.totalSupply());
            await token2.connect(owner).transfer(buyer.address, await token2.totalSupply());
            expect(await token1.balanceOf(seller.address)).to.equal(await token1.totalSupply());
            expect(await token2.balanceOf(buyer.address)).to.equal(await token2.totalSupply());

            // Grant allowance to deal instance so that it execute can the FX (token swap) transfer 
            // for the defined buy and sell balances
            await token1.connect(seller).approve(deal.address, Number(await deal.sellQuantity()));
            expect(await token1.allowance(seller.address, deal.address)).to.equal(Number(await deal.sellQuantity()));

            await token2.connect(buyer).approve(deal.address, Number(await deal.buyQuantity()));
            expect(await token2.allowance(buyer.address, deal.address)).to.equal(Number(await deal.buyQuantity()));
        
            await deal.connect(owner).execute();

            expect(await token1.balanceOf(owner.address)).to.equal(0); // Owner should never have residual balance
            expect(await token1.balanceOf(deal.address)).to.equal(0); // deal should never have residual balance)
            expect(await token1.balanceOf(seller.address)).to.equal(await token1.totalSupply() - await deal.sellQuantity());
            expect(await token1.balanceOf(buyer.address)).to.equal(await deal.sellQuantity());
            expect(await token2.balanceOf(owner.address)).to.equal(0); // Owner should never have residual balance
            expect(await token2.balanceOf(deal.address)).to.equal(0); // deal should never have residual balance)
            expect(await token2.balanceOf(seller.address)).to.equal(await deal.buyQuantity());
            expect(await token2.balanceOf(buyer.address)).to.equal(await token1.totalSupply() - await deal.buyQuantity());

            // Deal is one shot, no account including the deal-owner should be able to call.
            // after execute has been called successfully.
            await expect(deal.connect(owner).execute()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
            await expect(deal.connect(seller).execute()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
            await expect(deal.connect(buyer).execute()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });
    });
});
