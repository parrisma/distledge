var fs = require('fs');

const {
    handleJsonError,
    getError,
    getErrorWithOptionIdAsMetaData
} = require("./serverErrors");
const { ERR_OPTION_ID_NOT_SPECIFIED, ERR_DEFUNCT_DNE } = require("./serverErrorCodes.js");
const {
    handleJsonOK,
    getOKWithOptionId
} = require("./serverResponse.js");
const { OK_DEFUNCT } = require("./serverResponseCodes");
const { optionTermsDirName } = require("./utility");

/* Process a request to defunct an Option NFT
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