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

In another window

```text
npx hardhat run --network hardhat scripts\deploy\deploy.js
```

This deploy script will show the accounts being used and the addresses of the deployed contracts. These details can then be used with other test scripts or services such as [MetaMask](https://metamask.io/)

### Run specific tests

