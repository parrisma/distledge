const ERR_OPTION_ALREADY_EXISTS = "442ff1f3-e59c-4290-acbc-01acbcaba3c0";
const ERR_DEFUNCT_DNE = "94d9d3b9-3eff-488a-afae-cf23954185f1";

var errorsDict = {};

errorsDict[ERR_OPTION_ALREADY_EXISTS] =
{
    "errorCode": `${ERR_OPTION_ALREADY_EXISTS}`,
    "errorMessage": `Failed to pull terms as Option Contract does not exists`
};

errorsDict[ERR_DEFUNCT_DNE] =
{
    "errorCode": `${ERR_DEFUNCT_DNE}`,
    "errorMessage": `Failed to defunct Option Contract terms as terms do not exist`
};

function getErrorWithOptionIdAsMetaData(errorCode, optionId) {
    errorJson = errorsDict[errorCode];
    errorJson.optionId = `${optionId}`;
    return errorJson;
}

function getError(errorCode) {
    errorJson = errorsDict[errorCode];
    return errorJson;
}

module.exports = {
    ERR_OPTION_ALREADY_EXISTS,
    ERR_DEFUNCT_DNE,
    getErrorWithOptionIdAsMetaData,
    getError
};