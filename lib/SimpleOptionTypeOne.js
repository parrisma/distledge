const OPTION_TYPE_ONE = "TypeOneOption";

/**
 * Return a JSON object for a Type One Option With the given terms.
 * @param {*} uniqueId - A unique Id as string
 * @param {*} optionName  - A short name for the Option
 * @param {*} description - A description of the option
 * @param {*} premium - The premium amount to be paid in the premium token
 * @param {*} premiumToken - The deployed contract address of the ERC20 premium token
 * @param {*} settlementToken - The deployed contract address of the ERC20 settlementToken
 * @param {*} notional - The option notional
 * @param {*} strike - The Option strike with respect to the reference level
 * @param {*} referenceLevel - The address of the deployed contract reference level
 * @param {*} fxReferenceLevel - The address of the deployed fx contract level (premium to settlement)
 */
function formatOptionTypeOneTerms(
    uniqueId,
    optionName,
    description,
    premium,
    premiumToken,
    settlementToken,
    notional,
    strike,
    referenceLevel,
    fxReferenceLevel
) {
    return {
        "type": `${OPTION_TYPE_ONE}`,
        "uniqueId": `${uniqueId}`,
        "optionName": `${optionName}`,
        "description": `${description}`,
        "premium": `${premium}`,
        "premiumToken": `${premiumToken}`,
        "settlementToken": `${settlementToken}`,
        "notional": `${notional}`,
        "strike": `${strike}`,
        "referenceLevel": `${referenceLevel}`,
        "fxReferenceLevel": `${fxReferenceLevel}`
    };
}

async function valueSimpleOptionTypeOne(
    optionTypeOneTermsAsJson,
    contractDict
) {
    const notional = Number(optionTypeOneTermsAsJson.notional);
    const strike = Number(optionTypeOneTermsAsJson.strike);
    
    const referenceLevelContract = contractDict[optionTypeOneTermsAsJson.referenceLevel]; // Get secure value from on-chain
    const referenceLevelDecimals = 10 ** Number(await await referenceLevelContract.getDecimals());
    const referenceLevel = Number(await referenceLevelContract.getVerifiedValue()) / referenceLevelDecimals;

    console.log(`Verified Ref Level:[${referenceLevel}]`)

    var value = undefined;
    if (strike > referenceLevel) {
        value = 0.0;
    } else {
        value = (notional * (referenceLevel - strike));
    }

    return {
        "value": `${value}`,
        "parameters": {
            "notional": `${notional}`,
            "strike": `${strike}`,
            "referenceLevel": `${referenceLevel}`,
        },
        "terms": optionTypeOneTermsAsJson
    };
}

module.exports = {
    formatOptionTypeOneTerms,
    valueSimpleOptionTypeOne,
    OPTION_TYPE_ONE
}