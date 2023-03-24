const { ethers } = require("hardhat");
const fs = require("fs");
const { frontEndAbiLocation } = require("../../helper-hardhat-config");
const { loadSharedConfig, sharedConfig } = require("../lib/sharedConfig.js");

const exportAddressName = "./frontend/constants/contractAddressesConfig.json";

async function main() {
  console.log("Updating front end...");
  var sharedConfig = loadSharedConfig();
  exportSharedConfigToFrontEnd(sharedConfig);

  await updateAbi("ERC20USDStableCoin", sharedConfig.usdStableCoin);
  await updateAbi("ERC20EURStableCoin", sharedConfig.eurStableCoin);
  await updateAbi("ERC20CNYStableCoin", sharedConfig.cnyStableCoin);
  await updateAbi("EquityPrice", sharedConfig.teslaEquityPriceContract);
  await updateAbi("EscrowCurrenyAccount", sharedConfig.usdEscrowAccount);
  await updateAbi("FXPrice", sharedConfig.UsdEurFXRateContract)
  // await updateAbi("FXPrice", sharedConfig.UsdCnyFXRateContract)
}

async function updateAbi(contractName, contractAddress) {
  const deployedContract = await ethers.getContractAt(
    contractName,
    contractAddress
  );
  fs.writeFileSync(
    `${frontEndAbiLocation}${contractName}.json`,
    deployedContract.interface.format(ethers.utils.FormatTypes.json)
  );
}

/**
 * Write the current state of the sharedConfig to file.
 */
function exportSharedConfigToFrontEnd(sharedConfig) {
  fs.writeFile(exportAddressName, JSON.stringify(sharedConfig), function (err) {
    if (err) throw err;
    console.log("Export config to front end OK");
  });
}

main(hre).catch((error) => {
  console.log(`\nStarted Export ABI\n`);
  console.error(error);
  process.exitCode = 1;
  console.log(`\nDone Export ABI\n`);
});
