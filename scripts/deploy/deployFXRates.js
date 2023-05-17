const { signedValue } = require("@scripts/lib/signedValue.js");
const { fxRateDecimals,
    USD_to_EUR,
    USD_to_CNY,
    USD_to_USD,
    EUR_to_EUR,
    CNY_to_CNY,
    USDEUR_ticker,
    USDEUR_Description,
    USDCNY_ticker,
    USDCNY_Description,
    USDUSD_ticker,
    USDUSD_Description,
    EUREUR_ticker,
    EUREUR_Description,
    CNYCNY_ticker,
    CNYCNY_Description } = require("@deploy/testConstants.js");

/**
 * Deploy a secure off chain FXRate
 * @param {json} sharedConfig JSON Object in while all shared config is held
 * @param {*} hre Hardhat runtime environment
 * @param {Address} price_issuer The Signer account to use to issue level
 * @param {Address} secure_source The Signer account to use to maintain the level
 * @param {string} ticker The Rate price ticker symbol
 * @param {string} description The Rate price description
 * @param {int} decimals The number of decimal places the rate is priced to
 * @param {float} initial_value The initial value to set the rate price to
 * @returns {Address} Of the contracts deployed for the given level.
 */
async function deployFXRate(hre, price_issuer, secure_source, ticker, description, decimals, initial_value) {

    // Deploy Library
    const VerifySignerLib = await hre.ethers.getContractFactory("VerifySigner");
    const verifySignerLib = await VerifySignerLib.deploy();
    await verifySignerLib.deployed();

    const FXRate = await ethers.getContractFactory("FXPrice", {
        libraries: {
            VerifySigner: verifySignerLib.address,
        },
    });

    const fxRateContract = await FXRate.connect(price_issuer).deploy(ticker, description, secure_source.address, decimals);
    const { value, nonce, sig } = await signedValue(hre, secure_source, initial_value);
    await fxRateContract.connect(secure_source).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));

    return [fxRateContract]

}

/**
 * Deploy a test set of FX Rates.
 * @param {json} sharedConfig JSON Object in while all shared config is held
 * @param {*} hre Hardhat runtime environment
 * @param {Address} price_issuer The Signer account to use to issue level
 * @param {Address} secure_source The Signer account to use to maintain the level
 * @returns {Address} Addresses of the deployed equity price contracts
 */
async function deployFXRates(sharedConfig, hre, price_issuer, secure_source) {

    console.log("\nCreate FX Rate contracts");

    const [UsdEurFXRateContract] = await deployFXRate(hre, price_issuer, secure_source, USDEUR_ticker, USDEUR_Description, fxRateDecimals, USD_to_EUR * (10 ** fxRateDecimals));
    console.log("FX Rate feed created with ticker " + await UsdEurFXRateContract.getTicker() + " with initial price " + Number(await UsdEurFXRateContract.getVerifiedValue()) / (10 ** await UsdEurFXRateContract.getDecimals()));

    const [UsdCnyFXRateContract] = await deployFXRate(hre, price_issuer, secure_source, USDCNY_ticker, USDCNY_Description, fxRateDecimals, USD_to_CNY * (10 ** fxRateDecimals));
    console.log("FX Rate feed created with ticker " + await UsdCnyFXRateContract.getTicker() + " with initial price " + Number(await UsdCnyFXRateContract.getVerifiedValue()) / (10 ** await UsdCnyFXRateContract.getDecimals()));

    const [UsdUsdFXRateContract] = await deployFXRate(hre, price_issuer, secure_source, USDUSD_ticker, USDUSD_Description, fxRateDecimals, USD_to_USD * (10 ** fxRateDecimals));
    console.log("FX Rate feed created with ticker " + await UsdUsdFXRateContract.getTicker() + " with initial price " + Number(await UsdUsdFXRateContract.getVerifiedValue()) / (10 ** await UsdUsdFXRateContract.getDecimals()));

    const [EurEurFXRateContract] = await deployFXRate(hre, price_issuer, secure_source, EUREUR_ticker, EUREUR_Description, fxRateDecimals, EUR_to_EUR * (10 ** fxRateDecimals));
    console.log("FX Rate feed created with ticker " + await EurEurFXRateContract.getTicker() + " with initial price " + Number(await EurEurFXRateContract.getVerifiedValue()) / (10 ** await EurEurFXRateContract.getDecimals()));

    const [CnyCnyFXRateContract] = await deployFXRate(hre, price_issuer, secure_source, CNYCNY_ticker, CNYCNY_Description, fxRateDecimals, CNY_to_CNY * (10 ** fxRateDecimals));
    console.log("FX Rate feed created with ticker " + await CnyCnyFXRateContract.getTicker() + " with initial price " + Number(await CnyCnyFXRateContract.getVerifiedValue()) / (10 ** await CnyCnyFXRateContract.getDecimals()));

    sharedConfig.UsdEurFXRateContract = UsdEurFXRateContract.address;
    sharedConfig.UsdCnyFXRateContract = UsdCnyFXRateContract.address;
    sharedConfig.UsdUsdFXRateContract = UsdUsdFXRateContract.address;
    sharedConfig.EurEurFXRateContract = EurEurFXRateContract.address;
    sharedConfig.CnyCnyFXRateContract = CnyCnyFXRateContract.address;

    return [UsdEurFXRateContract, UsdCnyFXRateContract, UsdUsdFXRateContract, EurEurFXRateContract, CnyCnyFXRateContract]
}

/**
 * 
 * @param {json} sharedConfig JSON Object in while all shared config is held
 * @returns The FX rate contracts loaded from the shared config details.
 */
async function loadFXRatesFromAddresses(sharedConfig) {
    const UsdEurFXRateContract = await hre.ethers.getContractAt("FXPrice", sharedConfig.UsdEurFXRateContract);
    const UsdCnyFXRateContract = await hre.ethers.getContractAt("FXPrice", sharedConfig.UsdCnyFXRateContract);
    return [UsdEurFXRateContract, UsdCnyFXRateContract]
}

module.exports = {
    deployFXRates,
    loadFXRatesFromAddresses
}