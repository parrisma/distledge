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
require('module-alias/register'); // npm i --save module-alias
var fs = require('fs');
var http = require('http');
var path = require('path');
const { serverConfig } = require("./serverConfig.js");
const { appMessage } = require("./appMessage.js");
const {
    getErrorWithMessage,
    handleJsonError
} = require("./serverErrors");
const {
    ERR_BAD_GET, ERR_UNKNOWN_COMMAND, ERR_BAD_POST, ERR_BAD_HTTP, ERR_BAD_HTTP_CALL
} = require("./serverErrorCodes.js");

const {
    HTTP_GET, HTTP_POST, COMMAND_CREATE, COMMAND_DEFUNCT, COMMAND_ICON, COMMAND_PULL,
    COMMAND_VALUE, COMMAND_LIST, COMMAND_PURGE, COMMAND
} = require("./serverResponse");
const { namedAccounts } = require("@scripts/lib/accounts");
const { addressConfig } = require("./constants");
var managerAccount;

const { text_content, isNumeric, currentDateTime } = require("./utility");
const { valuationHandler } = require("./commandValue");
const { handlePOSTCreateTermsRequest } = require("./commandCreate");
const { pullHandler } = require("./commandPull");
const { listHandler } = require("./commandList");
const { defunctHandler } = require("./commandDefunct");
const { purgeHandler } = require("@webserver/commandPurge");


/**
 * Return the site icon
 * 
 * @param {*} res - http response to return icon via
 */
function handleIcon(res) {
    console.log(`Handle Get favicon`);
    res.setHeader('Content-Type', 'image/x-icon');
    fs.createReadStream(path.join(__dirname, 'icon', 'favicon.png')).pipe(res);
}

/**
 * Respond with main (help) page for server as html
 * 
 * @param {*} res - http response 
 */
function mainPage(res) {
    console.log(`Render main page`);
    res.writeHead(200, text_content);
    res.end(appMessage);
}


/**
 * Handle HTTP GET Requests
 * 
 * @param {*} mgrAccount - the manager account used to handle the requests on chain and in storage
 * @param {*} req - http request
 * @param {*} res - http response
 */
function handleMethodGET(
    mgrAccount,
    req, res) {
    console.log(`${currentDateTime()} : Handle GET`);
    try {
        let uriParts = req.url.split("/");
        if (uriParts.length >= 2) {
            var command = uriParts[1].toLowerCase();
            if (0 != command.length) {
                if (isNumeric(command)) {
                    command = COMMAND_PULL;
                    console.log(`PARTS1: [${uriParts}]`);
                    uriParts.shift();
                    uriParts.unshift(``, COMMAND_PULL);
                }
                console.log(`PARTS2: [${uriParts}]`);
                switch (command) {
                    case COMMAND_PULL:
                        pullHandler(uriParts, res);
                        break;
                    case COMMAND_VALUE:
                        valuationHandler(uriParts, res);
                        break;
                    case COMMAND_DEFUNCT:
                        defunctHandler(uriParts, res);
                        break;
                    case COMMAND_PURGE:
                        purgeHandler(res);
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

/**
 * Process JSON document when posted to server
 * 
 * @param {*} mgrAccount - the manager account used to handle the requests on chain and in storage
 * @param {*} bodyAsJson - the Json body to process as Json object
 * @param {*} req - http request
 * @param {*} res - http response
 */
async function handlePOSTedJson(
    mgrAccount,
    bodyAsJson,
    req, res) {
    console.log(`Post Message received : \n ${JSON.stringify(bodyAsJson, null, 2)}`);
    console.log(`Manager Account: ${mgrAccount}`);
    if (bodyAsJson.hasOwnProperty(COMMAND)) { // Json must include a command type.
        switch (bodyAsJson.command) {
            case COMMAND_CREATE:
                handlePOSTCreateTermsRequest(bodyAsJson, managerAccount, req, res);
                break;
            default:
                handleJsonError(getErrorWithMessage(ERR_BAD_POST, bodyAsJson.command), res);
                break
        }
    } else {
        handleJsonError(getErrorWithMessage(ERR_BAD_POST, "missing command"), res);
    }
}

/**
 * Handle and delegate http Post requests 
 * @param {*} mgrAccount - the manager account used to handle the requests on chain and in storage
 * @param {*} req - http request
 * @param {*} res - http response
 */
async function handleMethodPOST(
    mgrAccount,
    req, res) {
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
                handlePOSTedJson(mgrAccount, jsonPayload, req, res);
            } catch (err) {
                handleJsonError(getErrorWithMessage(ERR_BAD_POST, err.message), res);
            }
        });
    } catch (err) {
        handleJsonError(getErrorWithMessage(ERR_BAD_POST, err.message), res);
    }
}

/**
 * Delegate http GET and POST requests
 * @param {*} req - http request
 * @param {*} res - http response
 */
const requestListener = function (req, res) {
    console.log(`Processing request [${req.method}]`);
    try {
        switch (req.method.toLowerCase()) {
            case HTTP_GET:
                handleMethodGET(managerAccount, req, res);
                break;
            case HTTP_POST:
                handleMethodPOST(managerAccount, req, res);
                break;
            default:
                handleJsonError(getErrorWithMessage(ERR_BAD_HTTP, req.method), res);
                break;
        }
    } catch (err) {
        handleJsonError(getErrorWithMessage(ERR_BAD_HTTP_CALL, err.message), res)
    }
}

/**
 * Master processing function.
 */
async function main() {
    /* Start Web Server on port as defined in serverConfig.js
    */
    [managerAccount] = await namedAccounts(addressConfig); // This is the dApp account we use to perform management functions.
    console.log(`Server Listening on [http://localhost:${serverConfig.port}]`);
    http.createServer(requestListener).listen(serverConfig.port);
}

/* Execute main function
*/
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});