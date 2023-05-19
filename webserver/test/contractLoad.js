/*
** npx hardhat run contractLoad.js --network localhost
*/
require('module-alias/register'); // npm i --save module-alias
const { getDictionaryOfDeployedContracts } = require("@lib/deployedContracts");
const { addressConfig } = require("@webserver/constants");
const { namedAccounts } = require("@scripts/lib/accounts");
const { getSignedHashOfOptionTerms } = require("@scripts/lib/signedValue");
const { guid } = require("@lib/guid");

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
        let erc721OptionContractTypeOne_2 = contractDict[addressConfig.erc721OptionContractTypeOne];
        for (let i = 0; i < 100; i++) {
            sig = await getSignedHashOfOptionTerms(guid(), managerAccount);
            const txResponse = await erc721OptionContractTypeOne_2.mintOption(sig);
            const txReceipt = await txResponse.wait();
            var response = undefined;
            for (var j = 0; j < txReceipt.events.length; j++) {
                const e = txReceipt.events[j];
                console.log(`Event [${JSON.stringify(e["event"])}]`);
                if (e["event"] === "OptionMinted") {
                    response = e["args"];
                    console.log(`MintOption Response [${response}]`);
                }
            }
            if (null === response) {
                throw new Error(`Missing expected response from mintOption`);
            }
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