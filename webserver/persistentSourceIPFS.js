/**
 * Persistence Implemented based on IPFS
 */
require('module-alias/register'); // npm i --save module-alias
var fs = require('fs');
const { addTextToIPFS, getTextFromIPFS } = require('./ipfs/ipfsCore.js'); 
const { startIpfs } = require('./ipfs/ipfsCore.js'); 
var path = require('path');
const { serverConfig } = require("@webserver/serverConfig");
const { ERR_FAILED_PERSIST, ERR_PERSIST_INIT, ERR_PURGE, ERR_FAILED_LIST } = require("@webserver/serverErrorCodes.js");
const { getFullyQualifiedError } = require("@webserver/serverErrors");
const { isNumeric } = require("@lib/generalUtil");
const { rimraf } = require('rimraf');

/**
 * Get the root path where option cid are stored.
 * //todo: will change to cloud file server or DB or IPFS
*/
function baseTermsDir() {
    return path.join(__dirname, `${serverConfig.dbPath}`);
}

/**
 * Get the root path where cid are stored.
*/
function optionTermsDirName(optionId) {
    return path.join(baseTermsDir(), `${optionId}`);
}

/**
 * Create the directory where the Option terms are to be stored
 * @param {*} optionId - The Id of the option to be stored.
 * @returns The fill path and name of the file where the option terms are stored.
*/
function createOptionTermsDir(optionId) {
    var termsDir = undefined;
    try {
        termsDir = optionTermsDirName(optionId);
        /**
         * Must not already exists
         */
        if (fs.existsSync(termsDir)) {
            throw getFullyQualifiedError(
                ERR_OPTION_ALREADY_EXISTS,
                `Option with given Id exists already, cannot create [${termsDir}]`,
                err);
        }

        /**
         * Create the terms dir
         */
        fs.mkdirSync(termsDir);
        if (!fs.existsSync(termsDir)) {
            throw getFullyQualifiedError(
                ERR_FAILED_PERSIST,
                `Failed to create storage location [${termsDir}]`,
                err);
        }
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_FAILED_PERSIST,
            `Failed to create storage location for option id [${optionId}] with error [${err.message}]`,
            err);
    }
    return termsDir;
}

/**
 * Get the the full path and name of option terms file & the digital signature
 * (The file name is formed based on the signature.)
 * 
 * @param {*} optionTermsDirName - the full path to where terms are help
 * @param {*} signedHash - The hash of option terms signed by the manager account
 * @returns signature & option terms file name
 */
async function fullPathAndNameOfOptionTermsJson(
    optionTermsDirName,
    signedHash) {
    return path.join(optionTermsDirName, `${signedHash}`);
}

/**
 * Carry out all required initialization for IPFS
 */
async function persistInitializeIPFS() {
    await startIpfs();
}


/**
 * Get a list of all persisted option terms, in teh form {OptionId & Signed Hash}
 * 
 * @returns List of terms in form of a Json Object containing an (array) list of option Id and Hash of terms
 */
async function persistListAllIPFS() {
    var optionsList = { "terms": [] };
    try {
        const options = fs.readdirSync(baseTermsDir());
        options.forEach((value, index, array) => {
            if (isNumeric(value)) {
                const terms = fs.readdirSync(path.join(baseTermsDir(), `${value}`));
                terms.forEach((value1, index1, array1) => {
                    const optionId = value;
                    const contractHash = value1;
                    optionsList.terms.push({ "optionId": `${optionId}`, "hash": `${contractHash}` });
                });
            }
        });
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_FAILED_LIST,
            `Failed get list of all existing terms`,
            err);
    }
    return optionsList;
}


/**
 * Delete any persistent terms.
 * 
 * this would never be needed in a production context, but this is used for clean start testing
 * in our demo dApp
 */
