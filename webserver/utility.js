require('module-alias/register'); // npm i --save module-alias
var rimraf = require("rimraf"); // npm install rimraf
const { serverConfig } = require("./serverConfig.js");
const { getSignedHashOfOptionTerms } = require("@scripts/lib/signedValue.js");
var fs = require('fs');

var path = require('path');

/* Content Types
*/
const text_content = { 'Content-Type': 'text/html' };
const json_content = { "Content-Type": "application/json" };

/* True if [value] is a positive integer
*/
function isNumeric(value) {
    return /^\d+$/.test(value);
}

/* Get the root path where option terms are stored.
*/
function baseTermsDir() {
    return path.join(__dirname, `${serverConfig.dbPath}`);
}
/* The directory where the Option terms are stored
*/
function optionTermsDirName(optionId) {
    return path.join(baseTermsDir(), `${optionId}`);
}

/**
 * Verify that the given terms are unchanged and match the signer
 * 
 * @param {*} optionTermsAsJson - The option terms being verified as JSON
 * @param {*} signatureToVerify - The original signature created by the signingAccount
 * @param {*} signingAccount - The signing account that generated the original signature, passed as signatureToVerify to this function.
 */
async function verifyTerms(optionTermsAsJson,
    signingAccount,
    managerAccount) {

    // Hash & sign and ensure new signature matches buyer account
    const optionTermsToVerify = optionTermsAsJson.terms;

    const sig = `${await getSignedHashOfOptionTerms(JSON.stringify(optionTermsToVerify), signingAccount)}`;
    const signatureToVerify = optionTermsAsJson.signature;
    if (sig != signatureToVerify) {
        const errMsg = `The new signature buyer [${sig}] does not match the expected signature [${signatureToVerify}]`;
        throw new Error(errMsg);
    }

    // Hash & sign and ensure new signature matches manager account
    const sigMgr = `${await getSignedHashOfOptionTerms(JSON.stringify(optionTermsToVerify), managerAccount)}`;
    const mgrSignatureToVerify = optionTermsAsJson.managerSignature;
    console.log(`NEW SIG ${JSON.stringify(optionTermsToVerify)} - ${mgrSignatureToVerify}`);
    if (sigMgr != mgrSignatureToVerify) {
        const errMsg = `The new signature manager [${sigMgr}] does not match the expected signature [${mgrSignatureToVerify}]`;
        throw new Error(errMsg);
    }

    return true;
}

/**
 * Delete any terms that exist in the terms folder.
 * this would never be needed in a production context, but this is used for clean start testing
 * in our demo dApp
 */
function deleteAllTerms() {
    const termsDirName = baseTermsDir();
    if (fs.existsSync(termsDirName)) {
        // Delete the entire terms dir and contents
        rimraf.sync(termsDirName);
        if (fs.existsSync(termsDirName)) {
            throw new Error(`Failed to purge terms dir ${termsDirName}`);
        }
    }
    console.log(`Terms dir ${termsDirName}`);
    fs.mkdirSync(termsDirName);
    if (!fs.existsSync(termsDirName)) {
        throw new Error(`Failed to purge & recreate terms dir ${termsDirName}`);
    }
    return
}

/**
 * Get a list of all current option ID's and their associated hash
 * 
 * @returns List of terms in form of a Json Object containing an (array) list of option Id and Hash of terms
 */
function getAllTerms() {
    var optionsList = { "terms": [] };
    const options = fs.readdirSync(baseTermsDir());
    options.forEach((value, index, array) => {
        if (isNumeric(value)) {
            const terms = fs.readdirSync(path.join(baseTermsDir(), `${value}`));
            terms.forEach((value1, index1, array1) => {
                const optionId = value;
                const contractHash = value1.substring(0, value1.length - 5);
                optionsList.terms.push({ "optionId": `${optionId}`, "contract": `${contractHash}` });
            });
        }
    });
    return optionsList;
}

/**
 * Get the the full path and name of option terms file & the digital signature
 * (The file name is formed based on the signature.)
 * 
 * @param {*} optionTermsDirName - the full path to where terms are help
 * @param {*} termsAsJson - Option terms as Json
 * @param {*} signingAccount - The account to sign the terms.
 * @returns signature & option terms file name
 */
async function fullPathAndNameOfOptionTermsJson(optionTermsDirName,
    termsAsJson,
    signingAccount) {
    const sig = await getSignedHashOfOptionTerms(JSON.stringify(termsAsJson), signingAccount);
    console.log(`MGR SIG ${JSON.stringify(termsAsJson)} - ${sig}`);
    return [sig, path.join(optionTermsDirName, `${sig}.json`)];
}

const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
function pad2(v) {
    sv = `${v}`;
    if (1 == sv.length) {
        sv = `0${sv}`;
    }
    return sv;
}

/**
 * Get current date and time.
 * @returns current date & time as string
 */
function currentDateTime() {
    const d = new Date();
    return `${pad2(d.getDay())}-${months[d.getMonth()]}-${d.getFullYear()}:${pad2(d.getHours())}-${pad2(d.getMinutes())}-${pad2(d.getSeconds())}-${d.getMilliseconds()}::${pad2(d.getTimezoneOffset() / 60)}`;
}

module.exports = {
    text_content,
    json_content,
    isNumeric,
    baseTermsDir,
    optionTermsDirName,
    getAllTerms,
    deleteAllTerms,
    fullPathAndNameOfOptionTermsJson,
    verifyTerms,
    currentDateTime
};