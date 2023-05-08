/*
** Quick and Dirty HttP WebServer to support the ERC271 Option NFT's
** 
** To run me
** 0) cd distledge
** 1) npx hardhat node
** 2) npx hardhat run --network localhost scripts\deploy\deploy.js
** 3) yarn hardhat run ./scripts/exportToFrontEnd/updateFrontEnd.js --network localhost
** 4) cd webserver
** 5) npx hardhat run --network localhost server.js
**
** 6) Navigate to http://localhost:8191
** or .. 
** 7) cd ..\test
** 8) .\createCommand.bat
*/
var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
const crypto = require("crypto");
const hre = require("hardhat");
const { ethers } = require("hardhat");
const { serverConfig } = require("./serverConfig.js");
const { addressConfig } = require("../frontend/constants");

/* Text Content Type
*/
const text_content = { 'Content-Type': 'text/html' };

/*  Accounts from Test network
*/
let owner;
let traderOne;
let traderTwo;

/* True if [value] is a positive integer
*/
function isNumeric(value) {
    return /^\d+$/.test(value);
}

/* The directory where the Option terms are stored
*/
function optionTermsDirName(optionId) {
    return path.join(__dirname, `terms`, `${optionId}`);
}

/* The full path and name of option terms
*/
async function fullPathAndNameOfOptionTermsJson(optionTermsDirName,
    termsAsJson,
    signingAccount) {
    const sig = await getSignedHashOfOptionTerms(termsAsJson, signingAccount);
    return [sig, path.join(optionTermsDirName, `${sig}.json`)];
}

/* Process a request to defunct an Option NFT
*/
function defunctHandler(uriParts, res) {
    console.log(`Handle Defunct Request`);
    const optionId = uriParts[2];
    if (fs.existsSync(optionTermsDirName(optionId))) {
        res.writeHead(200, text_content);
        res.end(`Handled Defunct`);
    } else {
        handleError(`Failed to defunct as Option Contract terms [${optionId}] does not exists`, res);
    }
}

/* Process a request to create an Option NFT
*/
function createHandler(uriParts, res) {
    console.log(`Handle Create Request`);
    const optionId = uriParts[2];
    if (!fs.existsSync(optionTermsDirName(optionId))) {
        res.writeHead(200,);
        res.end(`Handled Create`);
    } else {
        handleError(`Failed to create as Option Contract terms [${optionId}] already exists`, res);
    }
}

/* Process a request to get an Option NFT terms
*/
function getHandler(uriParts, res) {
    console.log(`Handle Get Terms Request`);
    const optionId = uriParts[1];
    if (fs.existsSync(optionTermsDirName(optionId))) {
        res.writeHead(200, text_content);
        res.end(`Handled Get`);
    } else {
        handleError(`Failed to pull terms as Option Contract [${optionId}] does not exists`, res);
    }
}

/* Return site icon
*/
function handleIcon(res) {
    console.log(`Handle Get favicon`);
    res.setHeader('Content-Type', 'image/x-icon');
    fs.createReadStream(path.join(__dirname, 'icon', 'favicon.png')).pipe(res);
}

/* Return an error response.
*/
function handleError(errorMessage, res) {
    console.log(`Handle error [${errorMessage}]`);
    res.writeHead(400, text_content);
    res.end(errorMessage);
}

/* Handle HTTP GET Requests
*/
function handleMethodGET(req, res) {
    console.log(`Handle GET`);
    try {
        let uriParts = req.url.split("/");
        if (uriParts.length >= 2) {
            var command = uriParts[1].toLowerCase();
            if (command != ``) {
                if (isNumeric(command)) {
                    command = "pull"
                }
                switch (command) {
                    case "pull":
                        getHandler(uriParts, res);
                        break;
                    case "create":
                        createHandler(uriParts, res);
                        break;
                    case "defunct":
                        defunctHandler(uriParts, res);
                        break;
                    case "favicon.ico":
                        handleIcon(res);
                        break;
                    default:
                        handleError(`Unknown command [${command}]`, res);
                        break;
                }
            } else {
                handleError(`Empty request, cannot process`, res);
            }
        } else {
            handleError(`Empty request, cannot process`, res);
        }
    } catch (err) {
        handleError(`Bad GET request, cannot process [${err.message}]`, res)
    }
}


