const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Deal", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployDeal() {
        // Contracts are deployed using the first signer/account by default
        const [owner, buyer, seller] = await ethers.getSigners();

        const ERC20USDStableCoin = await ethers.getContractFactory("ERC20USDStableCoin");
        const token1 = await ERC20USDStableCoin.deploy();
        token1.mint(100); // initial supply

        const ERC20CNYStableCoin = await ethers.getContractFactory("ERC20CNYStableCoin");
        const token2 = await ERC20CNYStableCoin.deploy();
        token2.mint(100); // initial supply

        return { owner, seller, buyer, token1, token2 };
    }

    describe("Deal", function () {
        it("Simple deal", async function () {
            const { owner, buyer, seller, token1, token2 } = await loadFixture(deployDeal);
            const Deal = await ethers.getContractFactory("Deal");
            //await token1.connect(owner).transfer(buyer.address,1);
            //await token2.connect(owner).transfer(seller.address,1);
            const deal = await Deal.deploy(buyer.address, seller.address, token1.address, token2.address, 100, 50);
            deal.execute();
        });
    });
});
