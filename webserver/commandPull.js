require('module-alias/register'); // npm i --save module-alias
var fs = require('fs');
var path = require('path');
const {
    getErrorWithOptionIdAsMetaData,
    getErrorWithMessage,
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
const { optionTermsDirName } = require("@webserver/utility.js");


/**
 * Load option terms & form a JSon based http response
 * 
 * @param {*} optionId - The Option Id to return
 * @param {*} res - http response
 */
async function optionTermsFromFileResponse(optionId, res) {
    try {
        const files = fs.readdirSync(optionTermsDirName(optionId));
        const optionTermsFileName = path.join(optionTermsDirName(optionId), files[0]);
        optionTermsAsJson = JSON.parse(fs.readFileSync(optionTermsFileName));
        handleJsonOK(getOKWithMessage(OK_PULL_TERMS, optionTermsAsJson, optionId), res);
    } catch (err) {
        handleJsonError(getErrorWithMessage(ERR_FAILED_TO_LOAD_TERMS, err), res);
    }
}

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
        if (fs.existsSync(optionTermsDirName(optionId))) {
            optionTermsFromFileResponse(optionId, res);
        } else {
            handleJsonError(getErrorWithOptionIdAsMetaData(ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST, optionId), res);
        }
    }
}

module.exports = {
    pullHandler
}
