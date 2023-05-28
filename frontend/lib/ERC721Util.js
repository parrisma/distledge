/*
** npx hardhat run serverTest.js --network localhost
*/
const { serverConfig } = require("../lib/serverConfig");
const { formatOptionTermsMessage } = require("../lib/optionTermsUtil");


async function fetchAsync(uri) {
    let response = await fetch(uri);
    let data = await response.json();
    return data;
}

function NFTServerBaseURI() {
    return `http://localhost:${serverConfig.port}`;
}

/**
 * Request a list of existing options from the option NFT Server
*/
export async function getERC721MintedOptionList() {
    var resAsJson;
    try {
        resAsJson = JSON.stringify(await fetchAsync(`${NFTServerBaseURI()}/list`), null, 2);
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

    var optionToValueAsJson = formatOptionTermsMessage(optionTermsAsJson, `value`);
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