require('module-alias/register'); // npm i --save module-alias
const { addressConfig } = require("@webserver/constants");
const { mintERC721OptionNFT, erc721OptionNFTExists, transferOwnerToManagerAccount } = require("@lib/contracts/Options/ERC721OptionContractTypeOne"); // <- expose extra ERC721 calls here
const { persistOptionTerms, persistOptionIdExists, persistGetOptionTerms } = require("@webserver/serverPersist"); // <- new delete method added here
const { OK_EXERCISE } = require("@webserver/serverResponseCodes"); // OK code to use if all works OK
const { ERR_FAIL_EXERCISE } = require("@webserver/serverErrorCodes"); // Error to report if exercise fails.

const {
    getOKWithMessage,
    handleJsonOK
} = require("@webserver/serverResponse");



// const { getDictionaryOfDeployedContracts } = require("@lib/deployedContracts");

// const contractDict = getDictionaryOfDeployedContracts(addressConfig);

/**
 * Handle POST Exercise request
 * 
 * @param {*} termsAsJson - The option terms as Json object
 * @param {*} managerAccount - The managing account
 * @param {*} contractDict - the dictionary of all required and deployed utility contracts 
 * @param {*} req - http request
 * @param {*} res - http response
 */
async function handlePOSTExerciseTermsRequest(
    termsAsJson,
    managerAccount,
    contractDict,
    req, res) {

    console.log(`Handle POST Exercise Terms Request for Id [${termsAsJson.id}]`);

    /**
     * TODO - Implement Exercise logic and call it from the Exercise button on the Buyer Tab in front end.
     * 
     * Hints:
     * 
     * 1. Transfer Option NFT from current owner to manager account (ask ERC721 for current owner)
     * 2. Transfer the value of the option from seller (manager) to buyer
     * 3. Burn the NFT (ask ERC721)
     * 4. Delete the persisted option on the web server - this will need a new delete single option method adding to serverPersist.js (look at current purge all function)
     */
    
    console.log(termsAsJson);
    optionId = termsAsJson.id;

    
    var temp = await persistGetOptionTerms(optionId);
    
    transferOwnerToManagerAccount(contractDict[temp[0].settlementToken], managerAccount)

    console.log(temp);


    handleJsonOK(getOKWithMessage(OK_EXERCISE, `<Not yet implemented>`, termsAsJson.Id), res);
}

module.exports = {
    handlePOSTExerciseTermsRequest
}