/*
** npx hardhat run contractLoad.js --network localhost
*/
require('module-alias/register'); // npm i --save module-alias
const { getDictionaryOfDeployedContracts } = require("@lib/deployedContracts");
const { addressConfig } = require("@webserver/constants");
const { namedAccounts } = require("@scripts/lib/accounts");
const { getSignedHashOfOptionTerms } = require("@scripts/lib/signedValue");
const { guid } = require("@lib/guid");

function onMintNTFHandler1(args) {
    console.log(`Args1: [${args}]`);
}

function onMintNTFHandler2(args) {
    console.log(`Args2: [${args}]`);
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

/**
 * The main processing loop and error handling.
 */
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});