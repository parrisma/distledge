const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const crypto = require("crypto");

describe("EquityPrice", function () {
  async function deployEquityPrice() {
    //Get the virtual singer
    const [deployerOfContract] = await ethers.getSigners();

    // Fetch application binary interface of AggregatorV3Interface
    const contractMeta = require("../../artifacts/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol/AggregatorV3Interface.json");
    const mockPriceDecimals = 2;
    const mockPriceInitial = 50;

    mockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
    mockPriceSource = await mockV3Aggregator.deploy(
      mockPriceDecimals,
      mockPriceInitial
    );

    // Equity Price to test
    const ticker = "TCKR";
    const equityPriceContract = await ethers.getContractFactory("EquityPrice");
    const equityPrice = await equityPriceContract.deploy(
      ticker,
      mockPriceSource.address
    );

    return { mockPriceSource, equityPrice, ticker };
  }

  it("Equity Price is equal to initial value and update", async function () {
    // Deploy
    const { mockPriceSource, equityPrice, ticker } = await loadFixture(
      deployEquityPrice
    );

    //Define the mocked price.
    const expectedPx = 50;
    expect(await equityPrice.getPrice()).to.equal(expectedPx);
    expect(await equityPrice.getTicker()).to.equal(ticker);

    // Update source and verify change
    const revised = expectedPx + 1;
    await mockPriceSource.updateAnswer(revised);
    expect(await equityPrice.getPrice()).to.equal(revised);
  });

  it("Equity Price rejected when negative", async function () {
    // Deploy
    const { mockPriceSource, equityPrice, ticker } = await loadFixture(
      deployEquityPrice
    );

    //Define the bad price.
    const expectedPx = -1;
    await mockPriceSource.updateAnswer(expectedPx);
    await expect(equityPrice.getPrice()).to.be.revertedWith(
      "EquityPrice: bad data feed, prices must be greater(equals) than zero"
    );
  });

  it("Equity Price accepted when zero", async function () {
    // Deploy
    const { mockPriceSource, equityPrice, ticker } = await loadFixture(
      deployEquityPrice
    );

    const expectedPx = 0;
    await mockPriceSource.updateAnswer(expectedPx);
    expect(await equityPrice.getPrice()).to.equal(0);
  });
});
