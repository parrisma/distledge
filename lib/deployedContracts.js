require('module-alias/register'); // npm i --save module-alias
const hre = require("hardhat");

const {
    ERC20USDStableCoin,
    ERC20EURStableCoin,
    ERC20CNYStableCoin,
    ERC20AppleStableShare,
    ERC20TeslaStableShare,
    ERC721OptionContractTypeOneABI
} = require("@webserver/constants");

/**
 * Create a dictionary of all deployed contracts by contract address, where value is the deployed contract that can
 */
async function getDictionaryOfDeployedContracts(addrConf) {
    var contracts = {}; // Empty Dictionary
    try {
        contracts[addrConf.usdStableCoin] = await hre.ethers.getContractAt(ERC20USDStableCoin, addrConf.usdStableCoin);
        console.log(`Got Contract for ${await (contracts[addrConf.usdStableCoin].name())} @ [${addrConf.usdStableCoin}]`);
        contracts[addrConf.eurStableCoin] = await hre.ethers.getContractAt(ERC20EURStableCoin, addrConf.eurStableCoin);
        console.log(`Got Contract for ${await (contracts[addrConf.eurStableCoin].name())} @ [${addrConf.eurStableCoin}]`);
        contracts[addrConf.cnyStableCoin] = await hre.ethers.getContractAt(ERC20CNYStableCoin, addrConf.cnyStableCoin);
        console.log(`Got Contract for ${await (contracts[addrConf.cnyStableCoin].name())} @ [${addrConf.cnyStableCoin}]`);

        contracts[addrConf.appleStableShare] = await hre.ethers.getContractAt(ERC20AppleStableShare, addrConf.appleStableShare);
        console.log(`Got Contract for ${await (contracts[addrConf.appleStableShare].name())} @ [${addrConf.appleStableShare}]`);
        contracts[addrConf.teslaStableShare] = await hre.ethers.getContractAt(ERC20TeslaStableShare, addrConf.teslaStableShare);
        console.log(`Got Contract for ${await (contracts[addrConf.teslaStableShare].name())} @ [${addrConf.teslaStableShare}]`);

        contracts[addrConf.teslaEquityPriceContract] = await hre.ethers.getContractAt("EquityPrice", addrConf.teslaEquityPriceContract);
        console.log(`Got Contract for ${await (contracts[addrConf.teslaEquityPriceContract].getTicker())} @ [${addrConf.teslaEquityPriceContract}]`);
        contracts[addrConf.appleEquityPriceContract] = await hre.ethers.getContractAt("EquityPrice", addrConf.appleEquityPriceContract);
        console.log(`Got Contract for ${await (contracts[addrConf.appleEquityPriceContract].getTicker())} @ [${addrConf.appleEquityPriceContract}]`);

        contracts[addrConf.UsdEurFXRateContract] = await hre.ethers.getContractAt("FXPrice", addrConf.UsdEurFXRateContract);
        console.log(`Got Contract for ${await (contracts[addrConf.UsdEurFXRateContract].getTicker())} @ [${addrConf.UsdEurFXRateContract}]`);
        contracts[addrConf.UsdCnyFXRateContract] = await hre.ethers.getContractAt("FXPrice", addrConf.UsdCnyFXRateContract);
        console.log(`Got Contract for ${await (contracts[addrConf.UsdCnyFXRateContract].getTicker())} @ [${addrConf.UsdCnyFXRateContract}]`);

        contracts[addrConf.UsdUsdFXRateContract] = await hre.ethers.getContractAt("FXPrice", addrConf.UsdUsdFXRateContract);
        console.log(`Got Contract for ${await (contracts[addrConf.UsdUsdFXRateContract].getTicker())} @ [${addrConf.UsdUsdFXRateContract}]`);
        contracts[addrConf.EurEurFXRateContract] = await hre.ethers.getContractAt("FXPrice", addrConf.EurEurFXRateContract);
        console.log(`Got Contract for ${await (contracts[addrConf.EurEurFXRateContract].getTicker())} @ [${addrConf.EurEurFXRateContract}]`);
        contracts[addrConf.CnyCnyFXRateContract] = await hre.ethers.getContractAt("FXPrice", addrConf.CnyCnyFXRateContract);
        console.log(`Got Contract for ${await (contracts[addrConf.CnyCnyFXRateContract].getTicker())} @ [${addrConf.CnyCnyFXRateContract}]`);

        contracts[addrConf.UsdTeslaFXRateContract] = await hre.ethers.getContractAt("FXPrice", addrConf.UsdTeslaFXRateContract);
        console.log(`Got Contract for ${await (contracts[addrConf.UsdTeslaFXRateContract].getTicker())} @ [${addrConf.UsdTeslaFXRateContract}]`);
        contracts[addrConf.UsdAppleFXRateContract] = await hre.ethers.getContractAt("FXPrice", addrConf.UsdAppleFXRateContract);
        console.log(`Got Contract for ${await (contracts[addrConf.UsdAppleFXRateContract].getTicker())} @ [${addrConf.UsdAppleFXRateContract}]`);

        contracts[addrConf.erc721OptionContractTypeOne] = await hre.ethers.getContractAt(ERC721OptionContractTypeOneABI, addrConf.erc721OptionContractTypeOne);
        console.log(`Got Contract for ${await (contracts[addrConf.erc721OptionContractTypeOne].name())} @ [${addrConf.erc721OptionContractTypeOne}]`);
    } catch (err) {
        throw new Error(`Failed to create contract dictionary with error [${err.message}]`);
    }

    return contracts;
}


module.exports = {
    getDictionaryOfDeployedContracts
}
