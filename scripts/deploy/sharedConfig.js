var fs = require('fs');

/** 
   * We need to export all of the contract addresses to so other test modules can 
   * interact with them. As teh contracts are deployed they will populate the members.
   * 
   * After all contracts are deployed, this will be written out as a file.
  */

var sharedConfig = {
    usdStableCoin: "",
    eurStableCoin: "",
    cnyStableCoin: "",
    usdEscrowAccount: "",
    eurEscrowAccount: "",
    cnyEscrowAccount: "",
    teslaEquityPriceContract: "",
    UsdEurFXRateContract: "",
    UsdCnyFXRateContract: ""
};

const sharedConfigFileName = "./scripts/tmp/sharedConfig.json";

/**
 * Delete any existing shared config file if it exists
 */
function cleanUpSharedConfig() {
    fs.stat(sharedConfigFileName, function (err, stats) {
        if (!err) {
            fs.unlink(sharedConfigFileName, function (err) {
                if (err) return console.log(err);
                console.log('old shared config deleted successfully');
            });
        }
    });
}

/**
 * Write the current state of thw sharedConfig to file.
 */
function writeSharedConfig() {
    fs.writeFile(sharedConfigFileName, JSON.stringify(sharedConfig), function (err) {
        if (err) throw err;
        console.log('Shared config saved OK');
    });
}

/**
 * Load the shared config if it exists
 * @returns {json} The configuration that was loaded.
 */
function loadSharedConfig() {
    var config;
    try {
        config = JSON.parse(fs.readFileSync(sharedConfigFileName));
        console.log('Shared config loaded successfully');

    } catch (err) {
        console.log('Shared config file not found [' + sharedConfigFileName + "]");
    }

    return config;
}

module.exports = {
    sharedConfig,
    cleanUpSharedConfig,
    writeSharedConfig,
    loadSharedConfig
}