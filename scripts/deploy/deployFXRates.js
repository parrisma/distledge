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
    CNYCNY_Description,
    USDTesla_ticker,
    USDTesla_Description,
    USDApple_ticker,
    USDApple_Description,
    Physical_ticker,
    Physical_Description,
    teslaPriceFeb2023,
    applePriceFeb2023, } = require("@deploy/testConstants.js");

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
    console.log(`FX Rate feed created with ticker ${await UsdEurFXRateContract.getTicker()} with initial price ${Number(await UsdEurFXRateContract.getVerifiedValue()) / (10 ** await UsdEurFXRateContract.getDecimals())} @ ${UsdEurFXRateContract.address}`);

    const [UsdCnyFXRateContract] = await deployFXRate(hre, price_issuer, secure_source, USDCNY_ticker, USDCNY_Description, fxRateDecimals, USD_to_CNY * (10 ** fxRateDecimals));
    console.log(`FX Rate feed created with ticker ${await UsdCnyFXRateContract.getTicker()} with initial price ${Number(await UsdCnyFXRateContract.getVerifiedValue()) / (10 ** await UsdCnyFXRateContract.getDecimals())} @ ${UsdCnyFXRateContract.address}`);

    const [UsdUsdFXRateContract] = await deployFXRate(hre, price_issuer, secure_source, USDUSD_ticker, USDUSD_Description, 0, USD_to_USD);
    console.log(`FX Rate feed created with ticker ${await UsdUsdFXRateContract.getTicker()} with initial price ${Number(await UsdUsdFXRateContract.getVerifiedValue()) / (10 ** await UsdUsdFXRateContract.getDecimals())} @ ${UsdUsdFXRateContract.address}`);

    const [EurEurFXRateContract] = await deployFXRate(hre, price_issuer, secure_source, EUREUR_ticker, EUREUR_Description, 0, EUR_to_EUR);
    console.log(`FX Rate feed created with ticker ${await EurEurFXRateContract.getTicker()} with initial price ${Number(await EurEurFXRateContract.getVerifiedValue()) / (10 ** await EurEurFXRateContract.getDecimals())} @ ${EurEurFXRateContract.address}`);

    const [CnyCnyFXRateContract] = await deployFXRate(hre, price_issuer, secure_source, CNYCNY_ticker, CNYCNY_Description, 0, CNY_to_CNY);
    console.log(`FX Rate feed created with ticker ${await CnyCnyFXRateContract.getTicker()} with initial price ${Number(await CnyCnyFXRateContract.getVerifiedValue()) / (10 ** await CnyCnyFXRateContract.getDecimals())} @ ${CnyCnyFXRateContract.address}`);

    const [PhysicalFXRateContract] = await deployFXRate(hre, price_issuer, secure_source, Physical_ticker, Physical_Description, 0, Number(1));
    console.log(`FX Rate feed created with ticker ${await PhysicalFXRateContract.getTicker()} with initial price ${Number(await PhysicalFXRateContract.getVerifiedValue()) / (10 ** await PhysicalFXRateContract.getDecimals())} @ ${PhysicalFXRateContract.address}`);

    const r1 = Math.floor(Number(1 / (teslaPriceFeb2023 / 100)) * (10 ** fxRateDecimals));
    const [UsdTeslaFXRateContract] = await deployFXRate(hre, price_issuer, secure_source, USDTesla_ticker, USDTesla_Description, fxRateDecimals, r1);
    console.log(`FX Rate feed created with ticker ${await UsdTeslaFXRateContract.getTicker()} with initial price ${Number(r1)} @ ${UsdTeslaFXRateContract.address}`);

    const r2 = Math.floor(Number(1 / (applePriceFeb2023 / 100)) * (10 ** fxRateDecimals));
    const [UsdAppleFXRateContract] = await deployFXRate(hre, price_issuer, secure_source, USDApple_ticker, USDApple_Description, fxRateDecimals, r2);
    console.log(`FX Rate feed created with ticker ${await UsdAppleFXRateContract.getTicker()} with initial price ${Number(r2)} @ ${UsdAppleFXRateContract.address}`);


    sharedConfig.UsdEurFXRateContract = UsdEurFXRateContract.address;
    sharedConfig.UsdCnyFXRateContract = UsdCnyFXRateContract.address;
    sharedConfig.UsdUsdFXRateContract = UsdUsdFXRateContract.address;
    sharedConfig.EurEurFXRateContract = EurEurFXRateContract.address;
    sharedConfig.CnyCnyFXRateContract = CnyCnyFXRateContract.address;
    sharedConfig.UsdTeslaFXRateContract = UsdTeslaFXRateContract.address;
    sharedConfig.UsdAppleFXRateContract = UsdAppleFXRateContract.address;
    sharedConfig.PhysicalFXRateContract = PhysicalFXRateContract.address;

    return [UsdEurFXRateContract,
        UsdCnyFXRateContract,
        UsdUsdFXRateContract,
        EurEurFXRateContract,
        CnyCnyFXRateContract,
        PhysicalFXRateContract,
        UsdTeslaFXRateContract,
        UsdAppleFXRateContract]
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