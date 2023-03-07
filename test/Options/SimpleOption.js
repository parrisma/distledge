/*
 ** To run this only [> npx hardhat test --grep "Full Simulation"]
 */

const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const crypto = require("crypto");
const { TASK_NODE } = require("hardhat/builtin-tasks/task-names");
const { ethers } = require("hardhat");

/**
 * This suite tests the SimpleOption
 *
 * TODO: Complete test's use Integration.js for inspiration
 */

const underlyingPrice = 1200;
const genericDecimals = 2;
const forexRate = 0.1;

describe("Simple Option Test Suite", function () {
  // Define accounts
  //   let escrow_manager;
  let stable_coin_issuer;
  let data_vendor;
  let option_seller;
  let option_buyer;

  // ERC20StableCoin
  let premiumToken; // ERC20USDStableCoin
  let settlementToken; // ERC20CNYStableCoin
  let mockAggregator;
  let equityPrice;
  let fxPrice;
  let simpleOption;

  beforeEach(async function () {
    // Get accounts
    [
      //   escrow_manager,
      stable_coin_issuer,
      data_vendor,
      option_seller,
      option_buyer,
    ] = await ethers.getSigners();

    const ERC20USDStableCoin = await ethers.getContractFactory(
      "ERC20USDStableCoin"
    );
    const ERC20CNYStableCoin = await ethers.getContractFactory(
      "ERC20CNYStableCoin"
    );
    premiumToken = await ERC20USDStableCoin.connect(
      stable_coin_issuer
    ).deploy();
    settlementToken = await ERC20CNYStableCoin.connect(
      stable_coin_issuer
    ).deploy();

    mockAggregator = await ethers.getContractFactory("MockV3Aggregator");
    const mockUnderlyingPriceSource = await mockAggregator
      .connect(data_vendor)
      .deploy(genericDecimals, underlyingPrice);
    const mockForexSource = await mockAggregator
      .connect(data_vendor)
      .deploy(genericDecimals, forexRate * 10 ** genericDecimals);
    // await mockUnderlyingPriceSource.deployed();
    const EquityPrice = await ethers.getContractFactory("EquityPrice");
    equityPrice = await EquityPrice.deploy(
      "Underlying",
      mockUnderlyingPriceSource.address
    ); // referenceLevel_ instance
    const FXPrice = await ethers.getContractFactory("FXPrice");
    fxPrice = await FXPrice.deploy("USD/CNY", mockForexSource.address); // fxReferenceLevel_ instance

    const uniqueId = crypto.randomUUID();
    const SimpleOption = await ethers.getContractFactory("SimpleOption");
    const premium = 1;
    const notional = 100;
    const strike = 1000;
    simpleOption = await SimpleOption.connect(option_seller).deploy(
      uniqueId,
      "SimpleOption",
      "SimpleOption",
      option_buyer.address,
      premium,
      premiumToken.address,
      settlementToken.address,
      notional,
      strike,
      equityPrice.address,
      fxPrice.address
    );
    // await simpleOption.deployed();
  });

  it("Basic construction", async function () {
    expect(true).to.equal(true); // TODO: Write tests.
  });
});
