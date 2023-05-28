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

    console.log(`Opt: [${JSON.stringify(optionTermsAsJson, null, 2)}]`);
    var optionToValueAsJson = formatOptionTermsMessage(optionTermsAsJson, `value`);
    const rawResponse = await fetch(`${NFTServerBaseURI()}`, {
        mode: 'no-cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET'
        },
        body: JSON.stringify(optionToValueAsJson)
    });
    console.log(`RAW RESP 1`);
    var res = undefined;
    try {
        console.log(`RAW RESP 2`);
        const resTxt = await rawResponse.text();
        console.log(`Res Txt : [${resTxt}]`);
        res = JSON.parse(resTxt);
    } catch (err) {
        console.log(`RAW RESP 3`);
        console.log(`Get JSON Err [${err.message}`);
    }
    console.log(`RAW RESP 4`);
    return res;
}
