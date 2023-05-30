/**
 * Return a list of all reference levels
 */
export function getAllLevels(loadedSharedConfig) {
    return [loadedSharedConfig.teslaEquityPriceContract,
    loadedSharedConfig.appleEquityPriceContract];
}

/**
 * Return a list of all stable coins
 */
export function getAllCoins(loadedSharedConfig) {
    return [loadedSharedConfig.usdStableCoin,
    loadedSharedConfig.eurStableCoin,
    loadedSharedConfig.cnyStableCoin];
}

/**
 * Return a list of all FX Levels.
 */
export function getAllFX(loadedSharedConfig) {
    return [loadedSharedConfig.UsdCnyFXRateContract,
    loadedSharedConfig.UsdUsdFXRateContract,
    loadedSharedConfig.UsdCnyFXRateContract,
    loadedSharedConfig.CnyCnyFXRateContract,
    loadedSharedConfig.UsdEurFXRateContract,
    loadedSharedConfig.EurEurFXRateContract
    ];
}