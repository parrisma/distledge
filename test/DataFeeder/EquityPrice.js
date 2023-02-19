const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require('hardhat');
const crypto = require('crypto');

describe("EquityPrice", function () {

    async function deployEquityPrice() {
        // Create mock object for data from chain link which provides off chain data.
        const priceDecimalPLaces = 2;
        const MockPriceSource = await ethers.getContractFactory("MockV3Aggregator");
        const mockPriceSource = await MockPriceSource.deploy(priceDecimalPLaces, 0);

        // Equity Price to test
        const ticker = "TCKR";
        const equityPriceContract = await ethers.getContractFactory("EquityPrice");
        const equityPrice = await equityPriceContract.deploy(ticker, mockPriceSource.address);

        return { mockPriceSource, equityPrice, ticker }
    }

    it("Equity Price is equal to initial value and update", async function () {

        // Deploy
        const { mockPriceSource, equityPrice, ticker } = await loadFixture(deployEquityPrice)

        //Define the mocked price.
        const expectedPrice = 50;
        await mockPriceSource.updateAnswer(expectedPrice);

        expect(await equityPrice.getPrice()).to.equal(expectedPrice);
        expect(await equityPrice.getTicker()).to.equal(ticker)

        // Update source and verify change
        const revisedExpectedPrice = expectedPrice + 1;
        await mockPriceSource.updateAnswer(revisedExpectedPrice);
        expect(await equityPrice.getPrice()).to.equal(revisedExpectedPrice);
    })

    it("Equity Price rejected when negative", async function () {

        // Deploy
        const { mockPriceSource, equityPrice, ticker } = await loadFixture(deployEquityPrice)

        //Define the bad price.
        const expectedPrice = -1;
        await mockPriceSource.updateAnswer(expectedPrice);

        await expect(equityPrice.getPrice()).to.be.revertedWith(
            "EquityPrice: bad data feed, prices must be greater than zero"
        );
    });
})