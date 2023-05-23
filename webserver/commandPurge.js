require('module-alias/register'); // npm i --save module-alias
var fs = require('fs');
const { persistPurgeAll } = require("@webserver/serverPersist");
const {
    handleJsonError,
    getError
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
async function purgeHandler(res) {
    console.log(`Handle Purge All Terms Request`);
    try {
        await persistPurgeAll();
        handleJsonOK(getOK(OK_PURGE), res);
    } catch (err) {
        handleJsonError(getError(ERR_PURGE, err), res);
    }
}

module.exports = {
    purgeHandler
};