require('module-alias/register'); // npm i --save module-alias
const { json_content } = require("@webserver/utility.js");
const {
    ERR_OPTION_ALREADY_EXISTS, ERR_DEFUNCT_DNE, ERR_OPTION_ID_NOT_SPECIFIED, ERR_NOT_IMPLEMENTED, ERR_PURGE,
    ERR_VALUE_OPTION_ID_NONEXISTENT, ERR_FAILED_TO_LOAD_TERMS, ERR_BAD_GET, ERR_UNKNOWN_COMMAND, ERR_OPTION_ID_NON_NUMERIC,
    ERR_BAD_POST, ERR_BAD_HTTP, ERR_BAD_HTTP_CALL, ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST, ERR_FAILED_LIST, ERR_BAD_TERMS,
    ERR_FAILED_PERSIST, ERR_PERSIST_INIT, ERR_FAIL_CREATE, ERR_BAD_PULL, ERR_UNKNOWN_OPTION_TYPE, ERR_BAD_VALUATION
} = require("@webserver/serverErrorCodes.js");
const { guid } = require("@lib/guid");

var errorsDict = {};

errorsDict[ERR_PURGE] =
{
    "errorCode": `${ERR_PURGE}`,
    "errorMessage": `Failed to purge all existing terms`
};

errorsDict[ERR_BAD_TERMS] =
{
    "errorCode": `${ERR_BAD_TERMS}`,
    "errorMessage": `Failed to persist terms as given terms were malformed`
};

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

errorsDict[ERR_FAILED_PERSIST] =
{
    "errorCode": `${ERR_FAILED_PERSIST}`,
    "errorMessage": `Failed to persist option terms`
};

errorsDict[ERR_PERSIST_INIT] =
{
    "errorCode": `${ERR_PERSIST_INIT}`,
    "errorMessage": `Failed to initialize persistence`
};

errorsDict[ERR_FAIL_CREATE] =
{
    "errorCode": `${ERR_FAIL_CREATE}`,
    "errorMessage": `Failed to mint and/or persist option terms`
};

errorsDict[ERR_BAD_PULL] =
{
    "errorCode": `${ERR_BAD_PULL}`,
    "errorMessage": `System error while pulling option terms`
};

errorsDict[ERR_BAD_VALUATION] =
{
    "errorCode": `${ERR_BAD_VALUATION}`,
    "errorMessage": `System error while valuing option terms`
};

errorsDict[ERR_UNKNOWN_OPTION_TYPE] =
{
    "errorCode": `${ERR_UNKNOWN_OPTION_TYPE}`,
    "errorMessage": `Cannot value, unknown option type`
};

/**
 * Deep copy a JSON object
 * 
 * @param {*} jsonToDeepCopy - The JSON object to deep copy.
 * @returns err as a JSON copy of Error
 */
function deepCopyJson(jsonToDeepCopy) {
    if (null !== jsonToDeepCopy & undefined != jsonToDeepCopy) {
        if (jsonToDeepCopy instanceof Error) {
            return JSON.parse(JSON.stringify(jsonToDeepCopy, Object.getOwnPropertyNames(jsonToDeepCopy)));
        } else {
            return JSON.parse(JSON.stringify(jsonToDeepCopy));
        }
    }
    return {};
}

/**
 * Return a Json error object with a specific OptionId field
 * @param {*} errorCode - The error code to return
 * @param {*} optionId - The option Id to include
 * @param {*} err - Optional Error message as Json object that triggered this high level message
 * @returns Error as Json object
 */
function getErrorWithOptionIdAsMetaData(errorCode, optionId, err) {
    var errorJson = deepCopyJson(errorsDict[errorCode]);
    errorJson.optionId = `${optionId}`;
    errorJson.subError = deepCopyJson(err);
    return errorJson;
}

/**
 * Return a Json error object with an additional fully qualified error message
 * @param {*} errorCode - The error code to return
 * @param {*} fullyQualifiedError - The detailed report error as string
 * @param {*} err - Optional Error message as Json object that triggered this high level message
 * @returns Error as Json object
 */
function getFullyQualifiedError(errorCode, fullyQualifiedError, err) {
    var errorJson = deepCopyJson(errorsDict[errorCode]);
    errorJson.fullyQualifiedError = `${fullyQualifiedError}`;
    let errCpy = deepCopyJson(err);
    errorJson.subError = errCpy;
    return errorJson;
}

/**
 * Return a Json error matching error code.
 * @param {*} errorCode - The error code to return
 * @param {*} err - Optional Error message as Json object that triggered this high level message
 * @returns Error as Json object
 */
function getError(errorCode, err) {
    var errorJson = deepCopyJson(errorsDict[errorCode]);
    errorJson.subError = deepCopyJson(err);
    return errorJson;
}

/**
 * Return a Json error matching error code.
 * @param {*} errorCode - The error code to return
 * @param {*} message - Message to override standard error message associated with error code.
 * @param {*} err - Optional Error message as Json object that triggered this high level message
 * @returns Error as Json object
 */
function getErrorWithMessage(errorCode, message, err) {
    var errorJson = deepCopyJson(errorsDict[errorCode]);
    errorJson.message = `${message}`;
    errorJson.subError = deepCopyJson(err);
    return errorJson;
}

/**
 * Return a Json error response.
 * @param {*} JsonErrorMessage - The error message as Json
 * @param {*} res - http response
 */
function handleJsonError(JsonErrorMessage, res) {
    const errorMessage = JSON.stringify(JsonErrorMessage);
    console.log(`Handle error [${errorMessage}]`);
    res.setHeader("Access-Control-Allow-Origin", "*"); // This would be a risk in a full production setup
    res.setHeader("Access-Control-Allow-Methods", "POST, GET");
    res.writeHead(400, json_content);
    res.end(errorMessage);
}

module.exports = {
    getErrorWithOptionIdAsMetaData,
    getErrorWithMessage,
    getError,
    handleJsonError,
    getFullyQualifiedError,
    deepCopyJson
};