/*
** npx hardhat run serverTest.js --network localhost
*/
require('module-alias/register'); // npm i --save module-alias
const { addressConfig } = require("@webserver/constants");
const { getAllCoins, getAllFX, getAllLevels } = require("@scripts/lib/sharedConfig");
const { namedAccounts } = require("@scripts/lib/accounts");
const { getSignedHashOfOptionTerms } = require("@scripts/lib/signedValue");
const { formatOptionTermsMessage } = require("@scripts/lib/optionTermsUtil");
const { guid } = require("@lib/guid");
const { sleep } = require("@lib/generalUtil");
const { randomWords, randomSentence } = require("@lib/randomWord");
const { formatOptionTypeOneTerms } = require("@lib/SimpleOptionTypeOne");
const { verifyTerms } = require("@webserver/utility");

async function fetchAsync(uri) {
    let response = await fetch(uri);
    let data = await response.json();
    return data;
}

function NFTServerBaseURI() {
    return "http://localhost:8191";
}

/* Request a list of existing options from the option NFT Server
*/
async function getOptionList() {
    var resAsJson;
    try {
        resAsJson = JSON.stringify(await fetchAsync(`${NFTServerBaseURI()}/list`), null, 2);
    } catch (err) {
        resAsJson = { "error": `${err.message}` }
    }
    return resAsJson;
}

/**
 *  Request purge of all existing terms
*/
async function requestPurgeAllTerms() {
    var resAsJson;
    try {
        resAsJson = JSON.stringify(await fetchAsync(`${NFTServerBaseURI()}/purge`), null, 2);
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
async function getOptionById(optionId) {
    var resAsJson;
    try {
        resAsJson = JSON.stringify(await fetchAsync(`${NFTServerBaseURI()}/${optionId}`), null, 2);
    } catch (err) {
        resAsJson = { "error": `${err.message}` }
    }
    return resAsJson;
}

/**
 * Persist the given option terms
 * (Note: nopt option details are passed as the option terms are generated randomly)
 * 
 * @param {*} optionId - The Option Id 
 * @param {*} signedByAccount - The manager account to process the terms.
 * @returns 
 */
async function persistOption(
    optionId,
    signedByAccount) {

    const stableCoins = getAllCoins(addressConfig);
    const fxRates = getAllFX(addressConfig);
    const levels = getAllLevels(addressConfig);


    var optionAsJson = formatOptionTypeOneTerms(
        guid(),
        `Option name - ${randomWords()}`,
        `${randomSentence()}`,
        signedByAccount.address,
        Math.floor(Math.random() * 100),
        stableCoins[Math.floor(Math.random() * stableCoins.length)],
        stableCoins[Math.floor(Math.random() * stableCoins.length)],
        Math.floor(Math.random() * 1000),
        Math.floor(Math.random() * 200),
        levels[Math.floor(Math.random() * levels.length)],
        fxRates[Math.floor(Math.random() * fxRates.length)],
    );
    const signature = await getSignedHashOfOptionTerms(JSON.stringify(optionAsJson), signedByAccount);

    var optionToPersistAsJson = formatOptionTermsMessage(
        optionId,
        optionAsJson,
        signature,
        signedByAccount.address);

    const rawResponse = await fetch(`${NFTServerBaseURI()}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(optionToPersistAsJson)
    });
    const res = await rawResponse.json();
    return res;
}

/**
 * The main test loop.
 * 
 * 1. Purge any existing terms
 * 2. Create [n] random option terms
 * 3. Get a list of all option terms & verify it is the same as number sen
 * 4. Get each option in turn and make sure the signatures are the same as when saved.
 * 
 */
async function main() {

    const numOptionsToCreate = 1;
    console.log(`\nUsing these SharedConfig settings :\n ${JSON.stringify(addressConfig, null, 2)}`);

    // Purge any existing contracts
    resp = await requestPurgeAllTerms()
    if (resp.hasOwnProperty("error")) {
        throw new Error(`Failed to purge terms ${resp.error}`);
    }
    console.log(`\nRequest Purge     :\n${resp}\n`);

    // Mint & Persist the prescribed number of new (random) contracts
    const [managerAccount, stableCoinIssuer, dataVendor, optionSeller, optionBuyer] = await namedAccounts(addressConfig);
    for (let step = 0; step < numOptionsToCreate; step++) {
        respJson = await persistOption(step, optionBuyer);
        if (respJson.hasOwnProperty("errorCode")) {
            console.log(JSON.stringify(respJson, null, 2));
            throw new Error(`Failed to persist/mint Option terms as NFT ${resp.error}`);
        }
        console.log(JSON.stringify(resp, null, 2));
    }
    await sleep(1000);

    // Get a full list
    resp = await getOptionList();
    if (resp.hasOwnProperty("error")) {
        throw new Error(`Failed to purge terms ${resp.error}`);
    }
    respJson = JSON.parse(resp);
    var arrayOfExistingOptionNFTs = undefined;
    const numListed = Number(Object.keys(respJson.message.terms).length);
    if (0 != numListed - numOptionsToCreate) {
        throw new Error(`List Options returned ${numListed} expected ${numOptionsToCreate}`);
    } else {
        console.log(`List terms expected matches actual for number of returned options [${numOptionsToCreate}]`);
        arrayOfExistingOptionNFTs = respJson.message.terms;
    }
    console.log(`\nGet List     :\n${resp}\n`);
    await sleep(1000);

    // Iterate the List of returned Options and verify
    for (let step = 0; step < arrayOfExistingOptionNFTs.length; step++) {
        const optionIdToCheck = arrayOfExistingOptionNFTs[step].optionId;
        resp = await getOptionById(optionIdToCheck);
        respJson = JSON.parse(resp);
        if (respJson.hasOwnProperty("errorCode")) {
            console.log(JSON.stringify(respJson, null, 2));
            throw new Error(`Failed to pull option id [${optionIdToCheck}] with error ${respJson.errorMessage}`);
        }
        if (!await verifyTerms(respJson.message, optionBuyer, managerAccount)) {
            throw new Error("Failed to verify option terms were immutable and signed by both buyer and manager");
        } else {
            console.log(`Terms Verified for Option Id [${optionIdToCheck}]`);
        }
        console.log(`Pulled Option ${optionIdToCheck} : ${respJson.message.terms.optionName}`);
    }
}

/**
 * The main processing loop and error handling.
 */
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});