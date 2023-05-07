var fs = require('fs');
var http = require('http');
var url = require('url');
const crypto = require("crypto");
const hre = require("hardhat");
const { ethers } = require("hardhat");
const { serverConfig } = require("./serverConfig.js");

function isNumeric(value) {
    return /^\d+$/.test(value);
}

/* Process a request to defunct an Option NFT
*/
function defunctHandler(uriParts, res) {
    console.log(`Handle Defunct Request`);
    const optionId = uriParts[2];
    if (fs.existsSync(`./${optionId}`)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`Handle Defunct`);
    } else {
        handleError(`Failed to defunct as Option Contract [${optionId}] does not exists`, res);
    }
}

/* Process a request to create an Option NFT
*/
function createHandler(uriParts, res) {
    console.log(`Handle Create Request`);
    const optionId = uriParts[2];
    if (!fs.existsSync(`./${optionId}`)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`Handle Create`);
    } else {
        handleError(`Failed to create as Option Contract [${optionId}] already exists`, res);
    }
}

/* Process a request to get an Option NFT terms
*/
function getHandler(uriParts, res) {
    console.log(`Handle Get Terms Request`);
    const optionId = uriParts[1];
    if (fs.existsSync(`./${optionId}`)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`Handle Get`);
    } else {
        handleError(`Failed to get as Option Contract [${optionId}] does not exists`, res);
    }
}

/* Return an error response.
*/
function handleError(errorMessage, res) {
    console.log(`Handle error [${errorMessage}]`);
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(errorMessage);
}


/* Main request processing
*/
const requestListener = function (req, res) {
    console.log(`Processing request [${req.url}]`);
    try {
        let uriParts = req.url.split("/");
        console.log(uriParts);
        if (uriParts.length >= 2) {
            var command = uriParts[1].toLowerCase();
            if (command != ``) {
                if (isNumeric(command)) {
                    command = "get"
                }
                switch (command) {
                    case "get":
                        getHandler(uriParts, res);
                        break;
                    case "create":
                        createHandler(uriParts, res);
                        break;
                    case "defunct":
                        defunctHandler(uriParts, res);
                        break;
                    case "favicon.ico":
                        break;
                    default:
                        handleError(`Unknown command [${command}]`);
                        break;
                }
            } else {
                handleError(`Empty request, cannot process`, res);
            }
        } else {
            handleError(`Empty request, cannot process`, res);
        }
    } catch (err) {
        handleError(`Bad request, cannot process [${err.message}]`, res)
    }
}

async function main() {
    /* Start Web Server on port 8191
    */
    console.log("Here");
    http.createServer(requestListener).listen(serverConfig.port);
}

/* 
*/
main().catch((error) => {
    console.log(`Starting Option NFT Server on port [${serverConfig.port}]`);
    console.error(error);
    process.exitCode = 1;
    console.log("Stopped Option NFT Server");
});