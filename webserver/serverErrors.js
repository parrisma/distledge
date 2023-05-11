const { json_content } = require("./utility.js");
const {
    ERR_OPTION_ALREADY_EXISTS, ERR_DEFUNCT_DNE, ERR_OPTION_ID_NOT_SPECIFIED, ERR_NOT_IMPLEMENTED,
    ERR_VALUE_OPTION_ID_NONEXISTENT, ERR_FAILED_TO_LOAD_TERMS, ERR_BAD_GET, ERR_UNKNOWN_COMMAND, ERR_OPTION_ID_NON_NUMERIC,
    ERR_BAD_POST, ERR_BAD_HTTP, ERR_BAD_HTTP_CALL, ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST, ERR_FAILED_LIST
} = require("./serverErrorCodes.js");

var errorsDict = {};

errorsDict[ERR_FAILED_LIST] =
{
    "errorCode": `${ERR_FAILED_LIST}`,
    "errorMessage": `Failed to get list of all existing option terms`
};

errorsDict[ERR_OPTION_ALREADY_EXISTS] =
{
    "errorCode": `${ERR_OPTION_ALREADY_EXISTS}`,
    "errorMessage": `Failed to create terms as Option Contract already exists`
};

errorsDict[ERR_DEFUNCT_DNE] =
{
    "errorCode": `${ERR_DEFUNCT_DNE}`,
    "errorMessage": `Failed to defunct Option Contract terms as terms do not exist`
};

errorsDict[ERR_OPTION_ID_NOT_SPECIFIED] =
{
    "errorCode": `${ERR_OPTION_ID_NOT_SPECIFIED}`,
    "errorMessage": `Cannot perform operation, Option ID not specified`
};

errorsDict[ERR_NOT_IMPLEMENTED] =
{
    "errorCode": `${ERR_NOT_IMPLEMENTED}`,
    "errorMessage": `Cannot perform operation, not yet implemented by server`
};

errorsDict[ERR_VALUE_OPTION_ID_NONEXISTENT] =
{
    "errorCode": `${ERR_VALUE_OPTION_ID_NONEXISTENT}`,
    "errorMessage": `Failed to value as Option Contract terms because given optionId does not exist`
};

errorsDict[ERR_FAILED_TO_LOAD_TERMS] =
{
    "errorCode": `${ERR_FAILED_TO_LOAD_TERMS}`,
    "errorMessage": `Failed load option terms from file`
};

errorsDict[ERR_BAD_GET] =
{
    "errorCode": `${ERR_BAD_GET}`,
    "errorMessage": `Internal Server Error, cannot process`
};

errorsDict[ERR_UNKNOWN_COMMAND] =
{
    "errorCode": `${ERR_UNKNOWN_COMMAND}`,
    "errorMessage": `Cannot process, unknown command`
};

errorsDict[ERR_OPTION_ID_NON_NUMERIC] =
{
    "errorCode": `${ERR_OPTION_ID_NON_NUMERIC}`,
    "errorMessage": `Option Id must be numeric for POST Create Terms`
};

errorsDict[ERR_BAD_POST] =
{
    "errorCode": `${ERR_BAD_POST}`,
    "errorMessage": `Bad POST request, cannot process`
};

errorsDict[ERR_BAD_HTTP] =
{
    "errorCode": `${ERR_BAD_HTTP}`,
    "errorMessage": `Unknown http method, cannot process`
};

errorsDict[ERR_BAD_HTTP_CALL] =
{
    "errorCode": `${ERR_BAD_HTTP_CALL}`,
    "errorMessage": `Bad HTTP call, exited with error`
};

errorsDict[ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST] =
{
    "errorCode": `${ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST}`,
    "errorMessage": `Cannot pull option terms, given option id does not exist`
};

function getErrorWithOptionIdAsMetaData(errorCode, optionId) {
    var errorJson = errorsDict[errorCode];
    errorJson.optionId = `${optionId}`;
    return errorJson;
}

function getError(errorCode) {
    var errorJson = errorsDict[errorCode];
    return errorJson;
}

function getErrorWithMessage(errorCode, message) {
    var errorJson = errorsDict[errorCode];
    errorJson.message = message;
    return errorJson;
}

/* Return a Json error response.
*/
function handleJsonError(JsonErrorMessage, res) {
    const errorMessage = JSON.stringify(JsonErrorMessage);
    console.log(`Handle error [${errorMessage}]`);
    res.writeHead(400, json_content);
    res.end(errorMessage);
}

module.exports = {
    getErrorWithOptionIdAsMetaData,
    getErrorWithMessage,
    getError,
    handleJsonError
};