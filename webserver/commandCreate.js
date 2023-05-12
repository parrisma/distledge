
var fs = require('fs');
const { fullPathAndNameOfOptionTermsJson, optionTermsDirName, isNumeric, currentDateTime } = require("./utility.js");
const {
    getErrorWithOptionIdAsMetaData,
    getError,
    handleJsonError
} = require("./serverErrors");
const {
    ERR_OPTION_ALREADY_EXISTS, ERR_OPTION_ID_NOT_SPECIFIED
} = require("./serverErrorCodes.js");
const {
    getOKWithMessage,
    handleJsonOK
} = require("./serverResponse");
const { OK_CREATE_TERMS } = require("./serverResponseCodes");
const { getOwnerAccount } = require("./accounts");

/*
** By POST
*/

/**
 * Write the option terms to a file
 */
async function writeOptionTerms(optionTermsDirName, termsAsJson, optionId, req, res) {
    fs.mkdirSync(optionTermsDirName);
    const [sig, optionTermsFileName] = await fullPathAndNameOfOptionTermsJson(optionTermsDirName, termsAsJson, await getOwnerAccount());

    var doc = {
        "optionId": `${optionId}`,
        "signature": `${sig}`,
        "signedBy": `${(await getOwnerAccount()).address}`,
        "created": `${currentDateTime()}`,
        "terms": {}
    };
    doc.terms = termsAsJson.terms;

    fs.writeFile(optionTermsFileName, JSON.stringify(doc), function (err) {
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
    handlePOSTCreateTermsRequest
}

