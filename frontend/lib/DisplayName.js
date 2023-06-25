import { addressConfig } from "@/constants";
import { DisplayMap } from "@/constants";

const addrMap = [
    { k: `${addressConfig.usdStableCoin}`, v: getDisplayName(`usdStableCoin`) },
    { k: `${addressConfig.eurStableCoin}`, v: getDisplayName(`eurStableCoin`) },
    { k: `${addressConfig.cnyStableCoin}`, v: getDisplayName(`cnyStableCoin`) },
    { k: `${addressConfig.usdEscrowAccount}`, v: getDisplayName(`usdEscrowAccount`) },
    { k: `${addressConfig.eurEscrowAccount}`, v: getDisplayName(`eurEscrowAccount`) },
    { k: `${addressConfig.cnyEscrowAccount}`, v: getDisplayName(`cnyEscrowAccount`) },
    { k: `${addressConfig.appleEscrowAccount}`, v: getDisplayName(`appleEscrowAccount`) },
    { k: `${addressConfig.teslaEscrowAccount}`, v: getDisplayName(`teslaEscrowAccount`) },
    { k: `${addressConfig.teslaEquityPriceContract}`, v: getDisplayName(`teslaEquityPriceContract`) },
    { k: `${addressConfig.appleEquityPriceContract}`, v: getDisplayName(`appleEquityPriceContract`) },
    { k: `${addressConfig.UsdEurFXRateContract}`, v: getDisplayName(`UsdEurFXRateContract`) },
    { k: `${addressConfig.UsdCnyFXRateContract}`, v: getDisplayName(`UsdCnyFXRateContract`) },
    { k: `${addressConfig.UsdUsdFXRateContract}`, v: getDisplayName(`UsdUsdFXRateContract`) },
    { k: `${addressConfig.EurEurFXRateContract}`, v: getDisplayName(`EurEurFXRateContract`) },
    { k: `${addressConfig.CnyCnyFXRateContract}`, v: getDisplayName(`CnyCnyFXRateContract`) },
    { k: `${addressConfig.UsdTeslaFXRateContract}`, v: getDisplayName(`UsdTeslaFXRateContract`) },
    { k: `${addressConfig.UsdAppleFXRateContract}`, v: getDisplayName(`UsdAppleFXRateContract`) },
    { k: `${addressConfig.PhysicalFXRateContract}`, v: getDisplayName(`PhysicalFXRateContract`) },
    { k: `${addressConfig.erc721OptionContractTypeOne}`, v: getDisplayName(`erc721OptionContractTypeOne`) },
    { k: `${addressConfig.appleStableShare}`, v: getDisplayName(`appleStableShare`) },
    { k: `${addressConfig.teslaStableShare}`, v: getDisplayName(`teslaStableShare`) }];

/* 
** Look in the DisplayMap and return the alternate display name for the given name.
** If there is no matching name, just return the given name
*/
export function getDisplayName(nameToMapToDisplayName) {
    var displayName = nameToMapToDisplayName;
    DisplayMap.map.forEach((value) => {
        if (value.rawName === nameToMapToDisplayName) {
            displayName = value.displayName;
        }
    });
    return displayName;
}

export function getAddressName(addressToMap) {
    var displayName = `?: ${addressToMap}`
    addrMap.forEach((value) => {
        if (value.k === addressToMap) {
            displayName = value.v;
        }
    });
    return displayName;
}


