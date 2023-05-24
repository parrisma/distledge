require('module-alias/register'); // npm i --save module-alias
var fs = require('fs');
const {
    getFullyQualifiedError,
    getErrorWithOptionIdAsMetaData,
    getError,
    handleJsonError
} = require("@webserver/serverErrors");
const {
    getOKWithMessage,
    handleJsonOK
} = require("@webserver/serverResponse.js");
const {
    ERR_OPTION_ID_NOT_SPECIFIED, ERR_VALUE_OPTION_ID_NONEXISTENT, ERR_UNKNOWN_OPTION_TYPE, ERR_BAD_VALUATION
} = require("./serverErrorCodes.js");
const {
    OK_VALUE
} = require("@webserver/serverResponseCodes");
const { OPTION_TYPE_ONE } = require("@lib/SimpleOptionTypeOne");
const { persistOptionIdExists, persistGetOptionTerms } = require("@webserver/serverPersist");

/**
 * Value the option terms as given
 * @param {*} optionTermsAsJson - Option Terms as JSON to be valued
 * @returns A Json response containing the full valuation.
 */
async function valueOptionTerms(optionTermsAsJson) {
    var valuationResponse = undefined;
    try {
        const optionType = optionTermsAsJson.type
        switch (optionType) {
            case OPTION_TYPE_ONE:
                valuationResponse = { "ok": `Valued ${optionType}` };
                break;
            default:
                throw getFullyQualifiedError(
                    ERR_UNKNOWN_OPTION_TYPE,
                    `Cannot value, unknown option type [${optionType}]`,
                    err);
                break;
        }
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_BAD_VALUATION,
            `Cannot value, system error [${err.message}]`,
            err);
    }
    return valuationResponse;
}

/**
 * Value the option of the given Id
 * @param {*} uriParts - The constituents of the option URI
 * @param {*} res - http response
 */
async function valuationHandler(uriParts, res) {
    console.log(`Handle Valuation Request`);
    console.log(`URI Parts [${uriParts[2]}]`);
    const optionId = uriParts[2];
    try {
        const optionId = uriParts[2];
        if (null == optionId || 0 == `${optionId}`.length) {
            handleJsonError(getError(ERR_OPTION_ID_NOT_SPECIFIED), res);
        } else {
            if (await persistOptionIdExists(optionId)) {
                const [optionTermsAsJson, hashOfTerms] = await persistGetOptionTerms(optionId);
                const responseMessage = await valueOptionTerms(optionTermsAsJson);
                handleJsonOK(getOKWithMessage(OK_VALUE, responseMessage, optionId), res);
            } else {
                handleJsonError(getErrorWithOptionIdAsMetaData(ERR_VALUE_OPTION_ID_NONEXISTENT, optionId), res);
            }
        }
    } catch (err) {
        // err is a JSON error at this point.
        handleJsonError(err, res);
    }
}

module.exports = {
    valuationHandler
}