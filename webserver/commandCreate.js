require('module-alias/register'); // npm i --save module-alias
var fs = require('fs');
const hre = require("hardhat");
const {
    getError,
    getFullyQualifiedError,
    handleJsonError
} = require("@webserver/serverErrors");
const { ERR_BAD_TERMS } = require("@webserver/serverErrorCodes");
const {
    getOKWithMessage,
    handleJsonOK
} = require("@webserver/serverResponse");
const { OK_CREATE_TERMS } = require("@webserver/serverResponseCodes");
const { addressConfig } = require("@webserver/constants");
const { currentDateTime } = require("@lib/generalUtil");
const { mintERC721OptionNFT } = require("@lib/contracts/Options/ERC721OptionContractTypeOne");
const { persistOptionTerms } = require("@webserver/serverPersist");
const { ERR_FAIL_CREATE } = require("@webserver/serverErrorCodes");


/**
 * Deploy option of given terms
 * 
 * @param {*} termsAsJson - The option terms as a Json object
 * @param {*} managerAccount - The manager account to sign the terms
 * @param {*} contractDict - the dictionary of all required and deployed utility contracts 
 */
async function mintNFTOption(
    termsAsJson,
    managerAccount,
    contractDict) {
    try {
        /**
         * This is an async call to the contract on chain, the handler [handleOptionMintedEmittedEvent] 
         * will catch the emitted event and process the rest of the request
         */
        const [mintedOptionId, hashOfTerms, response] = await mintERC721OptionNFT(contractDict[addressConfig.erc721OptionContractTypeOne], termsAsJson, managerAccount);
    } catch (err) {
        throw new Error(`Failed to mint new NTF for Type One Option Contract - [${err.message}]`);
    }
}

/**
 * Mint a new NFT and persist the terms of teh option to match the ERC271 URI associated with the newly minted NFT
 * 
 * @param {*} termsAsJson - The option terms as a Json object
 * @param {*} managerAccount - The manager account to sign the terms
 * @param {*} contractDict - the dictionary of all required and deployed utility contracts 
 * @param {*} req - http request
 * @param {*} res - http response
 */
async function mintAndPersistOptionNFT(
    termsAsJson,
    managerAccount,
    contractDict,
    req, res) {
    try {
        if (termsAsJson.hasOwnProperty("terms") && termsAsJson.terms.hasOwnProperty("uniqueId")) {
            /**
             * Verify terms are as signed by buyer
             */

            /**
             * Mint the ERC721 contract NFT, which will allocate the new optionId
             */
            const [mintedOptionId, hashOfTerms, response] = await mintNFTOption(termsAsJson, managerAccount, contractDict, req, res);

            /**
             * Persist the option terms, such that they can be recovered by this WebServer
             */
            console.log(`=========== H E R E ===========================`);
            // await persistOptionTerms(termsAsJson, mintedOptionId, hashOfTerms);

            /**
             * Verify integrity, option NFT exists & persisted terms match.
             */

            /**
             * All, done OK
             */
            handleJsonOK(getOKWithMessage(OK_CREATE_TERMS, `xx`, `1`), res);
            //handleJsonOK(getOKWithMessage(OK_CREATE_TERMS, `${sig}`, optionId), res);
        } else {
            handleJsonError(getError(ERR_BAD_TERMS), res);
        }
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_FAIL_CREATE,
            `Create Handler, failed to mint and persist option terms`,
            err);
    }
}

/**
 * Handle POST Create request
 * 
 * @param {*} termsAsJson - The option terms as Json object
 * @param {*} signingAccount - The managing account
 * @param {*} contractDict - the dictionary of all required and deployed utility contracts 
 * @param {*} req - http request
 * @param {*} res - http response
 */
async function handlePOSTCreateTermsRequest(
    termsAsJson,
    signingAccount,
    contractDict,
    req, res) {
    console.log(`Handle POST Create Terms Request for Id [${termsAsJson.id}]`);
    await mintAndPersistOptionNFT(termsAsJson, signingAccount, contractDict, req, res);
}

module.exports = {
    handlePOSTCreateTermsRequest
}

