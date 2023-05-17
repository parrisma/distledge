/*
** npx hardhat run contractLoad.js --network localhost
*/
require('module-alias/register'); // npm i --save module-alias
const { getDictionaryOfDeployedContracts } = require("@lib/deployedContracts");
const { addressConfig } = require("@webserver/constants");
const { namedAccounts } = require("@scripts/lib/accounts");
const { getSignedHashOfOptionTerms } = require("@scripts/lib/signedValue");
const { guid } = require("@lib/guid");

var responses = {};

function onMintNTFHandler1(args) {
    console.log(`Args1: [${args}]`);
}

function onMintNTFHandler2(args) {
    console.log(`Args2: [${args}]`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForReceipt(txHash) {
    let i = 1;
    while (true) {
        let receipt = web3.eth.getTransactionReceipt(txHash);
        if (receipt) {
            break;
        }
        console.log(`Waiting: ${i} [${txHash}]`);
        i = i + 1;
        await sleep(250);
    }
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
    if (false) {
        try {
            erc721OptionContractTypeOne = contractDict[addressConfig.erc721OptionContractTypeOne];

            erc721OptionContractTypeOne.on("OptionMinted", onMintNTFHandler1); // Attach multiple emit handlers for same event
            erc721OptionContractTypeOne.on("OptionMinted", onMintNTFHandler2);

            /* Mint 10 contracts, for which we expect both handlers to be called Async.
            */
            for (let i = 0; i < 10; i++) {
                sig = await getSignedHashOfOptionTerms(guid(), managerAccount);
                erc721OptionContractTypeOne.connect(managerAccount).mintOption(sig);
            }
        } catch (err) {
            throw new Error(`Failed to test mint an Option Type One NFT - with error :[${err.message}]`);
        }
    }

    try {
        erc721OptionContractTypeOne_2 = contractDict[addressConfig.erc721OptionContractTypeOne];
        // erc721OptionContractTypeOne_2.on("OptionMinted", onMintNTFHandler1); // Attach multiple emit handlers for same event

        /* Mint 10 contracts, for which we sync wait
        */
        for (let i = 0; i < 10; i++) {
            sig = await getSignedHashOfOptionTerms(guid(), managerAccount);
            erc721OptionContractTypeOne_2.connect(managerAccount).mintOption(sig).then((args) => {
                console.log(`Args3: [${JSON.stringify(args)}]`);
                console.log(`Receipt: [${JSON.stringify(waitForReceipt(args.hash))}]`);
            })
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