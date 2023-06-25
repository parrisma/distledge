/*
** npx hardhat run serverTest.js --network localhost
*/
const { serverConfig } = require("../lib/serverConfig");
const { formatOptionTermsMessage } = require("../lib/optionTermsUtil");
const { addressConfig } = require("../constants");
const { getAllTokens, getAllFX, getAllLevels } = require("./DeployedContracts"); // out of Front end, would need to be deployed/packaged

async function fetchAsync(uri) {
    let response = await fetch(uri);
    let data = await response.json();
    return data;
}

export function NFTServerBaseURI() {
    return `http://localhost:${serverConfig.port}`;
}

/**
 * Get a list of existing options from the option NFT Server, that are owned
 * by the given account
 * 
 * @param {*} owningAccount - The account that options should be owned by to be reported.
 * @returns A list if options owned by the given account.
 */
export async function getERC721MintedOptionList(owningAccount) {
    var resAsJson;
    try {
        var resAsJson = await fetchAsync(`${NFTServerBaseURI()}/list`);
        const res = resAsJson.message.terms.filter((value, i) => {
            const a = value.ownerAddress.toUpperCase();
            const b = owningAccount.toUpperCase();
            return a === b;
        });
        resAsJson.message.terms = res;
    } catch (err) {
        resAsJson = { "error": `${err.message}` }
    }
    return resAsJson;
}

/**
 * Request the terms of a specific option by Id
 * @param {*} optionId - Recover the given option id from storage
 * @returns Option terms as Json object
 */
export async function getOptionById(optionId) {
    var resAsJson;
    try {
        resAsJson = await fetchAsync(`${NFTServerBaseURI()}/${optionId}`);
    } catch (err) {
        resAsJson = { "error": `${err.message}` }
    }
    return resAsJson;
}

/**
 * Request the value of a specific option by Id
 * @param {*} optionId - Value the given option id from storage
 * @returns Option valuation as Json object
 */
export async function valueOptionById(optionId) {
    var resAsJson;
    try {
        resAsJson = await fetchAsync(`${NFTServerBaseURI()}/value/${optionId}`);
    } catch (err) {
        resAsJson = { "error": `${err.message}` }
    }
    return resAsJson;
}

/**
 * Value option by post request, this does not require the option to have been minted & persisted
 * as we pass the full option terms. This allows us to do option valuation as primary pricing
 * rather than secondary pricing.
 * 
 * @returns valuation 
 */
export async function valueOptionByPOSTRequest(optionTermsAsJson) {

    var optionToValueAsJson = formatOptionTermsMessage(optionTermsAsJson, 'value');
    const rawResponse = await fetch(`${NFTServerBaseURI()}`, {
        method: 'POST',
        body: JSON.stringify(optionToValueAsJson)
    });
    var res = undefined;
    try {
        res = await rawResponse.json();
    } catch (err) {
        const errMsg = `valueOptionByPOSTRequest failed with Err [${err.message}`;
        console.log(errMsg);
        res = { "errorMessage": errMsg };
    }
    return res;
}

/**
 * An empty/zero valuation response structure
 * @returns A JSON object for an zero/empty POST valuation response.
 */
export function emptyValuationResponse() {
    return {
        "value": "0",
        "parameters": {
            "notional": "0",
            "strike": "0",
            "referenceLevel": "0"
        }
    };
}

/**
 * Return True if given terms are valid for a Type One NFT Option
 * @param {*} optionTermsAsJson 
 * @returns [True + OK Message] or [False + Error Message]
 */
export function OptionTypeOneTermsAreValid(optionTermsAsJson) {
    try {
        console.log(`Terms: [${JSON.stringify(optionTermsAsJson, null, 4)}]`);
        const stableAssets = getAllTokens(addressConfig);
        const fxRates = getAllFX(addressConfig);
        const levels = getAllLevels(addressConfig);

        if (0 == String(optionTermsAsJson.uniqueId).length) {
            return [false, `Must supply uniqueId`];
        }
        if (0 === String(optionTermsAsJson.optionName).length) {
            return [false, `Must supply option name`];
        }
        if (0 === String(optionTermsAsJson.premium).length || Number(optionTermsAsJson.premium) < 0) {
            return [false, `Option premium must be greater than zero, but given [${premium}]`];
        }
        if (0 === String(optionTermsAsJson.notional).length || Number(optionTermsAsJson.notional) < 0) {
            return [false, `Notional must be greater than zero, but given [${notional}]`];
        }
        if (0 === String(optionTermsAsJson.strike).length || Number(optionTermsAsJson.strike) < 0) {
            return [false, `Strike must be greater than zero, but given [${strike}]`];
        }
        if (!stableAssets.includes(optionTermsAsJson.premiumToken)) {
            return [false, `Premium token address [${optionTermsAsJson.premiumToken}] is not a valid stable asset contract address`]
        }
        if (!stableAssets.includes(optionTermsAsJson.settlementToken)) {
            return [false, `Settlement token address [${optionTermsAsJson.settlementToken}] is not a valid stable coin contract address`]
        }
        if (!fxRates.includes(optionTermsAsJson.fxReferenceLevel)) {
            return [false, `FX Rate address [${optionTermsAsJson.fxReferenceLevel}] is not a valid FX contract address`]
        }
        if (!levels.includes(optionTermsAsJson.referenceLevel)) {
            return [false, `Reference Level address [${optionTermsAsJson.referenceLevel}] is not a valid reference level contract address`]
        }
    } catch (err) {
        return [false, `Failed to validate option type one details with error [${err.message}]`];
    }
    return [true, `Option Terms all Ok`];
}