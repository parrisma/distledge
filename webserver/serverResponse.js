const { json_content } = require("./utility.js");

const HTTP_GET = "get";
const HTTP_POST = "post";

const COMMAND_PULL = "pull";
const COMMAND_CREATE = "create";
const COMMAND_VALUE = "value";
const COMMAND_DEFUNCT = "defunct";
const COMMAND_LIST = "list";
const COMMAND_ICON = "favicon.ico";

const OK_DEFUNCT = "7cbfbcb4-d188-4b84-98fd-c45b5e9c95e3";
const OK_PULL_TERMS = "3e856ee3-331d-4e73-86b4-0519329b6f14";
const OK_CREATE_TERMS = "2bdadc94-5a32-45d2-b90a-ee5ff4f5ee58";
const OK_LIST_TERMS = "c8e1d29f-b1e3-4186-89a4-df3508f13b42";

var OKDict = {};

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

function getOKWithOptionId(OKCode, optionId) {
    var OKJson = OKDict[OKCode];
    OKJson.optionId = `${optionId}`;
    return OKJson;
}

function getOKWithMessage(OKCode, message, optionId) {
    var OKJson = OKDict[OKCode];
    OKJson.message = message;
    OKJson.optionId = `${optionId}`;
    return OKJson;
}

function getOK(OKCode, message) {
    var OKJson = OKDict[OKCode];
    OKJson.message = `${message}`;
    return OKJson;
}


/* Return a Json OK response.
*/
function handleJsonOK(JsonOKMessage, res) {
    console.log(`Handled OK`);
    const okMessage = JSON.stringify(JsonOKMessage);
    res.writeHead(200, json_content);
    res.end(okMessage);
}

module.exports = {
    HTTP_GET,
    HTTP_POST,
    COMMAND_CREATE,
    COMMAND_DEFUNCT,
    COMMAND_ICON,
    COMMAND_PULL,
    COMMAND_VALUE,
    COMMAND_LIST,
    OK_DEFUNCT,
    OK_CREATE_TERMS,
    OK_PULL_TERMS,
    OK_LIST_TERMS,
    getOKWithOptionId,
    getOKWithMessage,
    getOK,
    handleJsonOK
};