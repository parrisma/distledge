/**
 * Format the given details as JSON message that can be posted to NFT Web Server
 * @param {*} optionTermsAsJson - The Option terms
 * @param {*} command - The POST command to perform as defined in require("@webserver/serverResponse")
 * @param {*} buyerAccount - The account that is buying the Option
 * @returns optionTerms create request JSON 
 */
function formatOptionTermsMessage(
    optionTermsAsJson,
    command,
    buyerAccount
) {
    var optionTermsMessage =
    {
        "command": `${command}`,
        "buyerAccount": `${buyerAccount}`,
        "terms": {}
    }
    optionTermsMessage.terms = optionTermsAsJson
    return optionTermsMessage
};

module.exports = {
    formatOptionTermsMessage,
}