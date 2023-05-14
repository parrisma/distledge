var fs = require('fs');
var path = require('path');

/** 
   * We need to export all of the contract addresses to so other test modules can 
   * interact with them. As teh contracts are deployed they will populate the members.
   * 
   * After all contracts are deployed, this will be written out as a file.
  */

var sharedConfig = {
    escrowAccount: { accountName: `Escrow`, accountAddress: ``, usd: 0, eur: 0, cny: 0 },
    tokenAccount: { accountName: 'Token', accountAddress: ``, usd: 0, eur: 0, cny: 0 },
    dataAccount: { accountName: 'Data', accountAddress: ``, usd: 0, eur: 0, cny: 0 },
    sellerAccount: { accountName: `Seller`, accountAddress: ``, usd: 1000, eur: 900, cny: 7000 },
    buyerAccount: { accountName: `Buyer`, accountAddress: ``, usd: 1000, eur: 900, cny: 7000 },
    usdStableCoin: "",
    eurStableCoin: "",
    cnyStableCoin: "",
    usdEscrowAccount: "",
    eurEscrowAccount: "",
    cnyEscrowAccount: "",
    teslaEquityPriceContract: "",
    appleEquityPriceContract: "",
    UsdEurFXRateContract: "",
    UsdCnyFXRateContract: "",
    UsdUsdFXRateContract: "",
    EurEurFXRateContract: "",
    CnyCnyFXRateContract: "",
    erc721OptionContractTypeOne: ""
};

const configRoot = "./scripts/tmp";
const sharedConfigFileName = "sharedConfig.json";

function getConfigFileName(root) {
    var cfgFileName = null;
    if (null == root || 0 == `${root}`.length) {
        cfgFileName = path.join(configRoot, sharedConfigFileName);
    } else {
        cfgFileName = path.join(root, sharedConfigFileName);
    }
    return cfgFileName;
}

/**
 * Return a list of all reference levels
 */
function getAllLevels(loadedSharedConfig) {
    return [loadedSharedConfig.teslaEquityPriceContract,
    loadedSharedConfig.appleEquityPriceContract];
}

/**
 * Return a list of all stable coins
 */
function getAllCoins(loadedSharedConfig) {
    return [loadedSharedConfig.usdStableCoin,
    loadedSharedConfig.eurStableCoin,
    loadedSharedConfig.cnyStableCoin];
}

/**
 * Return a list of all FX Levels.
 */
function getAllFX(loadedSharedConfig) {
    return [loadedSharedConfig.UsdCnyFXRateContract,
    loadedSharedConfig.UsdUsdFXRateContract,
    loadedSharedConfig.UsdCnyFXRateContract,
    loadedSharedConfig.CnyCnyFXRateContract,
    loadedSharedConfig.UsdEurFXRateContract,
    loadedSharedConfig.EurEurFXRateContract
    ];
}

/**
 * Delete any existing shared config file if it exists
 */
function cleanUpSharedConfig() {
    fs.stat(getConfigFileName(), function (err, stats) {
        if (!err) {
            fs.unlink(getConfigFileName(), function (err) {
                if (err) return console.log(err);
                console.log('old shared config deleted successfully');
            });
        }
    });
}

/**
 * Write the current state of the sharedConfig to file.
 */
function writeSharedConfig() {
    fs.writeFile(getConfigFileName(), JSON.stringify(sharedConfig), function (err) {
        if (err) throw err;
        console.log('Shared config saved OK');
    });
}

/**
 * Load the shared config if it exists
 * @returns {json} The configuration that was loaded.
 */
function loadSharedConfig(configRoot) {
    var config;
    try {
        config = JSON.parse(fs.readFileSync(getConfigFileName(configRoot)));
        console.log('Shared config loaded successfully');

    } catch (err) {
        console.log('Shared config file not found [' + getConfigFileName(configRoot) + "]");
    }
    console.log(`Config: [${config}]`);
    return config;
}

module.exports = {
    sharedConfig,
    cleanUpSharedConfig,
    writeSharedConfig,
    loadSharedConfig,
    getAllCoins,
    getAllFX,
    getAllLevels
}