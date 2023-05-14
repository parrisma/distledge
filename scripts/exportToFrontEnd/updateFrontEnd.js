require('module-alias/register'); // npm i --save module-alias
const { ethers } = require("hardhat");
const fs = require("fs");
const { frontEndAbiLocation } = require("../../helper-hardhat-config");
const { loadSharedConfig } = require("@scripts/lib/sharedConfig.js");
const {exportAbiAndBytecodeFromBuildArtifacts} = require("@scripts/lib/abiAndByteCodeUtil");
const exportAddressName = "./frontend/constants/contractAddressesConfig.json";

async function main() {
  console.log("Exporting details to ./frontend...");

  console.log('Running from working directory: ' + process.cwd());

  var sharedConfig = loadSharedConfig();
  exportSharedConfigToFrontEnd(sharedConfig);

  // ABI for contracts that have not been deployed.
  console.log("Exporting Contract ABI")
  await exportAbiAndBytecodeFromBuildArtifacts("Options", "SimpleOption", frontEndAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("Options", "SimplePutOption", frontEndAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("Deals", "FXDeal", frontEndAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("DataFeeder", "EquityPrice", frontEndAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("DataFeeder", "FXPrice", frontEndAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("StableAsset", "ERC20CNYStableCoin", frontEndAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("StableAsset", "ERC20EURStableCoin", frontEndAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("StableAsset", "ERC20USDStableCoin", frontEndAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("StableAsset", "ERC20AppleStableShare", frontEndAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("HelloWorld", "HelloWorld", frontEndAbiLocation);
  console.log("Update ./frontend/constants/index.js if you have added new contracts");
}

/**
 * Write the current state of the sharedConfig to file.
 */
function exportSharedConfigToFrontEnd(sharedConfig) {
  try {
    fs.writeFile(exportAddressName, JSON.stringify(sharedConfig), function (err) {
      if (err) throw err;
      console.log("Export config to front end OK");
    });
  } catch (err) {
    console.log(`Failed to export shared config with error [${err}]`);
  }
}

main(hre).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
