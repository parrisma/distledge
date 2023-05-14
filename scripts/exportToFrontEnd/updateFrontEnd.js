const { ethers } = require("hardhat");
const fs = require("fs");
const { frontEndAbiLocation } = require("../../helper-hardhat-config");
const { loadSharedConfig } = require("../lib/sharedConfig.js");

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
  await exportAbiAndBytecodeFromBuildArtifacts("Options", "SimpleOption");
  await exportAbiAndBytecodeFromBuildArtifacts("Options", "SimplePutOption");
  await exportAbiAndBytecodeFromBuildArtifacts("Deals", "FXDeal");
  await exportAbiAndBytecodeFromBuildArtifacts("DataFeeder", "EquityPrice");
  await exportAbiAndBytecodeFromBuildArtifacts("DataFeeder", "FXPrice");
  await exportAbiAndBytecodeFromBuildArtifacts("Mint", "EscrowCurrenyAccount");
  await exportAbiAndBytecodeFromBuildArtifacts("StableAsset", "ERC20CNYStableCoin");
  await exportAbiAndBytecodeFromBuildArtifacts("StableAsset", "ERC20EURStableCoin");
  await exportAbiAndBytecodeFromBuildArtifacts("StableAsset", "ERC20USDStableCoin");
  await exportAbiAndBytecodeFromBuildArtifacts("StableAsset", "ERC20AppleStableShare");
  await exportAbiAndBytecodeFromBuildArtifacts("HelloWorld", "HelloWorld");
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

/* Export ABI & Bytecode file to front end, by taking latest builds from project artifacts
*/
async function exportAbiAndBytecodeFromBuildArtifacts(contractGroup, contractName) {
  try {
    const contractFile = `./artifacts/contracts/${contractGroup}/${contractName}.sol/${contractName}.json`;
    let jsonData = JSON.parse(fs.readFileSync(contractFile, 'utf-8'));
    const iface = new ethers.utils.Interface(jsonData.abi);
    fs.writeFileSync(
      `${frontEndAbiLocation}${contractName}.json`,
      iface.format(ethers.utils.FormatTypes.json));
    console.log(`Exported ABI for [${contractFile}]`);
    fs.writeFileSync(
      `${frontEndAbiLocation}${contractName}-bytecode.json`,
      `{"bytecode":"${jsonData.bytecode}"}`);
    console.log(`Exported Bytecode for [${contractFile}]`);
  } catch (err) {
    console.log(`Failed to export for ${contractName} with error [${err}]`);
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
  console.error(error);
  process.exitCode = 1;
});
