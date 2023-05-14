require('module-alias/register'); // npm i --save module-alias
var fs = require('fs');
const {
    getErrorWithOptionIdAsMetaData,
    getError,
    handleJsonError
} = require("@webserver/serverErrors");
const {
    ERR_OPTION_ID_NOT_SPECIFIED, ERR_NOT_IMPLEMENTED, ERR_VALUE_OPTION_ID_NONEXISTENT
} = require("./serverErrorCodes.js");
const { optionTermsDirName } = require("@webserver/utility.js");

/**
 * Value the option of the given Id
 * @param {*} uriParts - The constituents of the option URI
 * @param {*} res - http response
 */
function valuationHandler(uriParts, res) {
    console.log(`Handle Valuation Request`);
    const optionId = uriParts[2];
    if (null == optionId || 0 == `${optionId}`.length) {
        handleJsonError(getError(ERR_OPTION_ID_NOT_SPECIFIED), res);
    } else {
        if (fs.existsSync(optionTermsDirName(optionId))) {
            handleJsonError(getError(ERR_NOT_IMPLEMENTED), res);
        } else {
            handleJsonError(getErrorWithOptionIdAsMetaData(ERR_VALUE_OPTION_ID_NONEXISTENT, optionId), res);
        }
    }
}

module.exports = {
    valuationHandler
}