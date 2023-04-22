/*
** To run me type 'node web3-deploy.js' in a command window on a machine where a test network has been launched locally on default port 8545
** and where that test network as test accounts created. 
*/
var fs = require('fs');
var Web3 = require('web3');

/* Export ABI & Bytecode file to front end, by taking latest builds from project artifacts
*/
function getAbiAndBytecodeFromBuildArtifacts(contractGroup, contractName) {
    try {
        const contractFile = `../../artifacts/contracts/${contractGroup}/${contractName}.sol/${contractName}.json`;
        let jsonData = JSON.parse(fs.readFileSync(contractFile, 'utf-8'));
        const iface = jsonData.abi;
        const bytecode = jsonData.bytecode;
        return [iface, bytecode];
    } catch (err) {
        console.log(`Failed to export for ${contractName} with error [${err}]`);
    }
}

/*
** Main Script Starts Here
*/

const getFromArtifacts = true;
const test_account_address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // this address needs to be an account created on the test net.

/* Create Web 3 Provider so we have connection to local test network.
*/
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));

/* Load the abi (interface file) and bytecode that were extracted from the compilation artifact
**
** When the project is built, the compilation output is stored in <root>/artifacts
**
** The abi & bytecode below are extracted from the artifact files above by the script <root>/scripts/exportToFrontEnd/updateFrontEnd.js
*/
var abi = null;
var bytecode = null;
if (getFromArtifacts) {
    console.log('Get abi & bytecode direct from build Artifacts');
    const res = getAbiAndBytecodeFromBuildArtifacts('HelloWorld', 'HelloWorld');
    abi = res[0];
    bytecode = res[1];
} else {
    console.log('Get abi & bytecode from build front end export');
    abi = JSON.parse(fs.readFileSync('../../frontend/constants/HelloWorld.json'));
    bytecode = (JSON.parse(fs.readFileSync('../../frontend/constants/HelloWorld-bytecode.json')))['bytecode'];
}

/* Create a contract based on the interface definition.
*/
var helloWorldContract = new web3.eth.Contract(abi);

/* Create a transaction to request the contract be deployed which requires the bytecode that implements
** the interface
*/
var helloWorldTransaction = helloWorldContract.deploy({ data: bytecode, arguments: [] });

/* Send the transaction to the test network to deploy an instance of the contract
**
** The requires a signer account that exists on the network, so here we use one of the test accounts
** created by the test-network.
*/
try {
    helloWorldTransaction.send({ from: test_account_address, gas: 999999 }).then((contractInstance) => { console.log('Contract deployed Ok to address [${contractInstance.options.address}]') });
} catch (err) {
    console.log(`Failed deploy contract with error [${err}]`);
}

