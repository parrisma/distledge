/**
 * Format the given details as JSON message that can be posted to NFT Web Server
 * @param {*} optionTermsAsJson - The Option terms
 * @param {*} command - The POST command to perform as defined in require("@webserver/serverResponse")
 * @returns optionTerms create request JSON 
 */
function formatOptionTermsMessage(
    optionTermsAsJson,
    command
) {
    var optionTermsMessage =
    {
        "command": `${command}`,
        "terms": {}
    }
    optionTermsMessage.terms = optionTermsAsJson
    return optionTermsMessage
};

module.exports = {
    formatOptionTermsMessage,
}