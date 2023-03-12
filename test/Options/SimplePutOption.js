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
  this.beforeEach(async function () {});

  it("Basic construction", async function () {
    expect(true).to.equal(true); // TODO: Write tests.
  });
});
