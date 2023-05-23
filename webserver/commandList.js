require('module-alias/register'); // npm i --save module-alias
const { persistListAll } = require("@webserver/serverPersist");
const {
    getError,
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
async function listHandler(res) {
    console.log(`Handle List all Terms Request`);
    try {
        handleJsonOK(getOK(OK_LIST_TERMS, await persistListAll()), res);
    } catch (err) {
        console.log(`Here 101 [${JSON.stringify(err)}]`);
        handleJsonError(getError(ERR_FAILED_LIST, err), res);
    }
}

module.exports = {
    listHandler
};