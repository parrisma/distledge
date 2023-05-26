/*
** npx hardhat run serverTest.js --network localhost
*/
const { serverConfig } = require("../lib/serverConfig.js");

async function fetchAsync(uri) {
    let response = await fetch(uri);
    let data = await response.json();
    return data;
}

function NFTServerBaseURI() {
    return `http://localhost:${serverConfig.port}`;
}

/* Request a list of existing options from the option NFT Server
*/
export async function getERC721MintedOptionList() {
    var resAsJson;
    try {
        resAsJson = JSON.stringify(await fetchAsync(`${NFTServerBaseURI()}/list`), null, 2);
    } catch (err) {
        resAsJson = { "error": `${err.message}` }
    }
    return resAsJson;
}