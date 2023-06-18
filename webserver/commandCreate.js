require('module-alias/register'); // npm i --save module-alias
var fs = require('fs');
const { isValidAddressFormat } = require("@lib/generalUtil");
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
const { mintERC721OptionNFT, erc721OptionNFTExists, settleERC721OptionNFT } = require("@lib/contracts/Options/ERC721OptionContractTypeOne");
const { persistOptionTerms, persistOptionIdExists } = require("@webserver/serverPersist");
const { ERR_FAIL_CREATE } = require("@webserver/serverErrorCodes");

/**
 * Deploy option of given terms
 * 
 * @param {*} termsAsJson - The option terms as a Json object
 * @param {*} managerAccount - The manager account to sign the terms
 * @param {*} sellerAddress - The address of the seller account
 * @param {*} contractDict - the dictionary of all required and deployed utility contracts 
 */
async function mintNFTOption(
    termsAsJson,
    managerAccount,
    sellerAddress,
    contractDict) {
    var mintedOptionId, hashOfTerms, response;
    try {
        /**
         * This is an async call to the contract on chain, the handler [handleOptionMintedEmittedEvent] 
         * will catch the emitted event and process the rest of the request
         */
        [mintedOptionId, hashOfTerms, response] = await mintERC721OptionNFT(contractDict[addressConfig.erc721OptionContractTypeOne],
            termsAsJson,
            managerAccount,
            sellerAddress);
    } catch (err) {
        throw new Error(`Failed to mint new NTF for Type One Option Contract - [${err.message}]`);
    }
    return [mintedOptionId, hashOfTerms, response];
}

/**
 * Transfer the newly minted NFT Option from manager to buyer and transfer premium from buyer to seller.
 * @param {*} termsAsJson - The option terms as Json
 * @param {*} managerAccount - The manager account (object) that issued the Option (NFT)
 * @param {*} buyerAddress  - The buyer address (hex) for the option
 * @param {*} mintedOptionId - The Id of the newly minted NFT
 * @param {*} contractDict - Dictionary of deployed utility contracts.
 */
async function settleNFTOption(
    termsAsJson,
    managerAccount,
    sellerAddress,
    buyerAddress,
    mintedOptionId,
    contractDict) {
    try {
        /**
         * This is an async call to the contract on chain, the handler [handleOptionMintedEmittedEvent] 
         * will catch the emitted event and process the rest of the request
         */
        await settleERC721OptionNFT(
            contractDict[addressConfig.erc721OptionContractTypeOne],
            contractDict[termsAsJson.premiumToken],
            managerAccount,
            sellerAddress,
            buyerAddress,
            termsAsJson.premiumToken,
            termsAsJson.premium,
            mintedOptionId);
    } catch (err) {
        throw new Error(`Failed to settle NTF for Type One Option Contract - [${err.message}]`);
    }
}

/**
 * Mint a new NFT and persist the terms of the option to match the ERC271 URI associated with the newly minted NFT
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
             * TODO
             */

            /**
             * We need a valid seller account to have been passed
             */
            const sellerAddress = termsAsJson.terms.seller; // This is just the address, not the account object.
            if (!isValidAddressFormat(sellerAddress)) {
                throw new Error(`Invalid account passed as Option seller [${sellerAddress}]`);
            }


            /**
             * We need a valid buyer account to have been passed
             */
            const buyerAddress = termsAsJson.buyerAccount; // This is just the address, not the account object.
            if (!isValidAddressFormat(buyerAddress)) {
                throw new Error(`Invalid account passed as Option buyer [${buyerAddress}]`);
            }

            /**
             * Mint the ERC721 contract NFT, which will allocate the new optionId
             */
            const optionTerms = termsAsJson.terms;
            const [mintedOptionId, hashOfTerms, response] = await mintNFTOption(optionTerms, managerAccount, sellerAddress, contractDict, req, res);
            if (!await erc721OptionNFTExists(contractDict[addressConfig.erc721OptionContractTypeOne], mintedOptionId)) {
                throw new Error(`Expected option id [${mintedOptionId}] does not exist according to ERC721 Option NFT Contract [${addressConfig.erc721OptionContractTypeOne}]`);
            }

            /**
             * Persist the option terms, such that they can be recovered by this WebServer
             */
            await persistOptionTerms(optionTerms, mintedOptionId, hashOfTerms);
            if (!(await persistOptionIdExists(mintedOptionId))) {
                throw new Error(`Expected option id [${mintedOptionId}] does not exist in persistent source`);
            }

            /**
             * TODO - The code needs adding that will transfer the Option NFT from the manager account to the buyer account
             *      - As well as the logic to transfer the premium from the buyer to the seller.
             */
            await settleNFTOption(
                optionTerms,
                managerAccount,
                sellerAddress,
                buyerAddress,
                mintedOptionId,
                contractDict);

            /**
             * All, done OK
             */
            handleJsonOK(getOKWithMessage(OK_CREATE_TERMS, `${hashOfTerms}`, mintedOptionId), res);
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
    try {
        await mintAndPersistOptionNFT(termsAsJson, signingAccount, contractDict, req, res);
    } catch (err) {
        handleJsonError(err, res);
    }
}

module.exports = {
    handlePOSTCreateTermsRequest
}

