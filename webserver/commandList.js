const { getAllTerms } = require("./utility");
const {
    ERR_FAILED_LIST,
    getErrorWithMessage,
    handleJsonError
} = require("./serverErrors");

const {
    OK_LIST_TERMS,
    getOK,
    handleJsonOK
} = require("./serverResponse.js");

/* Process a request to get a list of all Option NFT terms
*/
function listHandler(res) {
    console.log(`Handle List all Terms Request`);
    try {
        handleJsonOK(getOK(OK_LIST_TERMS, JSON.stringify(getAllTerms())), res);
    } catch (err) {
        handleJsonError(getErrorWithMessage(ERR_FAILED_LIST, err), res);
    }
}

module.exports = {
    listHandler
};