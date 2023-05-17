require('module-alias/register'); // npm i --save module-alias
const fs = require("fs");
const { loadSharedConfig } = require("@scripts/lib/sharedConfig.js");
const { webServerAbiLocation } = require("../../helper-hardhat-config");
const {exportAbiAndBytecodeFromBuildArtifacts} = require("@scripts/lib/abiAndByteCodeUtil");
const exportAddressName = "./webserver/constants/contractAddressesConfig.json";

async function main() {
  console.log("Exporting details to WebService");
  console.log('Running from working directory: ' + process.cwd());

  var sharedConfig = loadSharedConfig();
  exportSharedConfigToWebService(sharedConfig);

  // ABI for contracts that have not been deployed.
  console.log("Exporting Contract ABI")
  await exportAbiAndBytecodeFromBuildArtifacts("Options", "SimpleOption", webServerAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("Options", "SimplePutOption", webServerAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("Options", "ERC721OptionContractTypeOne", webServerAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("Deals", "FXDeal", webServerAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("Libs", "VerifySigner", webServerAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("Libs", "UniqueId", webServerAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("DataFeeder", "EquityPrice", webServerAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("DataFeeder", "FXPrice", webServerAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("StableAsset", "ERC20CNYStableCoin", webServerAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("StableAsset", "ERC20EURStableCoin", webServerAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("StableAsset", "ERC20USDStableCoin", webServerAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("StableAsset", "ERC20AppleStableShare", webServerAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("StableAsset", "ERC20TeslaStableShare", webServerAbiLocation);
  await exportAbiAndBytecodeFromBuildArtifacts("HelloWorld", "HelloWorld", webServerAbiLocation);
  console.log("Update ./webserver/constants/index.js if you have added new contracts");

}


/**
 * Write the current state of the WebService to file.
 */
function exportSharedConfigToWebService(sharedConfig) {
  try {
    fs.writeFile(exportAddressName, JSON.stringify(sharedConfig), function (err) {
      if (err) throw err;
      console.log("Export config to WebService end OK");
    });
  } catch (err) {
    console.log(`Failed to export shared config to WebService with error [${err}]`);
  }
}

main(hre).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
