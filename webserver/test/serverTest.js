const { getOwnerAccount } = require("../accounts");
var crypto = require('crypto');

async function fetchAsync(uri) {
    let response = await fetch(uri);
    let data = await response.json();
    return data;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function guid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function NFTServerBaseURI() {
    return "http://localhost:8191";
}

/* Request a list of existing options from the option NFT Server
*/
async function getOptionList() {
    var resAsJson;
    try {
        resAsJson = JSON.stringify(await fetchAsync(`${NFTServerBaseURI()}/list`), null, 2);
    } catch (err) {
        resAsJson = { "error": `${err.message}` }
    }
    return resAsJson;
}

/* Request the terms of a specific option by Id
*/
async function getOptionById(optionId) {
    var resAsJson;
    try {
        resAsJson = JSON.stringify(await fetchAsync(`${NFTServerBaseURI()}/${optionId}`), null, 2);
    } catch (err) {
        resAsJson = { "error": `${err.message}` }
    }
    return resAsJson;
}

/* Persist an option of teh given terms on the 
*/
async function persistOption(optionId,
    signature,
    signedByAccount) {

    var optionToPersistAsJson =
    {
        "command": "create",
        "id": `${optionId}`,
        "signature": `${signature}`,
        "signedBy": `${signedByAccount}`,
        "terms": {
            "term_one": `Term One Value - ${optionId}`,
            "term_two": Math.floor(Math.random() * 10000),
            "term_three": {
                "term_four": `${guid()}`,
                "term_five": Math.floor(Math.random() * 1e10)
            }
        }
    };

    const rawResponse = await fetch(`${NFTServerBaseURI()}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(optionToPersistAsJson)
    });
    const content = await rawResponse.json();

    console.log(content);
}

async function main() {
    for (let step = 3; step < 100; step++) {
        console.log(persistOption(step, `${Math.random() * 1e15}`, await getOwnerAccount()).address);
    }
    //console.log(`\nGet List     :\n${await getOptionList()}\n`);
    //console.log(`\nGet Option 1 :\n${await getOptionById(1)}\n`);
    await sleep(2500);
    for (let step = 3; step < 100; step++) {
        console.log(`\nGet Option 3 :\n${await getOptionById(step)}\n`);
    }
}

/* 
*/
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});