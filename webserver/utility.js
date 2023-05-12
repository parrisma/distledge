const { serverConfig } = require("./serverConfig.js");
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

/* Get the toor path where option terms are stored.
*/
function baseTermsDir() {
    return path.join(__dirname, `${serverConfig.dbPath}`);
}
/* The directory where the Option terms are stored
*/
function optionTermsDirName(optionId) {
    return path.join(baseTermsDir(), `${optionId}`);
}

/* Get a list of all current option ID's and their associated terms
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

const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
function pad2(v) {
    sv = `${v}`;
    if (1 == sv.length) {
        sv = `0${sv}`;
    }
    return sv;
}

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
    fullPathAndNameOfOptionTermsJson,
    getSignedHashOfOptionTerms,
    currentDateTime
};