/*
** Take Json object and return signature of terms.
*/
async function getSignedHashOfOptionTerms(terms, signingAccount) {
    const secretMessage = ethers.utils.solidityPack(["string"], [JSON.stringify(terms)]);

    /* We now hash the message, and we will sign the hash of the message rather than the raw
    ** raw encoded (packed) message
    */
    const secretMessageHash = ethers.utils.keccak256(secretMessage);

    /*
    ** The message is now signed by the signingAccount
    */
    const sig = await signingAccount.signMessage(ethers.utils.arrayify(secretMessageHash)); // Don't forget to arrayify to send bytes

    return sig;
}

/**
 * Write the option terms to a file
 */
async function writeOptionTerms(optionTermsDirName, termsAsJson, req, res) {
    fs.mkdirSync(optionTermsDirName);
    const [sig, optionTermsFileName] = await fullPathAndNameOfOptionTermsJson(optionTermsDirName, termsAsJson, owner);
    fs.writeFile(optionTermsFileName, JSON.stringify(termsAsJson.terms), function (err) {
        if (err) {
            console.log(`Failed to write option Terms file [${optionTermsFileName}] with Error [${err}]`);
            throw err;
        } else {
            console.log(`Option Terms written Ok to [${optionTermsDirName}]`);
            res.writeHead(200,);
            res.end(`Handle Create of terms [${sig}]`);
        }
    });
}

/* Handle POST Create request
*/
async function handlePOSTCreateTermsRequest(termsAsJson, req, res) {
    console.log(`Handle POST Create Terms Request for Id [${termsAsJson.id}]`);
    const optionId = termsAsJson.id;
    if (isNumeric(optionId)) {
        if (!fs.existsSync(optionTermsDirName(optionId))) {
            await writeOptionTerms(optionTermsDirName(optionId), termsAsJson, req, res);
        } else {
            handleError(`Failed to create as Option Contract terms [${optionId}] already exists`, res);
        }
    } else {
        handleError(`Option Id must be numeric for POSt Create Terms, but given [${optionId}] already exists`, res);
    }
}

/* Process posted JSON
*/
async function handlePOSTedJson(bodyAsJson, req, res) {
    console.log(bodyAsJson);
    switch (bodyAsJson.command) {
        case "create":
            handlePOSTCreateTermsRequest(bodyAsJson, req, res);
            break;
        default:
            handleError(`Bad POST command, cannot process [${bodyAsJson.command}]`, res)
            break
    }
}

/* Handle HTTP POST Requests
*/
async function handleMethodPOST(req, res) {
    try {
        console.log(`Handle POST`);
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6) {
                req.connection.destroy();
            }
        });
        req.on('end', async function () {
            let jsonPayload;
            try {
                jsonPayload = JSON.parse(body);
                handlePOSTedJson(jsonPayload, req, res);
            } catch (err) {
                handleError(`Bad POST request, cannot process JSON payload [${err.message}]`, res)
            }
        });
    } catch (err) {
        handleError(`Bad POST request, cannot process [${err.message}]`, res)
    }
}

/* Main request processing
*/
const requestListener = function (req, res) {
    console.log(`Processing request [${req.method}]`);
    try {
        switch (req.method.toLowerCase()) {
            case "get":
                handleMethodGET(req, res);
                break;
            case "post":
                handleMethodPOST(req, res);
                break;
            default:
                handleError(`Unknown http method [${req.method}]`, res);
                break;
        }
    } catch (err) {
        handleError(`Bad method request, cannot process [${err.message}]`, res)
    }
}

async function main() {
    /* Start Web Server on port as defined in serverConfig.js
    */
    console.log(`Server Listening on [http://localhost:${serverConfig.port}]`);
    [owner, traderOne, traderTwo] = await ethers.getSigners();
    http.createServer(requestListener).listen(serverConfig.port);
}

/* 
*/
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});