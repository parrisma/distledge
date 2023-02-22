const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { provider, deployMockContract } = waffle;
const crypto = require("crypto");

describe("EquityPrice", function () {
  async function deployEquityPrice() {
    //Get the virtual singer
    const [deployerOfContract] = await provider.getWallets();

    // Fetch application binary interface of AggregatorV3Interface
    const contractMeta = require("../../artifacts/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol/AggregatorV3Interface.json");

    const mockPriceSource = await deployMockContract(
      deployerOfContract,
      contractMeta.abi
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
    await mockPriceSource.mock.latestRoundData.returns(0, expectedPx, 0, 0, 0);

    expect(await equityPrice.getPrice()).to.equal(expectedPx);
    expect(await equityPrice.getTicker()).to.equal(ticker);

    // Update source and verify change
    const revised = expectedPx + 1;
    await mockPriceSource.mock.latestRoundData.returns(0, revised, 0, 0, 0);
    expect(await equityPrice.getPrice()).to.equal(revised);
  });

  it("Equity Price rejected when negative", async function () {
    // Deploy
    const { mockPriceSource, equityPrice, ticker } = await loadFixture(
      deployEquityPrice
    );

    //Define the bad price.
    const expectedPx = -1;
    await mockPriceSource.mock.latestRoundData.returns(0, expectedPx, 0, 0, 0);

    await expect(equityPrice.getPrice()).to.be.revertedWith(
      "EquityPrice: bad data feed, prices must be greater than zero"
    );
  });
});
