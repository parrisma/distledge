require('module-alias/register'); // npm i --save module-alias
const {
    getFullyQualifiedError,
    getErrorWithOptionIdAsMetaData,
    getError,
    handleJsonError
} = require("@webserver/serverErrors");
const {
    getOKWithMessage,
    getOK,
    handleJsonOK
} = require("@webserver/serverResponse.js");
const {
    ERR_OPTION_ID_NOT_SPECIFIED, ERR_VALUE_OPTION_ID_NONEXISTENT, ERR_UNKNOWN_OPTION_TYPE, ERR_BAD_VALUATION, ERR_BAD_TERMS
} = require("./serverErrorCodes.js");
const {
    OK_VALUE
} = require("@webserver/serverResponseCodes");
const { OPTION_TYPE_ONE } = require("@lib/SimpleOptionTypeOne");
const { persistOptionIdExists, persistGetOptionTerms } = require("@webserver/serverPersist");
const { valueSimpleOptionTypeOne } = require("@lib/simpleOptionTypeOne");

/**
 * Value the option terms as given
 * @param {*} optionTermsAsJson - Option Terms as JSON to be valued
 * @param {*} contractDict - The dictionary (index by contract address) of all deployed contracts
 * @returns A Json response containing the full valuation.
 */
async function valueOptionTerms(optionTermsAsJson, contractDict) {
    var valuationResponse = undefined;
    try {
        const optionType = optionTermsAsJson.type
        switch (optionType) {
            case OPTION_TYPE_ONE:
                valuationResponse = await valueSimpleOptionTypeOne(optionTermsAsJson, contractDict)
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
 * @param {*} contractDict - The dictionary (index by contract address) of all deployed contracts
 * @param {*} res - http response
 */
async function valuationHandler(
    uriParts,
    contractDict,
    res) {
    console.log(`Handle Valuation Request`);
    try {
        const optionId = uriParts[2];
        if (null == optionId || 0 == `${optionId}`.length) {
            handleJsonError(getError(ERR_OPTION_ID_NOT_SPECIFIED), res);
        } else {
            if (await persistOptionIdExists(optionId)) {
                const [optionTermsAsJson, hashOfTerms] = await persistGetOptionTerms(optionId);
                const responseMessage = await valueOptionTerms(optionTermsAsJson, contractDict);
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

/**
 * Value the given option NFT
 * 
 * @param {*} termsAsJson - The option terms as a Json object to be valued
 * @param {*} managerAccount - The manager account to sign the terms
 * @param {*} contractDict - the dictionary of all required and deployed utility contracts 
 * @param {*} req - http request
 * @param {*} res - http response
 */
async function valueOptionNFT(
    termsAsJson,
    managerAccount,
    contractDict,
    req, res) {
    try {
        if (termsAsJson.hasOwnProperty("terms") && termsAsJson.terms.hasOwnProperty("uniqueId")) {
            const optionTerms = termsAsJson.terms;
            const responseMessage = await valueOptionTerms(optionTerms, contractDict);
            console.log(`Post Val resp [${JSON.stringify(responseMessage, null, 2)}]`);
            handleJsonOK(getOK(OK_VALUE, responseMessage), res);
        } else {
            handleJsonError(getError(ERR_BAD_TERMS), res);
        }
    } catch (err) {
        throw getFullyQualifiedError(
            ERR_BAD_VALUATION,
            `Value Handler, failed to value given option terms`,
            err);
    }
}

/**
 * Handle POST Value request
 * 
 * @param {*} termsAsJson - The option terms to be valued as Json object
 * @param {*} signingAccount - The managing account
 * @param {*} contractDict - the dictionary of all required and deployed utility contracts 
 * @param {*} req - http request
 * @param {*} res - http response
 */
async function handlePOSTValueTermsRequest(
    termsAsJson,
    signingAccount,
    contractDict,
    req, res) {
    console.log(`Handle POST Value Terms Request for Id [${termsAsJson.id}]`);
    await valueOptionNFT(termsAsJson, signingAccount, contractDict, req, res);
    console.log(`Post Val Done`);
}

module.exports = {
    valuationHandler,
    handlePOSTValueTermsRequest
}