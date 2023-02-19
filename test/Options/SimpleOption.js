/*
** To run this only [> npx hardhat test --grep "Full Simulation"]
*/

const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const crypto = require('crypto');
const { TASK_NODE } = require("hardhat/builtin-tasks/task-names");
const { ethers } = require("hardhat");

/**
 * This suite tests the SimpleOption
 * 
 * TODO: Complete test's use Integration.js for inspiration
 */
describe("Simple Option Test Suite", function () {
    it("Basic construction", async function () {
        expect(true).to.equal(true); // TODO: Write tests.
    }
    )
});
