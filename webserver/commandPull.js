var fs = require('fs');
var path = require('path');
const {
    getErrorWithOptionIdAsMetaData,
    getErrorWithMessage,
    getError,
    handleJsonError
} = require("./serverErrors");
const {
    ERR_OPTION_ID_NOT_SPECIFIED, ERR_FAILED_TO_LOAD_TERMS, ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST
} = require("./serverErrorCodes.js");
const {
    getOKWithMessage,
    handleJsonOK
} = require("./serverResponse.js");
const { OK_PULL_TERMS } = require("./serverResponseCodes");

const { optionTermsDirName } = require("./utility.js");


/* Create a JSON type response with the Json terms of the given option Id
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

/* Process a request to get an Option NFT terms
*/
function pullHandler(uriParts, res) {
    console.log(`Handle Pull Terms Request`);
    const optionId = uriParts[1];
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
