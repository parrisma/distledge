require('module-alias/register'); // npm i --save module-alias
var fs = require('fs');

const {
    handleJsonError,
    getError,
    getErrorWithOptionIdAsMetaData
} = require("@webserver/serverErrors");
const { ERR_OPTION_ID_NOT_SPECIFIED, ERR_DEFUNCT_DNE } = require("@webserver/serverErrorCodes.js");
const {
    handleJsonOK,
    getOKWithOptionId
} = require("@webserver/serverResponse.js");
const { OK_DEFUNCT } = require("@webserver/serverResponseCodes");
const { optionTermsDirName } = require("@webserver/utility");

/**
 * Defunct (move to archive location) the option with the given ID
 * @param {*} uriParts - The separate part of the request URI
 * @param {*} res - http response
 */
function defunctHandler(uriParts, res) {
    console.log(`Handle Defunct Request`);
    var optionId = uriParts[2];
    console.log(`[${optionId}]`);
    if (null == optionId || 0 == `${optionId}`.length) {
        handleJsonError(getError(ERR_OPTION_ID_NOT_SPECIFIED), res);
    } else {
        if (fs.existsSync(optionTermsDirName(optionId))) {
            handleJsonOK(getOKWithOptionId(OK_DEFUNCT, optionId), res);
        } else {
            handleJsonError(getErrorWithOptionIdAsMetaData(ERR_DEFUNCT_DNE, optionId), res);
        }
    }
}

module.exports = {
    defunctHandler
};