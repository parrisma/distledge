# Doing Deployments

## Policy

For this project we choose to use [Hardhat](https://www.npmjs.com/package/hardhat) deployments directly inside the ```test``` scripts.

There are no auto deployment scripts in this ```deploy``` directory.

## Tests with Deployed Contracts

To run with deployed contracts such that we can test with Ui and [MetaMask](https://metamask.io/), we start a hard hat node and then use the ```scripts\deploy.js``` to deploy the contracts to that test network, see below.

In one window

```text
npx hardhat node
```
This will start the network named ```hardhat``` as defined in ```hardhat.config.js```

In another window, you can deploy contracts to that running now network. **However** to connect to this network you need to use ```--network localhost``` to connect to the running instance. Or the name of the host and port where the stand alone network was started.

```text
npx hardhat run --network localhost scripts\deploy\deploy.js
```

This deploy script will show the accounts being used and the addresses of the deployed contracts. These details can then be used with other test scripts or services such as [MetaMask](https://metamask.io/)

**or** if you have a dapp in another script that needs to load the deployed contracts, you will need to run that script against localhost also.

```text
npx hardhat run --network localhost myApp.js
```

Your application will need to know the address of the contract that was deployed. You can log this or save it in configuration. Then use the code below to connect to a given contract instance.

```javascript
    /**
     * Create a contract instance by loading it from the address that resulted from its
     * deployment. You must make sure the deployment and the app are pointing at the same
     * network.
     * 
     * Where "ContractName" is teh actual name of the Contract &
     *       "0x8464135c8F25Da09e49BC8782676a84730C318bC" is an example of a real deployed contract address.
     */
    const contractInstance = await hre.ethers.getContractAt("ContractName", "0x8464135c8F25Da09e49BC8782676a84730C318bC");      
    console.log(await contractInstance.contractFunc());
```