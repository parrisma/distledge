# Deploying from Interface and Bytecode.

## Overview

There are time when we need to deploy contracts from the interface (abi) and  bytecode. In our example here when we create new option contracts we need to create new instances of the relevant contract.

We would also like to do this from the interface. So to do this we need to have access to the latest version of the interface (abi) and the bytecode. These are produced when the contract is compiled.

If you run ```npx hardhat compile``` all contracts will be compiled (if they have changed) and the result will appear in ```[project root]\artifacts\contracts\[contract folder]\[contract name]``` e.g. ```[project root]\artifacts\contracts\HelloWorld\HelloWorld.json```

The ```HelloWorld.json``` file contains both the interface and the bytecode. These can be simple extracted by loading and parsing the to a JSON object in Javascript and extracting the elements ```.abi``` and ```.bytecode```

## The flow

The demo code below, shows the following flow

1. Start the test network (if not started) ```npx hardhat node```
2. Compile the HelloWorld.sol contract, do by hand with ```npx hardhat complile```
3. Use [Web3](https://web3js.readthedocs.io/en/v1.2.11/web3.html) to connect to the local test network on ```http://127.0.0.1:8545/```
4. Load the ```HelloWorld.json``` and extract the ```.abi``` and ```.byecode```
5. Create a contract interface with ```var helloWorldContract = new web3.eth.Contract(abi)```
6. Deploy an instance of the contract, with this command that associates the interface with the bytecode ```var helloWorldTransaction = helloWorldContract.deploy({ data: bytecode, arguments: ["CtorStr", testAccountAddress, 6284] });```
7. Create a link to the deployed contract with ``` const helloWorldContract = new web3.eth.Contract(abi, contractInstance.options.address);```
8. Call a method on the deployed contract with ```helloWorldContract.methods.message("Mark", contractInstance.options.address, 3142).call((err, res) => {})```

## Demo Code

There is a demo script you can run with by changing directory to ```[project root]\scripts\test``` and running ```node web3-deploy.js```. You need to make sure the test network is running with ```npx hardhat node```
