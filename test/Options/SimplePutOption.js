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
//   const { MockAggregatorV3Interface } = require("@chainlink/contracts");

/**
 * This suite tests the SimpleOption
 *
 * TODO: Fix MockAggregatorV3Interface dependency error
 * TODO: Complete test's use Integration.js for inspiration
 */
describe("Simple Put Option Test Suite", function () {
  let mockAggregator;
  this.beforeEach(async function () {
    // mockAggregator = await ethers.getContractFactory(MockAggregatorV3Interface);
    // mockAggregator = await mockAggregator.deploy(18, 5000000000000000);
    // await mockAggregator.deployed();
    // const mockedAggregatorV3Interface = await loadFixture(
    //   async function deployMockedAggregatorV3Interface() {
    //     const [owner, otherAccount] = await ethers.getSigners();
    //     const AggregatorV3Interface = await ethers.getContractFactory(
    //       "AggregatorV3Interface"
    //     );
    //     const aggregatorV3Interface = await AggregatorV3Interface.deploy();
    //     return { aggregatorV3Interface, owner, otherAccount };
    //   }
    // );
    // const mockedPriceReferenceLevel = await loadFixture(
    //   async function deployMockedPriceReferenceLevel() {
    //     const [owner, otherAccount] = await ethers.getSigners();
    //     const MockedPriceReferenceLevel = await ethers.getContractFactory(
    //       "MockedPriceReferenceLevel"
    //     );
    //     const priceReferenceLevel = await MockedPriceReferenceLevel.deploy(
    //       "MockedPriceTicker",
    //       mockAggregator.address
    //     );
    //     return { priceReferenceLevel, owner, otherAccount };
    //   }
    // );
  });

  //   describe("Deployment of MockedPriceReferenceLevel", function () {
  //     it("Should have mocked price reference level return", async function () {
  //       expect(
  //         await mockedPriceReferenceLevel.priceReferenceLevel.getTicker()
  //       ).to.equal("MockedPriceTicker");
  //     });
  //   });

  it("Basic construction", async function () {
    expect(true).to.equal(true); // TODO: Write tests.
  });
});