async function persistPurgeAllIPFS() {
    const termsDirName = baseTermsDir();
    try {
        if (fs.existsSync(termsDirName)) {
            // Delete the entire terms dir and contents
            rimraf.sync(termsDirName);
            if (fs.existsSync(termsDirName)) {
                throw getFullyQualifiedError(
                    ERR_PURGE,
                    `Failed to purge & re-create terms dir ${termsDirName}`,
                    err);
            }
        }
        console.log(`Terms dir ${termsDirName}`);
        fs.mkdirSync(termsDirName);
        if (!fs.existsSync(termsDirName)) {
            throw getFullyQualifiedError(
                ERR_PURGE,
                `Failed to purge & re-create terms dir ${termsDirName}`,
                err);
        }
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_PURGE,
            `Failed to purge & re-create terms dir`,
            err);
    }
    return
}

/**
 * Persist the given option terms on IPFS
 * 
 * @param {*} termsAsJson - The option terms as a Json object
 * @param {*} optionId - The NTF Option Id of the given terms
 * @param {*} signedHash - The hash of option terms signed by the manager account
 * @param {*} signature - The signed hash of the terms
 */
async function persistOptionTermsIPFS(
    termsAsJson,
    optionId,
    signedHash) {
    try {
        cid = await addTextToIPFS(JSON.stringify(termsAsJson));
        console.log(cid)
        const optionTermsDirName = createOptionTermsDir(optionId);
        const optionTermsFileName = await fullPathAndNameOfOptionTermsJson(optionTermsDirName, signedHash);
        fs.writeFileSync(optionTermsFileName, cid)
        console.log(`Option Terms written Ok to [${optionTermsDirName}] with Signature [${sig}]`);
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_FAILED_PERSIST,
            `Failed to write option Terms file [${optionTermsFileName}] with Error [${err.message}]`,
            err);
    }
}

/**
 * Return true of the given Option Id exists in the persistent source
 * 
 * @returns True if given option Id can be found in IPFS.
 */
async function persistOptionIdExistsIPFS(optionId) {
    var exists = undefined;
    try {
        exists = fs.existsSync(optionTermsDirName(optionId));
    } catch (err) {
        throw new Error(`Failed while checking if option existed on file system with message [${err.message}]`);
    }
    return exists;
}

/**
 * Get the signed hash which is the filename of teh stored terms
 */
function getSignedHashFromOptionTermsFileName(fileName) {
    const fileNameBits = fileName.split(path.sep);
    var hash = `${fileNameBits.slice(-1)}`.replace(RegExp('\.json', `i`), '');
    return hash
}

/**
 * Return the terms of the given option id as JSON object if it exists
 * @param {*} optionId - The Option Id to get
 * @returns The option terms as JSON object & initial manager signed hash of terms
 */
async function persistGetOptionTermsIPFS(optionId) {
    var optionTermsAsJson = undefined;
    var originalMangerSignedHash = undefined;
    try {
        const files = fs.readdirSync(optionTermsDirName(optionId));
        const optionTermsFileName = path.join(optionTermsDirName(optionId), files[0]);
        cid = fs.readFileSync(optionTermsFileName);
        optionTermsAsJson = await getTextFromIPFS(cid.toString());
        originalMangerSignedHash = getSignedHashFromOptionTermsFileName(optionTermsFileName);
    } catch (err) {
        throw new Error(`Failed to read option terms with error [${err.message}]`);
    }
    return [optionTermsAsJson, originalMangerSignedHash];
}

/**
 * Delete one terms that exist in the terms folder by option id.
 * this would never be needed in a production context, but this is used for clean start testing
 * in our demo dApp
 */
async function persistDeleteOneTermIPFS(optionId) {
    const termsDirName = optionTermsDirName(optionId);
    try {
        if (fs.existsSync(termsDirName)) {
            // Delete the terms id dir
            rimraf.sync(termsDirName);
            if (fs.existsSync(termsDirName)) {
                throw getFullyQualifiedError(
                    ERR_PURGE,
                    `Failed to delete ${termsDirName}`,
                    err);
            }
        }
        console.log(`Terms dir ${termsDirName}`);
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_PURGE,
            `Failed to delete terms ${termsDirName} dir`,
            err);
    }
    return
}

module.exports = {
    persistInitializeIPFS,
    persistListAllIPFS,
    persistPurgeAllIPFS,
    persistOptionTermsIPFS,
    persistOptionIdExistsIPFS,
    persistGetOptionTermsIPFS,
    persistDeleteOneTermIPFS
};