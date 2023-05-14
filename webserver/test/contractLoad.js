require('module-alias/register'); // npm i --save module-alias
const hre = require("hardhat");
const { addressConfig } = require("@webserver/constants");
const {
    ERC20USDStableCoin,
    ERC20EURStableCoin,
    ERC20CNYStableCoin,
    ERC20AppleStableShare,
    ERC20TeslaStableShare,
    ERC721OptionContractTypeOneABI
} = require("@webserver/constants");

/**
 * Deploy option of given terms
 */
async function getDictionaryOfDeployedContracts(addrConf) {
    var contracts = {}; // Empty Dictionary
    try {
        contracts[addrConf.usdStableCoin] = await hre.ethers.getContractAt(ERC20USDStableCoin, addrConf.usdStableCoin);
        console.log(`Got Contract for ${await (contracts[addrConf.usdStableCoin].name())}`);
        contracts[addrConf.eurStableCoin] = await hre.ethers.getContractAt(ERC20EURStableCoin, addrConf.eurStableCoin);
        console.log(`Got Contract for ${await (contracts[addrConf.eurStableCoin].name())}`);
        contracts[addrConf.cnyStableCoin] = await hre.ethers.getContractAt(ERC20CNYStableCoin, addrConf.cnyStableCoin);
        console.log(`Got Contract for ${await (contracts[addrConf.cnyStableCoin].name())}`);

        contracts[addrConf.teslaEquityPriceContract] = await hre.ethers.getContractAt("EquityPrice", addrConf.teslaEquityPriceContract);
        console.log(`Got Contract for ${await (contracts[addrConf.teslaEquityPriceContract].getTicker())}`);
        contracts[addrConf.appleEquityPriceContract] = await hre.ethers.getContractAt("EquityPrice", addrConf.appleEquityPriceContract);
        console.log(`Got Contract for ${await (contracts[addrConf.appleEquityPriceContract].getTicker())}`);

        contracts[addrConf.UsdEurFXRateContract] = await hre.ethers.getContractAt("FXPrice", addrConf.UsdEurFXRateContract);
        console.log(`Got Contract for ${await (contracts[addrConf.UsdEurFXRateContract].getTicker())}`);
        contracts[addrConf.UsdCnyFXRateContract] = await hre.ethers.getContractAt("FXPrice", addrConf.UsdCnyFXRateContract);
        console.log(`Got Contract for ${await (contracts[addrConf.UsdCnyFXRateContract].getTicker())}`);
        contracts[addrConf.UsdUsdFXRateContract] = await hre.ethers.getContractAt("FXPrice", addrConf.UsdUsdFXRateContract);
        console.log(`Got Contract for ${await (contracts[addrConf.UsdUsdFXRateContract].getTicker())}`);
        contracts[addrConf.EurEurFXRateContract] = await hre.ethers.getContractAt("FXPrice", addrConf.EurEurFXRateContract);
        console.log(`Got Contract for ${await (contracts[addrConf.EurEurFXRateContract].getTicker())}`);
        contracts[addrConf.CnyCnyFXRateContract] = await hre.ethers.getContractAt("FXPrice", addrConf.CnyCnyFXRateContract);
        console.log(`Got Contract for ${await (contracts[addrConf.CnyCnyFXRateContract].getTicker())}`);

        contracts[addrConf.erc721OptionContractTypeOne] = await hre.ethers.getContractAt(ERC721OptionContractTypeOneABI, addrConf.erc721OptionContractTypeOne);
        console.log(`Got Contract for ${await (contracts[addrConf.erc721OptionContractTypeOne].name())}`);


    } catch (err) {
        throw new Error(`Failed to create contract dictionary with error [${err.message}]`);
    }

    return contracts;
}

async function main() {
    const contractDict = await getDictionaryOfDeployedContracts(addressConfig);
    for (const [key, value] of Object.entries(contractDict)) {
        console.log(key);
        //console.log(await value.name());
    }
}

/**
 * The main processing loop and error handling.
 */
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});