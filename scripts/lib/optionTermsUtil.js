/**
 * Format the given details as JSON message that can be posted to NFT Web Server
 * @param {*} optionTermsAsJson - The Option terms
 * @returns optionTerms create request JSON 
 */
function formatOptionTermsMessage(
    optionTermsAsJson
) {
    var optionTermsMessage =
    {
        "command": "create",
        "terms": {}
    }
    optionTermsMessage.terms = optionTermsAsJson
    return optionTermsMessage
};

module.exports = {
    formatOptionTermsMessage,
}