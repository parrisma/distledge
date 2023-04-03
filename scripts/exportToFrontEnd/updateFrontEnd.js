const { ethers } = require("hardhat");
const fs = require("fs");
const { frontEndAbiLocation } = require("../../helper-hardhat-config");
const { loadSharedConfig, sharedConfig } = require("../lib/sharedConfig.js");

const exportAddressName = "./frontend/constants/contractAddressesConfig.json";

async function main() {
  console.log("Exporting details to ./frontend...");

  console.log('Running from working directory: ' + process.cwd());

  var sharedConfig = loadSharedConfig();
  exportSharedConfigToFrontEnd(sharedConfig);

  // Only export one abi where the different contracts share the same interface
  // await updateAbiFromDeployedContractAddress("<contract name>", <contract address>>);

  // ABI for contracts that have not been deployed.
  console.log("Exporting Contract ABI")
  await updateAbiFromBuildArtifacts("Options", "SimpleOption");
  await updateAbiFromBuildArtifacts("Options", "SimplePutOption");
  await updateAbiFromBuildArtifacts("Deals", "FXDeal");
  await updateAbiFromBuildArtifacts("DataFeeder", "EquityPrice");
  await updateAbiFromBuildArtifacts("DataFeeder", "FXPrice");
  await updateAbiFromBuildArtifacts("Mint", "EscrowCurrenyAccount");
  await updateAbiFromBuildArtifacts("StableAsset", "ERC20CNYStableCoin");
  await updateAbiFromBuildArtifacts("StableAsset", "ERC20EURStableCoin");
  await updateAbiFromBuildArtifacts("StableAsset", "ERC20USDStableCoin");
  await updateAbiFromBuildArtifacts("StableAsset", "ERC20AppleStableShare");
  console.log("Update ./frontend/constants/index.js if you have added new contracts");
}

/* Export ABI to front end where from given address of a deployed contract
*/
async function updateAbiFromDeployedContractAddress(contractName, contractAddress) {
  try {
    const deployedContract = await ethers.getContractAt(
      contractName,
      contractAddress
    );
    fs.writeFileSync(
      `${frontEndAbiLocation}${contractName}.json`,
      deployedContract.interface.format(ethers.utils.FormatTypes.json)
    );
    console.log(`Exported ABI for [${contractName}] at deployed address [${contractAddress}]`)
  } catch (err) {
    console.log(`Failed to export ABI for ${contractName} with error [${err}]`);
  }
}

/* Export ABI file to front end, where ABI is given in JSON format
*/
async function updateAbiFromBuildArtifacts(contractGroup, contractName) {
  try {
    const contractFile = `./artifacts/contracts/${contractGroup}/${contractName}.sol/${contractName}.json`;
    let jsonData = JSON.parse(fs.readFileSync(contractFile, 'utf-8'));
    const iface = new ethers.utils.Interface(jsonData.abi);
    fs.writeFileSync(
      `${frontEndAbiLocation}${contractName}.json`,
      iface.format(ethers.utils.FormatTypes.json));
    console.log(`Exported ABI for [${contractFile}]`);
  } catch (err) {
    console.log(`Failed to export ABI for ${contractName} with error [${err}]`);
  }
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
  console.log(`\nStarted Export ABI\n`);
  console.error(error);
  process.exitCode = 1;
  console.log(`\nDone Export ABI\n`);
});
