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
const { OK_BUY_OPTION } = require("@webserver/serverResponseCodes");
const { addressConfig } = require("@webserver/constants");
const { settleERC721OptionNFT } = require("@lib/contracts/Options/ERC721OptionContractTypeOne");
const { ERR_FAIL_BUY } = require("@webserver/serverErrorCodes");

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
async function settleOptionNFT(
    termsAsJson,
    managerAccount,
    contractDict,
    req, res) {
    try {
        if (termsAsJson.hasOwnProperty("terms") && termsAsJson.terms.hasOwnProperty("uniqueId") && termsAsJson.terms.hasOwnProperty("mintedOptionId")) {
            const mintedOptionId = termsAsJson.terms.mintedOptionId;
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
             *  - The code transfers the Option NFT from the manager account to the buyer account
             *  - As well as the logic to transfer the premium from the buyer to the seller.
             */
            await settleNFTOption(
                termsAsJson.terms,
                managerAccount,
                sellerAddress,
                buyerAddress,
                mintedOptionId,
                contractDict);

            /**
             * All, done OK
             */
            handleJsonOK(getOKWithMessage(OK_BUY_OPTION, 'Successfully settled option', mintedOptionId), res);
        } else {
            handleJsonError(getError(ERR_BAD_TERMS), res);
        }
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_FAIL_BUY,
            `Buy Handler, failed to settle option`,
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
async function handlePOSTBuyOptionRequest(
    termsAsJson,
    signingAccount,
    contractDict,
    req, res) {
    console.log(`Handle POST Create Terms Request for Id [${termsAsJson.id}]`);
    try {
        await settleOptionNFT(termsAsJson, signingAccount, contractDict, req, res);
    } catch (err) {
        handleJsonError(err, res);
    }
}

module.exports = {
    handlePOSTBuyOptionRequest
}

