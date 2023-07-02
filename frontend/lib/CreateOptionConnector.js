import { formatOptionTermsMessage } from "./optionTermsUtil";
import { NFTServerBaseURI } from "./ERC721Util";

/**
 * Send a request to WebServer to create an option of the given terms.
 * 
 * @param {*} optionTermsAsJson - The options terms as JSON (contains seller details)
 * @param {*} buyerAddress - The address of the buyer to whom the option will be transferred
 * @returns 
 */
export async function sendCreateOptionRequest(optionTermsAsJson, buyerAddress) {

    var optionToPersistAsJson = formatOptionTermsMessage(optionTermsAsJson, 'create', buyerAddress);
    console.log(optionToPersistAsJson);

    const rawResponse = await fetch(`${NFTServerBaseURI()}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(optionToPersistAsJson)
    });
    return await rawResponse.json();
}

export async function sendBuyOptionRequest(optionTermsAsJson, buyerAddress) {

    var optionToPersistAsJson = formatOptionTermsMessage(optionTermsAsJson, 'buy', buyerAddress);
    console.log(optionToPersistAsJson);

    const rawResponse = await fetch(`${NFTServerBaseURI()}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(optionToPersistAsJson)
    });
    return await rawResponse.json();
}