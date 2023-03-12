/**
 * Shared test data and constants
 */

// Initial Equities values
const equityPriceDecimals = 2;
const teslaPriceFeb2023 = 20831; // $208.31
const teslaTicker = "TSLA";
const teslaDescription = "TESLA Regular Stock"

// Initial FX Rates
const fxRateDecimals = 5;
const USD_to_EUR = 0.93;
const EUR_to_USD = 1.0 / USD_to_EUR;
const USD_to_CNY = 6.87;
const CNY_to_USD = 1.0 / USD_to_CNY;

const USDEUR_ticker = "USDEUR";
const USDEUR_Description = "USD to EUR Spot FX Rate"
const USDCNY_ticker = "USDCNY";
const USDCNY_Description = "USD to CNY Spot FX Rate"

// Opening Deposits from cash to token
const depositQtyUSD = 100 * (10 ** equityPriceDecimals); // 100.00 USD to 2 DP
const depositQtyEUR = depositQtyUSD * USD_to_EUR;
const depositQtyCNY = depositQtyUSD * USD_to_CNY;

module.exports = {
    USD_to_EUR,
    EUR_to_USD,
    USD_to_CNY,
    CNY_to_USD,
    depositQtyUSD,
    depositQtyCNY,
    depositQtyEUR,
    fxRateDecimals,
    USDEUR_ticker,
    USDEUR_Description,
    USDCNY_ticker,
    USDCNY_Description,
    equityPriceDecimals,
    teslaPriceFeb2023,
    teslaTicker,
    teslaDescription
}