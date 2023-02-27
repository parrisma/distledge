const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const crypto = require("crypto");

describe("EquityPrice", function () {
  let equityPrice;
  let mockPriceSource;
  let deployer;
  const ticker = "TCKR";
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    // Deploy
    await deployments.fixture(["EquityPrice"]);
    equityPrice = await ethers.getContract("EquityPrice", deployer);
    mockPriceSource = await ethers.getContract("MockV3Aggregator", deployer);
  });

  it("Equity Price is equal to initial price value and test updated price", async function () {
    //Define the mocked price.
    const expectedPx = 50;
    expect(await equityPrice.getPrice()).to.equal(expectedPx);
    expect(await equityPrice.getTicker()).to.equal(ticker);

    // Update source and verify change
    const revised = expectedPx + 1;
    await mockPriceSource.updateAnswer(revised);
    expect(await equityPrice.getPrice()).to.equal(revised);
  });

  it("Equity Price will be rejected when price is negative figure", async function () {
    //Define the bad price.
    const expectedPx = -1;
    await mockPriceSource.updateAnswer(expectedPx);
    await expect(equityPrice.getPrice()).to.be.revertedWith(
      "EquityPrice: bad data feed, the price must be greater than or equals to zero"
    );
  });

  it("Equity Price will be accepted when price equals to zero", async function () {
    // boundary value price
    const expectedPx = 0;
    await mockPriceSource.updateAnswer(expectedPx);
    expect(await equityPrice.getPrice()).to.equal(expectedPx);
  });
});
