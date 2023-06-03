import { formatOptionTermsMessage } from "./optionTermsUtil";
import { NFTServerBaseURI } from "./ERC721Util";

export async function sendCreateOptionRequest(optionTermsAsJson){    
    
    var optionToPersistAsJson = formatOptionTermsMessage(optionTermsAsJson, 'create');            
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