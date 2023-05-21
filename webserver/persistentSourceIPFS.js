/**
 * Persistence Implemented based on IPFS
 */

require('module-alias/register'); // npm i --save module-alias

/**
 * Carry out all required initialization for IPFS
 */
async function persistInitializeIPFS() {
    throw new Error(`IPFS Persistence not yet implemented`);
}


/**
 * Get a list of all persisted option terms, in teh form {OptionId & Signed Hash}
 * 
 * @returns List of terms in form of a Json Object containing an (array) list of option Id and Hash of terms
 */
async function persistListAllIPFS() {
    throw new Error(`IPFS Persistence not yet implemented`);
}


/**
 * Delete any persistent terms.
 * 
 * this would never be needed in a production context, but this is used for clean start testing
 * in our demo dApp
 */
async function persistPurgeAllIPFS() {
    throw new Error(`IPFS Persistence not yet implemented`);
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
    throw new Error(`IPFS Persistence not yet implemented`);
}

/**
 * Return true of the given Option Id exists in the persistent source
 * 
 * @returns True if given option Id can be found in IPFS.
 */
async function persistOptionIdExistsIPFS(optionId) {
    throw new Error(`IPFS Persistence not yet implemented`);
}

/**
 * Return the terms of the given option id as JSON object if it exists
 * @param {*} optionId - The Option Id to get
 * @returns The option terms as JSON object
 */
async function persistGetOptionTermsIPFS(optionId) {
    throw new Error(`IPFS Persistence not yet implemented`);
}

module.exports = {
    persistInitializeIPFS,
    persistListAllIPFS,
    persistPurgeAllIPFS,
    persistOptionTermsIPFS,
    persistOptionIdExistsIPFS,
    persistGetOptionTermsIPFS
};