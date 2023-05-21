/*
** npx hardhat run contractLoad.js --network localhost
*/
require('module-alias/register'); // npm i --save module-alias
const { getDictionaryOfDeployedContracts } = require("@lib/deployedContracts");
const { addressConfig } = require("@webserver/constants");
const { namedAccounts } = require("@scripts/lib/accounts");
const { guid } = require("@lib/guid");
const { mintERC721OptionNFT } = require("@lib/contracts/Options/ERC721OptionContractTypeOne");

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
        for (let i = 0; i < 1; i++) {
            const [mintedOptionId, hashOfTerms, response] = await mintERC721OptionNFT(erc721OptionContractTypeOne_2, guid(), managerAccount);
            console.log(`URI of newly minted Option Id [${mintedOptionId}] NFT [${response}]`);
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