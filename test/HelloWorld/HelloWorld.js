
const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * This suite tests the dummy Hello World contracts
 */
describe("Hello World Tests", function () {
    it("HelloWorld: Should say hello world", async function () {
        const HelloWorld = await ethers.getContractFactory("HelloWorld");
        const helloWorld = await HelloWorld.deploy();
        expect(await helloWorld.message()).to.equal("Hello World");

    });
});