/*
** npx hardhat run contractLoad.js --network localhost
*/
require('module-alias/register'); // npm i --save module-alias
const { getDictionaryOfDeployedContracts } = require("@lib/deployedContracts");
const { addressConfig } = require("@webserver/constants");
const { namedAccounts } = require("@scripts/lib/accounts");
const { getSignedHashOfOptionTerms } = require("@scripts/lib/signedValue");
const { guid } = require("@lib/guid");

var emittedEvents = {};

/**
 * Store the emitted event such that it can be retrieved
 * 
 * @param {*} arg1 - The emitted event response data as defined by the individual event
 * @param {*} arg2 - The full chain response event, that also contains the event response data
 */
function onEmittedEventHandler1(arg1, arg2) {
    console.log(`Emitted Event Received: [${JSON.stringify(arg2)}]`);
    emittedEvents[arg2.transactionHash] = arg2;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Return a promise that will deliver the emitted event for the given transaction id
 * 
 * @param {*} txHash - The transaction has to get the emitted event for.
 * @returns a promise that will deliver the matching emitted event or throw a timeout exception
 * 
 */
async function getEmittedEventFromTransaction(txHash) {
    return new Promise(async (resolve) => {
        const waitTime = 250;
        const maxTry = 10;
        let i = 1;
        while (true) {
            console.log(`Checking for emitted event, try # [${i}] for transaction [${txHash}]`);
            if (txHash in emittedEvents) {
                resolve(emittedEvents[txHash]);
            }
            i = i + 1;
            if (i >= maxTry) {
                throw new Error(`Timed out waiting for receipt for transaction [${txHash}]`);
            }
            await sleep(waitTime);
        }
    });
}

async function main() {

    const [managerAccount] = await namedAccounts(addressConfig);

    const contractDict = await getDictionaryOfDeployedContracts(addressConfig);

    console.log(`List of loaded contracts`)
    for (const [key, value] of Object.entries(contractDict)) {
        console.log(key);
    }

    /** Test ERC721 mint.
    */
    try {
        erc721OptionContractTypeOne_2 = contractDict[addressConfig.erc721OptionContractTypeOne];
        erc721OptionContractTypeOne_2.on("OptionMinted", onEmittedEventHandler1);

        /* Mint 10 contracts, for which we sync wait
        */
        for (let i = 0; i < 1; i++) {
            sig = await getSignedHashOfOptionTerms(guid(), managerAccount);
            erc721OptionContractTypeOne_2.connect(managerAccount).mintOption(sig).then((args) => {
                console.log(`Args3-1: [${JSON.stringify(args)}]`);
                getEmittedEventFromTransaction(args.hash).then((emittedEvent) => {
                    console.log(`Rx emitted event [${JSON.stringify(emittedEvent)}]`)
                }).catch((error) => {
                    console.log(`Failed getting emitted event [${error}]`);
                });
            });
        }
    } catch (err) {
        throw new Error(`Failed to test mint an Option Type One NFT - with error :[${err.message}]`);
    }
}

/**
 * The main processing loop and error handling.
 */
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});