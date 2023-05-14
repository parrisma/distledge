require('module-alias/register'); // npm i --save module-alias
var fs = require('fs');
const hre = require("hardhat");
const { fullPathAndNameOfOptionTermsJson, optionTermsDirName, isNumeric, currentDateTime } = require("@webserver/utility.js");
const {
    getErrorWithOptionIdAsMetaData,
    getError,
    handleJsonError
} = require("@webserver/serverErrors");
const {
    ERR_OPTION_ALREADY_EXISTS, ERR_OPTION_ID_NOT_SPECIFIED, ERR_OPTION_ID_NON_NUMERIC, ERR_BAD_TERMS
} = require("@webserver/serverErrorCodes.js");
const {
    getOKWithMessage,
    handleJsonOK
} = require("@webserver/serverResponse");
const { OK_CREATE_TERMS } = require("@webserver/serverResponseCodes");

/**
 * Deploy option of given terms
 */
function deployOption(termsAsJson)
{

}

/**
 * Write the option terms to a file
 * 
 * @param {*} optionTermsDirName - The full path to the option Terms directory, where the terms are stored
 * @param {*} termsAsJson - The option terms as a Json object
 * @param {*} optionId - The option Id
 * @param {*} managerAccount - The manager account to sign the terms
 * @param {*} req - http request
 * @param {*} res - http response
 */
async function writeOptionTerms(
    optionTermsDirName,
    termsAsJson,
    optionId,
    managerAccount,
    req, res) {
    if (termsAsJson.hasOwnProperty("terms") && termsAsJson.terms.hasOwnProperty("uniqueId")) {
        fs.mkdirSync(optionTermsDirName);
        const [sig, optionTermsFileName] = await fullPathAndNameOfOptionTermsJson(optionTermsDirName, termsAsJson.terms, managerAccount);

        var doc = {
            "optionId": `${optionId}`,
            "signature": `${termsAsJson.signature}`, // Buyer signature
            "signedBy": `${termsAsJson.signedBy}`,
            "managerSignature": `${sig}`, // Manager Signature
            "managerSignedBy": `${managerAccount.address}`,
            "created": `${currentDateTime()}`,
            "terms": termsAsJson.terms
        };

        fs.writeFile(optionTermsFileName, JSON.stringify(doc), function (err) {
            if (err) {
                console.log(`Failed to write option Terms file [${optionTermsFileName}] with Error [${err}]`);
                throw err;
            } else {
                console.log(`Option Terms written Ok to [${optionTermsDirName}] with Signature [${sig}]`);
                handleJsonOK(getOKWithMessage(OK_CREATE_TERMS, `${sig}`, optionId), res);
            }
        });
    } else {
        handleJsonError(getError(ERR_BAD_TERMS), res);
    }
}

/**
 * Handle POST Create request
 * 
 * @param {*} termsAsJson - The option terms as Json object
 * @param {*} signingAccount - The managing account
 * @param {*} req - http request
 * @param {*} res - http response
 */
async function handlePOSTCreateTermsRequest(
    termsAsJson,
    signingAccount,
    req, res) {
    console.log(`Handle POST Create Terms Request for Id [${termsAsJson.id}]`);
    const optionId = termsAsJson.id;
    if (null == optionId || 0 == `${optionId}`.length) {
        handleJsonError(getError(ERR_OPTION_ID_NOT_SPECIFIED), res);
    } else {
        if (isNumeric(optionId)) {
            if (!fs.existsSync(optionTermsDirName(optionId))) {
                await writeOptionTerms(optionTermsDirName(optionId), termsAsJson, optionId, signingAccount, req, res);
            } else {
                handleJsonError(getErrorWithOptionIdAsMetaData(ERR_OPTION_ALREADY_EXISTS, optionId), res);
            }
        } else {
            handleJsonError(getError(ERR_OPTION_ID_NON_NUMERIC), res);
        }
    }
}

module.exports = {
    handlePOSTCreateTermsRequest
}

