const { getAllTerms } = require("./utility");
const {
    getErrorWithMessage,
    handleJsonError
} = require("./serverErrors");
const { ERR_FAILED_LIST, } = require("./serverErrorCodes.js");
const {
    getOK,
    handleJsonOK
} = require("./serverResponse.js");
const { OK_LIST_TERMS } = require("./serverResponseCodes");

/* Process a request to get a list of all Option NFT terms
*/
function listHandler(res) {
    console.log(`Handle List all Terms Request`);
    try {
        handleJsonOK(getOK(OK_LIST_TERMS, getAllTerms()), res);
    } catch (err) {
        handleJsonError(getErrorWithMessage(ERR_FAILED_LIST, err), res);
    }
}

module.exports = {
    listHandler
};