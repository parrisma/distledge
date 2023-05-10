const { json_content } = require("./utility.js");

const ERR_OPTION_ALREADY_EXISTS = "442ff1f3-e59c-4290-acbc-01acbcaba3c0";
const ERR_DEFUNCT_DNE = "94d9d3b9-3eff-488a-afae-cf23954185f1";
const ERR_CREATE_ONLY_BY_POST = "e9719b46-24bb-43f3-96dc-990f3ca8949e";
const ERR_OPTION_ID_NOT_SPECIFIED = "c47a1a75-c767-4c5b-952f-4531bb119e5d";
const ERR_NOT_IMPLEMENTED = "c6564ecf-e6f2-480a-8a97-eaa1abf152ba";
const ERR_VALUE_OPTION_ID_NONEXISTENT = "e7703a1f-0c45-4121-821d-057479f5eca7";
const ERR_FAILED_TO_LOAD_TERMS = "ada0049b-33c6-47a2-8a36-a2f3f87acddf";
const ERR_BAD_GET = "d65ede1e-7913-4b42-a0fd-11c6784e0793";
const ERR_UNKNOWN_COMMAND = "d6bc19e8-b857-4931-86d3-76e3cf8d38e3";
const ERR_OPTION_ID_NON_NUMERIC = "e93b00b2-ddd8-46cb-ad4d-abf10d2d97e3";
const ERR_BAD_POST = "4afb0e49-bd12-43b9-8a7e-9a2e1039ae2e";
const ERR_BAD_HTTP = "a2f1274f-2782-4a12-9d96-822743f8fa72";
const ERR_BAD_HTTP_CALL = "a91e7ade-1224-4699-b5cb-a97824479cc3";
const ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST = "587ab271-2366-44d8-a507-adc08b99cd8f";

var errorsDict = {};

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

errorsDict[ERR_CREATE_ONLY_BY_POST] =
{
    "errorCode": `${ERR_CREATE_ONLY_BY_POST}`,
    "errorMessage": `Create Option terms only supported as POST operation`
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
    "errorMessage": `Bad GET request, cannot process`
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
    ERR_OPTION_ALREADY_EXISTS,
    ERR_DEFUNCT_DNE,
    ERR_CREATE_ONLY_BY_POST,
    ERR_OPTION_ID_NOT_SPECIFIED,
    ERR_NOT_IMPLEMENTED,
    ERR_VALUE_OPTION_ID_NONEXISTENT,
    ERR_FAILED_TO_LOAD_TERMS,
    ERR_BAD_GET,
    ERR_UNKNOWN_COMMAND,
    ERR_OPTION_ID_NON_NUMERIC,
    ERR_BAD_POST,
    ERR_BAD_HTTP,
    ERR_BAD_HTTP_CALL,
    ERR_BAD_PULL_OPTION_ID_DOES_NOT_EXIST,
    getErrorWithOptionIdAsMetaData,
    getErrorWithMessage,
    getError,
    handleJsonError
};