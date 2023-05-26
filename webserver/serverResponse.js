require('module-alias/register'); // npm i --save module-alias
const { json_content } = require("@webserver/utility");
const { OK_DEFUNCT, OK_CREATE_TERMS, OK_PULL_TERMS, OK_LIST_TERMS, OK_PURGE } = require("@webserver/serverResponseCodes");
const { deepCopyJson } = require("@webserver/serverErrors");

const HTTP_GET = "get";
const HTTP_POST = "post";

const COMMAND = "command";

const COMMAND_PULL = "pull";
const COMMAND_CREATE = "create";
const COMMAND_VALUE = "value";
const COMMAND_DEFUNCT = "defunct";
const COMMAND_LIST = "list";
const COMMAND_PURGE = "purge";
const COMMAND_ICON = "favicon.ico";

var OKDict = {};

OKDict[OK_PURGE] =
{
    "okCode": `${OK_PURGE}`,
    "okMessage": `Handed Purge of all existing Option Terms`
};

OKDict[OK_DEFUNCT] =
{
    "okCode": `${OK_DEFUNCT}`,
    "okMessage": `Handed Defunct`
};

OKDict[OK_PULL_TERMS] =
{
    "okCode": `${OK_PULL_TERMS}`,
    "okMessage": `Handed Pull Terms`
};

OKDict[OK_CREATE_TERMS] =
{
    "okCode": `${OK_CREATE_TERMS}`,
    "okMessage": `Created Option Terms`
};

OKDict[OK_LIST_TERMS] =
{
    "okCode": `${OK_LIST_TERMS}`,
    "okMessage": `Got List of all Option Terms`
};

/**
 * Return OK JSON response message, with option Id
 * 
 * @param {*} OKCode - The success code
 * @param {*} optionId - The Id of the option the success code refers  to
 * @returns 
 */
function getOKWithOptionId(OKCode, optionId) {
    var OKJson = deepCopyJson(OKDict[OKCode]);
    OKJson.optionId = `${optionId}`;
    return OKJson;
}

/**
 * Return OK JSON response message, with option Id & additional custom message
 * 
 * @param {*} OKCode - The success code
 * @param {*} message - Custom message to add to response.
 * @param {*} optionId - The Id of the option the success code refers  to
 * @returns 
 */
function getOKWithMessage(OKCode, message, optionId) {
    var OKJson = deepCopyJson(OKDict[OKCode]);
    OKJson.message = message;
    OKJson.optionId = `${optionId}`;
    return OKJson;
}

/**
 * Return OK JSON response message, with additional custom message
 * 
 * @param {*} OKCode - The success code
 * @param {*} message - Custom message to add to response.
 * @returns 
 */
function getOK(OKCode, message) {
    var OKJson = deepCopyJson(OKDict[OKCode]);
    OKJson.message = message;
    return OKJson;
}


/**
 * Return a 200 (OK) response in <res> with the given Json message
 * 
 * @param {*} JsonOKMessage - The Json message to return
 * @param {*} res - http response
 */
function handleJsonOK(JsonOKMessage, res) {
    console.log(`Handled OK`);
    const okMessage = JSON.stringify(JsonOKMessage);
    res.setHeader("Access-Control-Allow-Origin", "*"); // This would be a risk ina a full production setup
    res.writeHead(200, json_content);
    res.end(okMessage);
}

module.exports = {
    HTTP_GET,
    HTTP_POST,
    COMMAND,
    COMMAND_CREATE,
    COMMAND_DEFUNCT,
    COMMAND_ICON,
    COMMAND_PULL,
    COMMAND_VALUE,
    COMMAND_LIST,
    COMMAND_PURGE,
    getOKWithOptionId,
    getOKWithMessage,
    getOK,
    handleJsonOK
};