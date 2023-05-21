require('module-alias/register'); // npm i --save module-alias
const {
    getErrorWithOptionIdAsMetaData,
    getError,
    handleJsonError
} = require("@webserver/serverErrors");
const {
    ERR_OPTION_ID_NOT_SPECIFIED, ERR_FAILED_TO_LOAD_TERMS, ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST
} = require("@webserver/serverErrorCodes.js");
const {
    getOKWithMessage,
    handleJsonOK
} = require("@webserver/serverResponse.js");
const { OK_PULL_TERMS } = require("@webserver/serverResponseCodes");
const { persistOptionIdExists, persistGetOptionTerms } = require("@webserver/serverPersist");

/**
 * Send back the terms of the given option Id
 * 
 * @param {*} uriParts - The request URI constituents
 * @param {*} res - http response
 */
function pullHandler(uriParts, res) {
    console.log(`Handle Pull Terms Request`);
    const optionId = uriParts[2];
    if (null == optionId || 0 == `${optionId}`.length) {
        handleJsonError(getError(ERR_OPTION_ID_NOT_SPECIFIED), res);
    } else {
        if (persistOptionIdExists(optionId)) {
            const optionTermsAsJson = persistGetOptionTerms(optionId);
            handleJsonOK(getOKWithMessage(OK_PULL_TERMS, optionTermsAsJson, optionId), res);
        } else {
            handleJsonError(getErrorWithOptionIdAsMetaData(ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST, optionId), res);
        }
    }
}

module.exports = {
    pullHandler
}
