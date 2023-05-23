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
async function pullHandler(uriParts, res) {
    console.log(`Handle Pull Terms Request`);
    try {
        const optionId = uriParts[2];
        if (null == optionId || 0 == `${optionId}`.length) {
            handleJsonError(getError(ERR_OPTION_ID_NOT_SPECIFIED), res);
        } else {
            if (await persistOptionIdExists(optionId)) {
                const [optionTermsAsJson, hashOfTerms] = await persistGetOptionTerms(optionId);
                const responseMessage = {
                    "hash": `${hashOfTerms}`,
                    "terms": optionTermsAsJson
                };
                handleJsonOK(getOKWithMessage(OK_PULL_TERMS, responseMessage, optionId), res);
            } else {
                handleJsonError(getErrorWithOptionIdAsMetaData(ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST, optionId), res);
            }
        }
    } catch (err) {
        // err is a JSON error at this point.
        handleJsonError(err, res);
    }
}

module.exports = {
    pullHandler
}
