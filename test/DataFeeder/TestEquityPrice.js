const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("EquityPrice", function(){    

    it("Equity Price is equal to expected value",async function(){        
        
        //Create mock object for data from chain link which provides off chain data.
        const mock = await ethers.getContractFactory("MockV3Aggregator");

        //Define the mocked price.
        const expected=50;
        const mockDeployed = await mock.deploy(8,expected);

        //Create and deploy contract of equity price
        const contract=await ethers.getContractFactory("EquityPrice");
        const deployed=await contract.deploy(mockDeployed.address);        

        //Get latest equity price
        const actual = await deployed.getPrice();
        
        expect(Number(actual)).to.equal(expected);
    })
})