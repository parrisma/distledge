/**
 * Shared test data and constants
 */

// Initial Equities values
const equityPriceDecimals = 2;
const teslaPriceFeb2023 = 20831; // $208.31
const teslaTicker = "TSLA";
const teslaDescription = "TESLA Regular Stock"
const applePriceFeb2023 = 16968; // $169.68
const appleTicker = "AAPL";
const appleDescription = "APPLE Regular Stock"
const appleIssue = 10000; // Number of share to issue in Escrow
const teslaIssue = 10000; // Number of share to issue in Escrow

// Initial FX Rates
const fxRateDecimals = 5;
const USD_to_EUR = 0.93;
const EUR_to_USD = 1.0 / USD_to_EUR;
const USD_to_CNY = 6.87;
const CNY_to_USD = 1.0 / USD_to_CNY;
const USD_to_USD = 1.0;
const EUR_to_EUR = 1.0;
const CNY_to_CNY = 1.0;


const USDEUR_ticker = "USDEUR";
const USDEUR_Description = "USD to EUR Spot FX Rate"
const USDCNY_ticker = "USDCNY";
const USDCNY_Description = "USD to CNY Spot FX Rate"
const USDUSD_ticker = "USDUSD";
const USDUSD_Description = "USD to USD Fixed Rate"
const EUREUR_ticker = "EUREUR";
const EUREUR_Description = "EUR to EUR Fixed Rate"
const CNYCNY_ticker = "CNYCNY";
const CNYCNY_Description = "CNY to CNY Fixed Rate"
const Physical_ticker = "Physical";
const Physical_Description = "Physical Fixed Rate"

// Opening Deposits from cash to token
const depositQtyUSD = 10000 * (10 ** equityPriceDecimals); // 100.00 USD to 2 DP
const depositQtyEUR = depositQtyUSD * USD_to_EUR;
const depositQtyCNY = depositQtyUSD * USD_to_CNY;

module.exports = {
    USD_to_EUR,
    EUR_to_USD,
    USD_to_CNY,
    CNY_to_USD,
    USD_to_USD,
    EUR_to_EUR,
    CNY_to_CNY,
    depositQtyUSD,
    depositQtyCNY,
    depositQtyEUR,
    fxRateDecimals,
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
    equityPriceDecimals,
    teslaPriceFeb2023,
    teslaTicker,
    teslaDescription,
    applePriceFeb2023,
    appleTicker,
    appleDescription,
    appleIssue,
    teslaIssue,
    Physical_ticker,
    Physical_Description
}