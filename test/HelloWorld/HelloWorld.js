
const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * This suite tests the dummy Hello World contracts
 */
describe("Hello World Tests", function () {
    it("HelloWorld: Message not as expected", async function () {
        const testStr1 = "3142";
        const testStr2 = "6284";
        const [testAddr1, testAddr2] = await ethers.getSigners();
        const testUint1 = 1234;
        const testUint2 = 3456;
        
        const HelloWorld = await ethers.getContractFactory("HelloWorld");
        const helloWorld = await HelloWorld.deploy(testStr2, testAddr2.address, testUint2);

        testAddr2AsStr = `${testAddr2.address}`.toLowerCase();
        expect(await helloWorld.ctor_params()).to.equal(`Hello World Constructor - str: [${testStr2}] -addr: [${testAddr2AsStr}] -uint: [${testUint2}]`);

        testAddr1AsStr = `${testAddr1.address}`.toLowerCase();
        expect(await helloWorld.message(testStr1, testAddr1.address, testUint1)).to.equal(`Hello World Message - str: [${testStr1}] -addr: [${testAddr1AsStr}] -uint: [${testUint1}]`);

    });
});