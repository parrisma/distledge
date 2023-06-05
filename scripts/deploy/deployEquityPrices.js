const { signedValue } = require("../lib/signedValue.js");
const { equityPriceDecimals,
    teslaPriceFeb2023,
    teslaTicker,
    teslaDescription,
    applePriceFeb2023,
    appleTicker,
    appleDescription
} = require("@deploy/testConstants.js");

/**
 * Deploy a secure off chain price
 * @param {*} hre Hardhat runtime environment
 * @param {Address} price_issuer The Signer account to use to issue level
 * @param {Address} secure_source The Signer account to use to maintain the level
 * @param {string} ticker The Equity price ticker symbol
 * @param {string} description The Equity price description
 * @param {int} decimals The number of decimal places the equity is priced to
 * @param {float} initial_value The initial value to set the equity price to
 * @returns {Address} Of the contracts deployed for the given level.
 */
async function deployEquityPrice(hre, price_issuer, secure_source, ticker, description, decimals, initial_value) {

    // Deploy Library
    const VerifySignerLib = await hre.ethers.getContractFactory("VerifySigner");
    const verifySignerLib = await VerifySignerLib.deploy();
    await verifySignerLib.deployed();

    const EquityPrice = await hre.ethers.getContractFactory("EquityPrice", {
        libraries: {
            VerifySigner: verifySignerLib.address,
        },
    });

    const equityPriceContract = await EquityPrice.connect(price_issuer).deploy(ticker, description, secure_source.address, decimals);
    const { value, nonce, sig } = await signedValue(hre, secure_source, initial_value);
    await equityPriceContract.connect(secure_source).setVerifiedValue(value, nonce, hre.ethers.utils.arrayify(sig));

    return [equityPriceContract]

}

/**
 * Deploy a test set of Equity prices.
 * @param {json} sharedConfig JSON Object in while all shared config is held
 * @param {*} hre Hardhat runtime environment
 * @param {Address} price_issuer The Signer account to use to issue level
 * @param {Address} secure_source The Signer account to use to maintain the level
 * @returns {Address} Addresses of the deployed equity price contracts
 */
async function deployEquityPrices(sharedConfig, hre, price_issuer, secure_source) {

    console.log("\nCreate Equity Price contracts");

    const [teslaEquityPriceContract] = await deployEquityPrice(hre, price_issuer, secure_source, teslaTicker, teslaDescription, equityPriceDecimals, teslaPriceFeb2023);
    console.log(`Equity price feed created with ticker ${await teslaEquityPriceContract.getTicker()} with initial price ${Number(await teslaEquityPriceContract.getVerifiedValue()) / (10 ** await teslaEquityPriceContract.getDecimals())} at address ${teslaEquityPriceContract.address}`);

    const [appleEquityPriceContract] = await deployEquityPrice(hre, price_issuer, secure_source, appleTicker, appleDescription, equityPriceDecimals, applePriceFeb2023);
    console.log(`Equity price feed created with ticker ${await appleEquityPriceContract.getTicker()} with initial price ${Number(await appleEquityPriceContract.getVerifiedValue()) / (10 ** await appleEquityPriceContract.getDecimals())} at address ${appleEquityPriceContract.address}`);

    sharedConfig.teslaEquityPriceContract = teslaEquityPriceContract.address;

    sharedConfig.appleEquityPriceContract = appleEquityPriceContract.address;

    return [teslaEquityPriceContract, appleEquityPriceContract]
}

/**
 * 
 * @param {json} sharedConfig JSON Object in while all shared config is held
 * @returns The equity price contracts loaded from the shared config details.
 */
async function loadEquityPricesFromAddresses(sharedConfig) {
    const teslaEquityPriceContract = await hre.ethers.getContractAt("EquityPrice", sharedConfig.teslaEquityPriceContract);
    const appleEquityPriceContract = await hre.ethers.getContractAt("EquityPrice", sharedConfig.appleEquityPriceContract);
    return [teslaEquityPriceContract, appleEquityPriceContract]
}

module.exports = {
    deployEquityPrices,
    loadEquityPricesFromAddresses
}