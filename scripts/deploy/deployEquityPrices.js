const { signedValue } = require("./signedValue.js");
const { equityPriceDecimals,
    teslaPriceFeb2023,
    teslaTicker,
    teslaDescription } = require("./testConstants.js");

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
    console.log("Equity price feed created with ticker " + await teslaEquityPriceContract.getTicker() + " with initial price " + Number(await teslaEquityPriceContract.getVerifiedValue()) / (10 ** await teslaEquityPriceContract.getDecimals()));

    sharedConfig.teslaEquityPriceContract = teslaEquityPriceContract.address;

    return [teslaEquityPriceContract]
}

/**
 * 
 * @param {json} sharedConfig JSON Object in while all shared config is held
 * @returns The equity price contracts loaded from the shared config details.
 */
async function loadEquityPricesFromAddresses(sharedConfig) {
    const teslaEquityPriceContract = await hre.ethers.getContractAt("EquityPrice", sharedConfig.teslaEquityPriceContract);      
    return [teslaEquityPriceContract]
}

module.exports = {
    deployEquityPrices,
    loadEquityPricesFromAddresses
}