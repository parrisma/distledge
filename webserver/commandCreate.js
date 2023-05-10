
var fs = require('fs');
const { fullPathAndNameOfOptionTermsJson, optionTermsDirName, isNumeric } = require("./utility.js");
const {
    ERR_OPTION_ALREADY_EXISTS, ERR_CREATE_ONLY_BY_POST, ERR_OPTION_ID_NOT_SPECIFIED,
    getErrorWithOptionIdAsMetaData,
    getError,
    handleJsonError
} = require("./serverErrors");
const {
    OK_CREATE_TERMS,
    getOKWithMessage,
    handleJsonOK
} = require("./serverResponse");
const { getOwnerAccount } = require("./accounts");

/*
** By GET
*/

/* Process a request to create an Option NFT
*/
function createHandler(uriParts, res) {
    console.log(`Handle Create Request`);
    const optionId = uriParts[2];
    if (null == optionId || 0 == `${optionId}`.length) {
        handleJsonError(getError(ERR_OPTION_ID_NOT_SPECIFIED), res);
    } else {
        if (!fs.existsSync(optionTermsDirName(optionId))) {
            handleJsonError(getError(ERR_CREATE_ONLY_BY_POST), res);
        } else {
            handleJsonError(getErrorWithOptionIdAsMetaData(ERR_OPTION_ALREADY_EXISTS, optionId), res);
        }
    }
}

/*
** By POST
*/

/**
 * Write the option terms to a file
 */
async function writeOptionTerms(optionTermsDirName, termsAsJson, optionId, req, res) {
    fs.mkdirSync(optionTermsDirName);
    const [sig, optionTermsFileName] = await fullPathAndNameOfOptionTermsJson(optionTermsDirName, termsAsJson, await getOwnerAccount());
    fs.writeFile(optionTermsFileName, JSON.stringify(termsAsJson.terms), function (err) {
        if (err) {
            console.log(`Failed to write option Terms file [${optionTermsFileName}] with Error [${err}]`);
            throw err;
        } else {
            console.log(`Option Terms written Ok to [${optionTermsDirName}]`);
            handleJsonOK(getOKWithMessage(OK_CREATE_TERMS, JSON.stringify(sig), optionId), res);
        }
    });
}

/* Handle POST Create request
*/
async function handlePOSTCreateTermsRequest(termsAsJson, req, res) {
    console.log(`Handle POST Create Terms Request for Id [${termsAsJson.id}]`);
    const optionId = termsAsJson.id;
    if (null == optionId || 0 == `${optionId}`.length) {
        handleJsonError(getError(ERR_OPTION_ID_NOT_SPECIFIED), res);
    } else {
        if (isNumeric(optionId)) {
            if (!fs.existsSync(optionTermsDirName(optionId))) {
                await writeOptionTerms(optionTermsDirName(optionId), termsAsJson, optionId, req, res);
            } else {
                handleJsonError(getErrorWithOptionIdAsMetaData(ERR_OPTION_ALREADY_EXISTS, optionId), res);
            }
        } else {
            handleJsonError(getErrorWithOptionIdAsMetaData(ERR_OPTION_ID_NON_NUMERIC, optionId), res);
        }
    }
}

module.exports = {
    createHandler,
    handlePOSTCreateTermsRequest
}

