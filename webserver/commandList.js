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
 * @param {*} contractDict - Dictionary of deployed contracts
 * @param {*} res - http response
 * @returns Current Option terms held by the server as JSON array
 */
async function listHandler(contractDict, res) {
    console.log(`Handle List all Terms Request`);
    try {
        handleJsonOK(getOK(OK_LIST_TERMS, await persistListAll(contractDict)), res);
    } catch (err) {
        handleJsonError(getError(ERR_FAILED_LIST, err), res);
    }
}

module.exports = {
    listHandler
};