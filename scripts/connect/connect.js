/**
 * Simple test script that shows how to connect directly to a network.
 * 
 * When the (test) network is started with 
 * > npx hardhat node
 * It will report the connection URL to the terminal, and that is the URL
 * below.
 * 
 */

(async () => {
    var ethers = require('ethers');
    var url = 'http://127.0.0.1:8545/'; // URL of the test network 

    var customHttpProvider;

    console.log("\nAttempting connection to network [" + url + "]");

    // Get current block id as a way of verifying the connection.
    try {
        // Make a direct RPC connection to the test network.
        customHttpProvider = new ethers.providers.JsonRpcProvider(url);
        console.log(customHttpProvider);

        customHttpProvider.getBlockNumber().then((result) => {
            console.log("Connected and recovered current block number: " + result);
        });
    }
    catch (err) {
        console.log("Failed to connect with error [" + err + "]");
    }

    console.log("Done\n");
})();

