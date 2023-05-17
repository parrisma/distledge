require('module-alias/register'); // npm i --save module-alias
var fs = require('fs');
const { optionTermsDirName, deleteAllTerms } = require("@webserver/utility.js");
const {
    handleJsonError,
    getErrorWithMessage
} = require("./serverErrors");
const { ERR_PURGE } = require("@webserver/serverErrorCodes.js");
const {
    handleJsonOK,
    getOK
} = require("./serverResponse.js");
const { OK_PURGE } = require("@webserver/serverResponseCodes");

/**
 * Process a request to purge all existing NFT terms
*/
function purgeHandler(res) {
    console.log(`Handle Purge All Terms Request`);
    termsDirName = optionTermsDirName();
    try {
        deleteAllTerms();
        handleJsonOK(getOK(OK_PURGE), res);
    } catch (err) {
        handleJsonError(getErrorWithMessage(ERR_PURGE, `${err.message}`), res);
    }
}

module.exports = {
    purgeHandler
};