const { expect } = require("chai");
const { Console } = require("console");
const { ethers, waffle } = require("hardhat");
const { provider, deployMockContract } = waffle;
const { BigNumber } = ethers;

describe("EquityPrice", function () {
  it("Equity Price is equal to expected value", async function () {
    //Create mock object for data from chain link which provides off chain data.

    const [deployerOfContract] = await provider.getWallets();
    const contractMeta = require("../../artifacts/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol/AggregatorV3Interface.json");

    const mockContract = await deployMockContract(
      deployerOfContract,
      contractMeta.abi
    );

    //Define the mocked price.
    const expected = 50;

    await mockContract.mock.latestRoundData.returns({
      0: roundId,
      expected: answer,
      0: startedAt,
      0: updatedAt,
      0: answeredInRound,
    });

    //Create and deploy contract of equity price
    const contract = await ethers.getContractFactory("EquityPrice");
    const deployed = await contract.deploy(mockContract.address);

    //Get latest equity price
    const actual = await deployed.getPrice();

    expect(Number(actual)).to.equal(expected);
  });
});
