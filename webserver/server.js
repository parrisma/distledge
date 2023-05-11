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
** 6) Navigate to http://localhost:8191 (or whatever URL is reported when server starts)
** or .. 
** 7) cd ..\test
** 8) .\createCommand.bat
*/
var fs = require('fs');
var http = require('http');
var path = require('path');
const hre = require("hardhat");
const { serverConfig } = require("./serverConfig.js");
const { addressConfig } = require("../frontend/constants");
const { appMessage } = require("./appMessage.js");
const {
    ERR_DEFUNCT_DNE, ERR_OPTION_ID_NOT_SPECIFIED, ERR_BAD_GET, ERR_BAD_POST, ERR_BAD_HTTP, ERR_BAD_HTTP_CALL,
    getErrorWithOptionIdAsMetaData,
    getErrorWithMessage,
    getError,
    handleJsonError
} = require("./serverErrors");

const {
    HTTP_GET, HTTP_POST, COMMAND_CREATE, COMMAND_DEFUNCT, COMMAND_ICON, COMMAND_PULL,
    COMMAND_VALUE, OK_DEFUNCT, COMMAND_LIST,
    getOKWithOptionId,
    handleJsonOK
} = require("./serverResponse");

const { text_content, isNumeric, optionTermsDirName, getAllTerms } = require("./utility");
const { valuationHandler } = require("./commandValue");
const { createHandler, handlePOSTCreateTermsRequest } = require("./commandCreate");
const { pullHandler } = require("./commandPull");
const { listHandler } = require("./commandList");

/* Process a request to defunct an Option NFT
*/
function defunctHandler(uriParts, res) {
    console.log(`Handle Defunct Request`);
    var optionId = uriParts[2];
    console.log(`[${optionId}]`);
    if (null == optionId || 0 == `${optionId}`.length) {
        handleJsonError(getError(ERR_OPTION_ID_NOT_SPECIFIED), res);
    } else {
        if (fs.existsSync(optionTermsDirName(optionId))) {
            handleJsonOK(getOKWithOptionId(OK_DEFUNCT, optionId), res);
        } else {
            handleJsonError(getErrorWithOptionIdAsMetaData(ERR_DEFUNCT_DNE, optionId), res);
        }
    }
}

/* Return site icon
*/
function handleIcon(res) {
    console.log(`Handle Get favicon`);
    res.setHeader('Content-Type', 'image/x-icon');
    fs.createReadStream(path.join(__dirname, 'icon', 'favicon.png')).pipe(res);
}

/* App main page
*/
function mainPage(res) {
    console.log(`Render main page`);
    res.writeHead(200, text_content);
    res.end(appMessage);
}


/* Handle HTTP GET Requests
*/
function handleMethodGET(req, res) {
    console.log(`Handle GET`);
    try {
        let uriParts = req.url.split("/");
        if (uriParts.length >= 2) {
            var command = uriParts[1].toLowerCase();
            if (0 != command.length) {
                if (isNumeric(command)) {
                    command = COMMAND_PULL;
                }
                switch (command) {
                    case COMMAND_PULL:
                        pullHandler(uriParts, res);
                        break;
                    case COMMAND_CREATE:
                        createHandler(uriParts, res);
                        break;
                    case COMMAND_VALUE:
                        valuationHandler(uriParts, res);
                        break;
                    case COMMAND_DEFUNCT:
                        defunctHandler(uriParts, res);
                        break;
                    case COMMAND_LIST:
                        listHandler(res);
                        break;
                    case COMMAND_ICON:
                        handleIcon(res);
                        break;
                    default:
                        handleJsonError(getErrorWithMessage(ERR_UNKNOWN_COMMAND, command), res);
                        break;
                }
            } else {
                mainPage(res);
            }
        } else {
            mainPage(res);
        }
    } catch (err) {
        handleJsonError(getErrorWithMessage(ERR_BAD_GET, err.message), res)
    }
}

/* Process posted JSON
*/
async function handlePOSTedJson(bodyAsJson, req, res) {
    console.log(bodyAsJson);
    switch (bodyAsJson.command) {
        case COMMAND_CREATE:
            handlePOSTCreateTermsRequest(bodyAsJson, req, res);
            break;
        default:
            handleJsonError(getErrorWithMessage(ERR_BAD_POST, bodyAsJson.command), res);
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
            if (body.length > 1e7) {
                req.connection.destroy();
            }
        });
        req.on('end', async function () {
            let jsonPayload;
            try {
                jsonPayload = JSON.parse(body);
                handlePOSTedJson(jsonPayload, req, res);
            } catch (err) {
                handleJsonError(getErrorWithMessage(ERR_BAD_POST, err.message), res);
            }
        });
    } catch (err) {
        handleJsonError(getErrorWithMessage(ERR_BAD_POST, err.message), res);
    }
}

/* Main request processing
*/
const requestListener = function (req, res) {
    console.log(`Processing request [${req.method}]`);
    try {
        switch (req.method.toLowerCase()) {
            case HTTP_GET:
                handleMethodGET(req, res);
                break;
            case HTTP_POST:
                handleMethodPOST(req, res);
                break;
            default:
                handleJsonError(getErrorWithMessage(ERR_BAD_HTTP, req.method), res);
                break;
        }
    } catch (err) {
        handleJsonError(getErrorWithMessage(ERR_BAD_HTTP_CALL, err.message), res)
    }
}

async function main() {
    /* Start Web Server on port as defined in serverConfig.js
    */
    console.log(`Server Listening on [http://localhost:${serverConfig.port}]`);
    http.createServer(requestListener).listen(serverConfig.port);
}

/* 
*/
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});