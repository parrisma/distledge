require('module-alias/register'); // npm i --save module-alias
const { getSignedHashOfOptionTerms } = require("@scripts/lib/signedValue.js");
var fs = require('fs');

var path = require('path');

/* Content Types
*/
const text_content = { 'Content-Type': 'text/html' };
const json_content = { "Content-Type": "application/json" };

/**
 * Verify that the given terms are unchanged and match the signer
 * 
 * @param {*} optionTermsAsJson - The option terms being verified as JSON
 * @param {*} signatureToVerify - The original signature created by the signingAccount
 * @param {*} signingAccount - The signing account that generated the original signature, passed as signatureToVerify to this function.
 */
async function verifyTerms(
    optionTermsAsJson,
    managerAccount) {

    // Hash & sign and ensure new signature matches buyer account
    const optionTermsToVerify = optionTermsAsJson.terms;

    // Hash & sign and ensure new signature matches manager account
    const sigMgr = `${await getSignedHashOfOptionTerms(JSON.stringify(optionTermsToVerify), managerAccount)}`;
    const mgrSignatureToVerify = optionTermsAsJson.managerSignature;
    if (sigMgr != mgrSignatureToVerify) {
        const errMsg = `The new signature manager [${sigMgr}] does not match the expected signature [${mgrSignatureToVerify}]`;
        throw new Error(errMsg);
    }

    return true;
}

module.exports = {
    text_content,
    json_content,
    verifyTerms
};