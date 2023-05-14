require('module-alias/register'); // npm i --save module-alias
const { getAllTerms } = require("@webserver/utility");
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

/**
 * Return a list of all current terms as Json response
 * 
 * @param {*} res - http response
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