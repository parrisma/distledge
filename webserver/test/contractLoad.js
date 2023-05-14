require('module-alias/register'); // npm i --save module-alias
const hre = require("hardhat");
const { addressConfig } = require("@webserver/constants");
const {
    ERC20USDStableCoin,
    ERC20EURStableCoin,
    ERC20CNYStableCoin,
    ERC20AppleStableShare,
    ERC20TeslaStableShare
} = require("@webserver/constants");

/**
 * Deploy option of given terms
 */
async function getDeployedContractDictionary(addrConf) {
    var contracts = {}; // Empty Dictionary
    try {
        contracts[addrConf.usdStableCoin] = await hre.ethers.getContractAt(ERC20USDStableCoin, addrConf.usdStableCoin);
        contracts[addrConf.eurStableCoin] = await hre.ethers.getContractAt(ERC20EURStableCoin, addrConf.eurStableCoin);
        contracts[addrConf.cnyStableCoin] = await hre.ethers.getContractAt(ERC20CNYStableCoin, addrConf.cnyStableCoin);

        contracts[addrConf.teslaEquityPriceContract] = await hre.ethers.getContractAt(ERC20TeslaStableShare, addrConf.teslaEquityPriceContract);
        contracts[addrConf.appleEquityPriceContract] = await hre.ethers.getContractAt(ERC20AppleStableShare, addrConf.appleEquityPriceContract);

        //contracts[addrConf.UsdEurFXRateContract] = await hre.ethers.getContractAt( addrConf.UsdEurFXRateContract);
        //contracts[addrConf.UsdCnyFXRateContract] = await hre.ethers.getContractAt( addrConf.UsdCnyFXRateContract);
        //contracts[addrConf.UsdUsdFXRateContract] = await hre.ethers.getContractAt( addrConf.UsdUsdFXRateContract);
        //contracts[addrConf.EurEurFXRateContract] = await hre.ethers.getContractAt( addrConf.EurEurFXRateContract);
        //contracts[addrConf.CnyCnyFXRateContract] = await hre.ethers.getContractAt( addrConf.CnyCnyFXRateContract);

    } catch (err) {
        throw new Error(`Failed to create contract dictionary with error [${err.message}]`);
    }

    return contracts;
}

async function main() {
    const contractDict = await getDeployedContractDictionary(addressConfig);
    for (const [key, value] of Object.entries(contractDict)) {
        console.log(await value.name());
    }
}

/**
 * The main processing loop and error handling.
 */
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});