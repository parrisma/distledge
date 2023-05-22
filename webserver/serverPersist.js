/**
 * Handle all interaction with persistent source.
 * 
 * Initially this is just local files, however we can re implement with IPFS, Elastic or ...
 */
require('module-alias/register'); // npm i --save module-alias
const {
    ERR_FAILED_PERSIST, ERR_PERSIST_INIT, ERR_FAILED_LIST, ERR_PURGE,
    ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST, ERR_BAD_PULL
} = require("@webserver/serverErrorCodes.js");
const { getFullyQualifiedError } = require("@webserver/serverErrors");
const {
    persistInitializeFileSystem,
    persistOptionTermsFileSystem,
    persistPurgeAllFileSystem,
    persistListAllFileSystem,
    persistOptionIdExistsFileSystem,
    persistGetOptionTermsFileSystem } = require("@webserver/persistentSourceFileSystem");

/**
 * Mint a new NFT and persist the terms of teh option to match the ERC271 URI associated with the newly minted NFT
 * 
 * @param {*} termsAsJson - The option terms as a Json object
 * @param {*} optionId - The NTF Option Id of the given terms
 * @param {*} signedHash - The hash of option terms signed by the manager account
 * @param {*} req - http request
 * @param {*} res - http response
 */
async function persistOptionTerms(
    termsAsJson,
    optionId,
    signedHash) {

    try {
        persistOptionTermsFileSystem(termsAsJson, optionId, signedHash);
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_FAILED_PERSIST,
            `Failed to persist option terms`,
            err);
    }
}

/**
 * Carry out all required initialization for persistent source
 */
async function persistInitialize() {
    try {
        await persistInitializeFileSystem();
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_PERSIST_INIT,
            `Failed to initialize persistence`,
            err);
    }
}

/**
 * Delete all persistent terms.
 * Note: This would never be needed in a production context, but this is used for clean start testing
 *       in our demo dApp
 */
async function persistPurgeAll() {
    try {
        await persistPurgeAllFileSystem();
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_PURGE,
            `Persistence Layer, Failed to purge all terms`,
            err);
    }
}

/**
 * Get a list of all current option ID's and their associated hash
 * 
 * @returns List of terms in form of a Json Object containing an (array) list of option Id and Hash of terms
 */
async function persistListAll() {
    var optionsList = undefined;
    try {
        optionsList = await persistListAllFileSystem();
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_FAILED_LIST,
            `Persistence Layer, failed to List all terms`,
            err);
    }
    return optionsList;
}

/**
 * Return true of the given Option Id exists in the persistent source
 * 
 * @returns True if given option Id can be found in persistent store.
 */
async function persistOptionIdExists(optionId) {
    var exists = undefined;
    try {
        exists = await persistOptionIdExistsFileSystem(optionId);
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_FAILED_PERSIST,
            `Failed while checking if option existed in persistent storage`,
            err);
    }
    return exists;
}

/**
 * Get the option terms that match the given option Id
 * 
 * @returns Option terms as JSON object
 */
async function persistGetOptionTerms(optionId) {
    var optionTermsAsJson = undefined;
    try {
        if (!await persistOptionIdExists(optionId)) {
            throw getFullyQualifiedError(
                ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST,
                `Cannot get option from persistence as option id [${optionId}] does not exist`);
        }
        optionTermsAsJson = await persistGetOptionTermsFileSystem(optionId);
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_BAD_PULL,
            `Failed while pulling option terms`,
            err);
    }
    return optionTermsAsJson;
}

module.exports = {
    persistInitialize,
    persistOptionTerms,
    persistPurgeAll,
    persistListAll,
    persistOptionIdExists,
    persistGetOptionTerms
};