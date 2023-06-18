require('module-alias/register'); // npm i --save module-alias
const { addressConfig } = require("@webserver/constants");
const { exerciseERC721OptionNFT } = require("@lib/contracts/Options/ERC721OptionContractTypeOne"); // <- expose extra ERC721 calls here
const { persistGetOptionTerms } = require("@webserver/serverPersist"); // <- new delete method added here
const { OK_EXERCISE } = require("@webserver/serverResponseCodes"); // OK code to use if all works OK
const { ERR_FAIL_EXERCISE } = require("@webserver/serverErrorCodes"); // Error to report if exercise fails.
const {
    getErrorWithMessage,
    handleJsonError
} = require("@webserver/serverErrors");
const {
    getOKWithMessage,
    handleJsonOK
} = require("@webserver/serverResponse");

/**
 * Get the contract objects for the given contract addresses.
 * 
 * @param {*} contractDict - the dictionary of all required and deployed utility contracts 
 * @param {*} ERC721Address - ERC721 NFT
 * @param {*} settlementTokenAddress - Option Settlement Token
 * @param {*} FXRateAddress - Option Settlement Fx
 */
function getContracts(
    contractDict,
    ERC721Address,
    settlementTokenAddress,
    FXRateAddress,
    referenceLevel) {

    if (!(ERC721Address in contractDict)) {
        throw new Error(`Internal Server Error - bad address for ERC721 [${ERC721Address}] as contract cannot be located`);
    }

    if (!(settlementTokenAddress in contractDict)) {
        throw new Error(`Bad contract details, settlement token [${settlementTokenAddress}] contract cannot be located`);
    }

    if (!(FXRateAddress in contractDict)) {
        throw new Error(`Bad contract details, fx rate [${FXRateAddress}] contract cannot be located`);
    }

    if (!(referenceLevel in contractDict)) {
        throw new Error(`Bad contract details, reference level [${referenceLevel}] contract cannot be located`);
    }

    return [contractDict[ERC721Address], contractDict[settlementTokenAddress], contractDict[FXRateAddress], contractDict[referenceLevel]];

}

/**
 * Handle POST Exercise request
 * 
 * @param {*} exerciseRequest - The exercise request as Json object
 * @param {*} managerAccount - The managing account
 * @param {*} contractDict - the dictionary of all required and deployed utility contracts 
 * @param {*} req - http request
 * @param {*} res - http response
 */
async function handlePOSTExerciseTermsRequest(
    exerciseRequest,
    managerAccount,
    contractDict,
    req, res) {

    console.log(`Handle POST Exercise Terms Request for Id [${exerciseRequest.id}]`);

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

    console.log(`Exercise : [${exerciseRequest}]`);
    optionId = exerciseRequest.id;
    var wasErr = false;

    var optionTerm = await persistGetOptionTerms(optionId);
    var valueToSettle = exerciseRequest.value;

    try {
        const [ERC721Contract, settlementTokenContract, fxRateContract, refLevelContract] =
            getContracts(
                contractDict,
                addressConfig.erc721OptionContractTypeOne,
                optionTerm[0].settlementToken,
                optionTerm[0].fxReferenceLevel,
                optionTerm[0].referenceLevel
            );

        await exerciseERC721OptionNFT(
            ERC721Contract,
            settlementTokenContract,
            managerAccount,
            optionTerm[0].seller,
            exerciseRequest.buyerAccount,
            exerciseRequest.id,
            fxRateContract,
            valueToSettle,
            refLevelContract
        );
    } catch (err) {
        handleJsonError(getErrorWithMessage(ERR_FAIL_EXERCISE, err.message), res);
        wasErr = true;
    }
    if (!wasErr) {
        handleJsonOK(getOKWithMessage(OK_EXERCISE, `exercise is done.`, exerciseRequest.id), res);
    }
    return;
}

module.exports = {
    handlePOSTExerciseTermsRequest
}