const { ethers, network } = require("hardhat");
const fs = require("fs");
const {
  frontEndContractsAddressFile,
  frontEndAbiLocation,
} = require("../helper-hardhat-config");

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating front end...");
    // updateContractAddresses();
    updateAbi();
  }
};

async function updateContractAddresses() {
  const deployedContract = await ethers.getContract("EquityPrice");
  const chainId = network.config.chainId.toString();
  const currentAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsAddressFile, "utf-8")
  );
  if (chainId in currentAddresses) {
    if (!currentAddresses[chainId].includes(deployedContract.address)) {
      currentAddresses[chainId].push(deployedContract.address);
    }
  } else {
    currentAddresses[chainId] = [deployedContract.address];
  }
  fs.writeFileSync(
    frontEndContractsAddressFile,
    JSON.stringify(currentAddresses)
  );
}

async function updateAbi() {
  const deployedContract = await ethers.getContract("EquityPrice");
  fs.writeFileSync(
    `${frontEndAbiLocation}EquityPrice.json`,
    deployedContract.interface.format(ethers.utils.FormatTypes.json)
  );
}

module.exports.tags = ["all", "frontend"];
