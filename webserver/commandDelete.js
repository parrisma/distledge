require('module-alias/register'); // npm i --save module-alias
var fs = require('fs');
const { persistDeleteOneTerm,persistOptionIdExists } = require("@webserver/serverPersist");
const {
    handleJsonError,
    getError
} = require("./serverErrors");
const { ERR_DELETE } = require("@webserver/serverErrorCodes.js");
const { OK_DELETE } = require("@webserver/serverResponseCodes");
const {
    handleJsonOK,
    getOK
} = require("@webserver/serverResponse.js");

/**
 * Process a request to delete one existing NFT terms
*/
async function deleteHandler(uriParts, res) {
    console.log(`Handle Delete One Terms Request`);
    const optionId = uriParts[2];
        if (null == optionId || 0 == `${optionId}`.length) {
            handleJsonError(getError(ERR_OPTION_ID_NOT_SPECIFIED), res);
        } else {
            if (await persistOptionIdExists(optionId)) {
                await persistDeleteOneTerm(optionId);
                handleJsonOK(getOK(OK_DELETE), res);
            } else {
                handleJsonError(getErrorWithOptionIdAsMetaData(ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST, optionId), res);
            }
        }
}

module.exports = {
    deleteHandler
};