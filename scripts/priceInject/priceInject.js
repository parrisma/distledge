/**
 * This script loops forever and injects random price and FX rate moves to simulate
 * changing market conditions.
 * 
 * The addresses of the deployed price contracts are passed in after they have been deployed
 * by scripts\deploy\deploy.js
 */
const hre = require("hardhat");
const { namedAccounts } = require("../lib/accounts.js");
const { loadEquityPricesFromAddresses } = require("../deploy/deployEquityPrices.js");
const { loadFXRatesFromAddresses } = require("../deploy/deployFXRates.js");
const { loadSharedConfig } = require("../lib/sharedConfig.js");
const { signedValue } = require("../lib/signedValue.js");
const timeout = 10000;

/**
 * Add a +/- a random amount to the given price.
 * @param {float} price The price to adjust
 * @param {float} factor The factor to multiply the random adjustment by
 * @param {int} minVal The minimum value the adjusted price can have
 * @returns The adjusted price.
 */
function randomWalkPrice(price, factor, minVal) {
    var randomChange = Math.floor(Math.random() * factor);
    if (Math.random() > 0.5) {
        randomChange = Number(randomChange * -1.0);
    }
    return Math.max(minVal, Number(price) + randomChange);
}

/**
 * An endless timer loop that adds random adjustments to the equity and Fx prices to 
 * simulate market activity.
 * 
 * @param {*} hre Hardhat runtime environment
 * @param {address} data_vendor The account that owns the prices & fx with permission to change them
 * @param {contract} teslaEquityPriceContract The tesla (equity) price contract
 * @param {contract} appleEquityPriceContract The apple (equity) price contract
 * @param {contract} UsdEurFXRateContract The FX rate contract for Usd Eur
 * @param {contract} UsdCnyFXRateContract The FX rate contract for Usd Cny
 */
async function updatePrices(hre,
    data_vendor,
    teslaEquityPriceContract,
    appleEquityPriceContract,
    UsdEurFXRateContract,
    UsdCnyFXRateContract) {

    var teslaPrice = randomWalkPrice(await teslaEquityPriceContract.getVerifiedValue(), 5 * (10 ** await teslaEquityPriceContract.getDecimals()), (10 ** await teslaEquityPriceContract.getDecimals()));
    var { value, nonce, sig } = await signedValue(hre, data_vendor, teslaPrice);
    await teslaEquityPriceContract.connect(data_vendor).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
    console.log("Price update for [" + await teslaEquityPriceContract.getTicker() + "] with price: [" + await teslaEquityPriceContract.getVerifiedValue() / (10 ** await teslaEquityPriceContract.getDecimals()) + "]");

    var applePrice = randomWalkPrice(await appleEquityPriceContract.getVerifiedValue(), 5 * (10 ** await appleEquityPriceContract.getDecimals()), (10 ** await appleEquityPriceContract.getDecimals()));
    var { value, nonce, sig } = await signedValue(hre, data_vendor, applePrice);
    await appleEquityPriceContract.connect(data_vendor).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
    console.log("Price update for [" + await appleEquityPriceContract.getTicker() + "] with price: [" + await appleEquityPriceContract.getVerifiedValue() / (10 ** await appleEquityPriceContract.getDecimals()) + "]");

    var UsdEurFXRate = randomWalkPrice(await UsdEurFXRateContract.getVerifiedValue(), 2 * (10 ** await UsdEurFXRateContract.getDecimals()), (10 ** await UsdCnyFXRateContract.getDecimals()));
    var { value, nonce, sig } = await signedValue(hre, data_vendor, UsdEurFXRate);
    await UsdEurFXRateContract.connect(data_vendor).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
    console.log("FX Rate update for [" + await UsdEurFXRateContract.getTicker() + "] with price: [" + await UsdEurFXRateContract.getVerifiedValue() / (10 ** await UsdEurFXRateContract.getDecimals()) + "]");

    var UsdCnyFXRate = randomWalkPrice(await UsdCnyFXRateContract.getVerifiedValue(), 5 * (10 ** await UsdCnyFXRateContract.getDecimals()), (10 ** await UsdCnyFXRateContract.getDecimals()));
    var { value, nonce, sig } = await signedValue(hre, data_vendor, UsdCnyFXRate);
    await UsdCnyFXRateContract.connect(data_vendor).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
    console.log("FX Rate update for [" + await UsdCnyFXRateContract.getTicker() + "] with price: [" + await UsdCnyFXRateContract.getVerifiedValue() / (10 ** await UsdCnyFXRateContract.getDecimals()) + "]");

    console.log("--");
    // Re-set the timer, so we run forever or until user interrupt Ctrl+C
    await setTimeout(async function () { await updatePrices(hre, data_vendor, teslaEquityPriceContract, appleEquityPriceContract, UsdEurFXRateContract, UsdCnyFXRateContract); }, timeout);
}

async function main() {

    console.log(`\n========================================\n`);
    console.log(`        P R I C E   I N J E C T O R`);
    console.log(`\n========================================\n`);

    /**
     * Get and allocate account roles on the network
     */
    var sharedConfig = loadSharedConfig();
    [escrow_manager, stable_coin_issuer, data_vendor, option_seller, option_buyer] = await namedAccounts(sharedConfig);

    console.log(`\nAccount Addresses`);
    console.log(`Manager            : [${escrow_manager.address}]`);
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
    var appleEquityPriceContract;

    try {
        [teslaEquityPriceContract, appleEquityPriceContract] = await loadEquityPricesFromAddresses(sharedConfig);
        console.log("Price contract loaded with ticker: " + await teslaEquityPriceContract.getTicker() + " and price [" + await teslaEquityPriceContract.getVerifiedValue() + "]");
        console.log("Price contract loaded with ticker: " + await appleEquityPriceContract.getTicker() + " and price [" + await appleEquityPriceContract.getVerifiedValue() + "]");

    } catch (err) {
        console.log('\nError Loading Equity contract instance [' + err + "]");
    }


    var UsdEurFXRateContract;
    var UsdCnyFXRateContract;
    try {
        var [UsdEurFXRateContract, UsdCnyFXRateContract] = await loadFXRatesFromAddresses(sharedConfig);
        console.log("\nFX contract loaded with ticker: " + await UsdEurFXRateContract.getTicker());
        console.log("FX contract loaded with ticker: " + await UsdCnyFXRateContract.getTicker());
    } catch (err) {
        console.log('\nError Loading FX contract instance [' + err + "]");
    }

    /**
     * Do while, forever making random price updates every 1 second
     * 
     * We are in a forever loop as updatePrices() just re-launches the timer after doing the price update
     */
    console.log("\nStarting price & FX rate updates\n");
    await setTimeout(async function () {
        await updatePrices(hre,
            data_vendor,
            teslaEquityPriceContract,
            appleEquityPriceContract,
            UsdEurFXRateContract,
            UsdCnyFXRateContract);
    }, timeout);
}

main().catch((error) => {
    console.log(`\nStarted Price Injector\n`);
    console.error(error);
    process.exitCode = 1;
    console.log(`\nDone Price Injector\n`);
});
