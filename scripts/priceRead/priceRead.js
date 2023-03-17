/**
 * This script loops forever and reading the price and FX rate moves. These moves are simulated
 * by the scripts\priceInject\priceInject.js script. However it must be running so the price updates
 * continue.
 * 
 * The addresses of the deployed price contracts are passed in after they have been deployed
 * by scripts\deploy\deploy.js
 */
const hre = require("hardhat");
const { namedAccounts } = require("../deploy/accounts.js");
const { loadEquityPricesFromAddresses } = require("../deploy/deployEquityPrices.js");
const { loadFXRatesFromAddresses } = require("../deploy/deployFXRates.js");
const { loadSharedConfig, sharedConfig } = require("../deploy/sharedConfig.js");
const { signedValue } = require("../deploy/signedValue.js");
const timeout = 1000;

/**
 * An endless timer loop that reads and shows the prices and FX rates.
 * 
 * @param {*} hre Hardhat runtime environment
 * @param {address} data_vendor The account that owns the prices & fx with permission to change them
 * @param {contract} teslaEquityPriceContract The tesla (equity) price contract
 * @param {contract} UsdEurFXRateContract The FX rate contract for Usd Eur
 * @param {contract} UsdCnyFXRateContract The FX rate contract for Usd Cny
 */
async function readPrices(hre,
    data_vendor,
    teslaEquityPriceContract,
    UsdEurFXRateContract,
    UsdCnyFXRateContract) {

    console.log("Latest Price for [" + await teslaEquityPriceContract.getTicker() + "] with price: [" + await teslaEquityPriceContract.getVerifiedValue() / (10 ** await teslaEquityPriceContract.getDecimals()) + "]");
    console.log("Latest FX Rate update for [" + await UsdEurFXRateContract.getTicker() + "] with price: [" + await UsdEurFXRateContract.getVerifiedValue() / (10 ** await UsdEurFXRateContract.getDecimals()) + "]");
    console.log("Latest FX Rate update for [" + await UsdCnyFXRateContract.getTicker() + "] with price: [" + await UsdCnyFXRateContract.getVerifiedValue() / (10 ** await UsdCnyFXRateContract.getDecimals()) + "]");
    
    console.log("--");
    // Re-set the timer, so we run forever or until user interrupt Ctrl+C
    await setTimeout(async function () { await readPrices(hre, data_vendor, teslaEquityPriceContract, UsdEurFXRateContract, UsdCnyFXRateContract); }, timeout);
}

async function main() {

    console.log(`\n========================================\n`);
    console.log(`        P R I C E   R E A D E R`);
    console.log(`\n========================================\n`);

    /**
     * Get and allocate account roles on the network
     */
    [escrow_manager, stable_coin_issuer, data_vendor, option_seller, option_buyer] = await namedAccounts();

    console.log(`\nAccount Addresses`);
    console.log(`Escrow Manager     : [${escrow_manager.address}]`);
    console.log(`Stable Coin Issuer : [${stable_coin_issuer.address}]`);
    console.log(`Data Vendor        : [${data_vendor.address}]`);
    console.log(`Option Seller      : [${option_seller.address}]`);
    console.log(`Option Buyer       : [${option_buyer.address}]`);

    /**
     * Load shared configuration that was generated by scripts/deploy/deploy.js
     * This file must be re-created every time the hardhat node is restarted
     * the contract life is only while the hardhat (test) network is running
     */
    console.log("\nLoading instances of already deployed price and FX contracts\n");
    var teslaEquityPriceContract;
    var sharedConfig = loadSharedConfig();
    try {
        [teslaEquityPriceContract] = await loadEquityPricesFromAddresses(sharedConfig);
        console.log("Price contract loaded with ticker: " + await teslaEquityPriceContract.getTicker() + " and price [" + await teslaEquityPriceContract.getVerifiedValue() + "]");
    } catch (err) {
        console.log('\nError Loading Tesla contract instance [' + err + "]");
    }

    var UsdEurFXRateContract;
    var UsdCnyFXRateContract;
    try {
        var [UsdEurFXRateContract, UsdCnyFXRateContract] = await loadFXRatesFromAddresses(sharedConfig);
        console.log("\nFX contract loaded with ticker: " + await UsdEurFXRateContract.getTicker());
        console.log("FX contract loaded with ticker: " + await UsdCnyFXRateContract.getTicker());
    } catch (err) {
        console.log('\nError Loading Tesla contract instance [' + err + "]");
    }

    /**
     * Do while, forever reading price updates every 1 second
     * 
     * We are in a forever loop as readPrices() just re-launches the timer after doing the price update
     */
    console.log("\nStarting price & FX rate reads\n");
    await setTimeout(async function () {
        await readPrices(hre,
            data_vendor,
            teslaEquityPriceContract,
            UsdEurFXRateContract,
            UsdCnyFXRateContract);
    }, timeout);
}

// Use this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.log(`\nStarted Price Reader\n`);
    console.error(error);
    process.exitCode = 1;
    console.log(`\nDone Price Reader\n`);
});