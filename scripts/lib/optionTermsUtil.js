/**
 * Format the given details as JSON message that can be posted to NFT Web Server
 * @param {*} optionId - The unique NFT Option Id
 * @param {*} optionTermsAsJson - The Option terms
 * @param {*} signature - The account (normally) buyer that has signed the terms for later verification
 * @param {*} signedByAccount - The account (address) that has signed the terms
 * @returns 
 */
function formatOptionTermsMessage(
    optionId,
    optionTermsAsJson,
    signature,
    signedByAccount
) {
    var optionTermsMessage =
    {
        "command": "create",
        "id": `${optionId}`,
        "signature": `${signature}`,
        "signedBy": `${signedByAccount}`,
        "terms": {}
    }
    optionTermsMessage.terms = optionTermsAsJson
    return optionTermsMessage
};

module.exports = {
    formatOptionTermsMessage,
}