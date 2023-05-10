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

/* The directory where the Option terms are stored
*/
function optionTermsDirName(optionId) {
    return path.join(__dirname, `terms`, `${optionId}`);
}

/* The full path and name of option terms
*/
async function fullPathAndNameOfOptionTermsJson(optionTermsDirName,
    termsAsJson,
    signingAccount) {
    const sig = await getSignedHashOfOptionTerms(termsAsJson, signingAccount);
    return [sig, path.join(optionTermsDirName, `${sig}.json`)];
}

/*
** Take Json object and return signature of terms.
*/
async function getSignedHashOfOptionTerms(terms, signingAccount) {
    const secretMessage = ethers.utils.solidityPack(["string"], [JSON.stringify(terms)]);

    /* We now hash the message, and we will sign the hash of the message rather than the raw
    ** raw encoded (packed) message
    */
    const secretMessageHash = ethers.utils.keccak256(secretMessage);

    /*
    ** The message is now signed by the signingAccount
    */
    const sig = await signingAccount.signMessage(ethers.utils.arrayify(secretMessageHash)); // Don't forget to arrayify to send bytes

    return sig;
}

module.exports = {
    text_content,
    json_content,
    isNumeric,
    optionTermsDirName,
    fullPathAndNameOfOptionTermsJson,
    getSignedHashOfOptionTerms
};