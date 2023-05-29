# Start Environment

## Overview

The explains how to fully start the environment from scratch. Some of these take a while to run, so be sure to check they have finished before moving to next step.

| Step | Command | Folder |
| ------- | ------- | ------ |
| [Start test network](start-network)| ```npx hardhat node```| ```project root``` |
| [Run tests](run-tests) | ```npx hardhat test``` | ```project root``` |
| [Deploy contracts](deploy-contracts) | ```npx hardhat run --network localhost scripts/deploy/deploy.js``` | ```project root``` |
| [Export to front end](export-to-front-end) | ```yarn hardhat run ./scripts/exportToFrontEnd/updateFrontEnd.js --network localhost``` | ```project root``` |
| [Start Web Server](start-web-server)| | ```project root/webserver```|
| [Export to web server](export-to-web-server) | ```yarn hardhat run ./scripts/exportToWebService/updateWebService.js --network localhost``` | ```project root``` |
| [Create test contracts](create-test-contracts) optional | ```npx hardhat run --network localhost serverTest.js``` | ```project root/webserver/tests```|
| [Start Front End](start-front-end) | ```yarn dev``` | ```project root/frontend``` |
| [Setup Meta Mask](set-up-meta-mask) | [Meta Mask](start-ui.md#install-metamask) | |
| [Run Front end](go-to-front-end) | [http://localhost:3000](http://localhost:3000) | |

## Steps

### 1. Start Network

The whole system is run using a test network, and we have chosen Hardhat for this. So before you can start you need the test network running on your local host.

Configuration for this is held in ```hardhat.config.js``` in the project source root.

```npx hardhat node```

### 2. Run Tests

By running the tests, you will force a re-compile of any changed or new solidity contracts. As part of this their interface (abi) and bytecode files are generated. These are needed to be current as they must be exported to the front end and webServer so they can find and run the utility contracts on the test network. These files are created in the ```artifacts``` folder in the project root, they are JSON files so you can navigate to them and open them.

Also, if any of these tests fail it is likely the overall system will fail.

This step does not use the running test network, the tests create a ephemeral and private test network of each set of tests, as such these tests will not interfere with any contracts deployed on the running test network.

```npx hardhat test```

### 3. Deploy Contracts

There are a number of tokens, ERC721 and other contracts that need pre-deploying to the test network. These deployed contracts are used by the front end and the WebServer. So if you re-start the test network you will need to run this deployment again.

If you want to do a full reset, restart the test network and then run this to reset all deployed contracts to an initial state. This is necessary as deployed contracts are stateful for their life. In this case their life is between re-starts of the test network.

```npx hardhat run --network localhost scripts/deploy/deploy.js```

### 4. Export to Front End

The front end is in effect a separate environment within the overall project, with a root folder of ```frontend```.

This is also how things would work in a production deployment. As such the front end needs to know about the utility contracts that have been deployed. It does this by being given copies of the interface (abi) files and bytecode. This way it can find the deployed contracts on the test network and then call methods on them.

These are deployed to the ```frontend/constants``` folder, as such you should not edit the contents of this folder as it is copied here from the complied solidity contracts.

```yarn hardhat run ./scripts/exportToFrontEnd/updateFrontEnd.js --network localhost```

### 5. Export to Web Server

The WebServer is in effect a separate environment within the overall project, with a root folder of ```webserver```.

This is also how things would work in a production deployment. As such the Web Server needs to know about the utility contracts that have been deployed. It does this by being given copies of the interface (abi) files and bytecode. This way it can find the deployed contracts on the test network and then call methods on them.

These are deployed to the ```webserver/constants``` folder, as such you should not edit the contents of this folder as it is copied here from the complied solidity contracts.

```yarn hardhat run ./scripts/exportToWebService/updateWebService.js --network localhost```

### 6. Start Web Server

This is a full ```http``` web server written in JavaScript, it's function is to support the option NFT contracts as part of the ERC721 NFT Contract we have created.

It keeps copies of the option teams in a local folder ```webserver/terms``` and as such is stateful. These option terms are linked to the NFT Id's in the ERC721 contract. So if you restart the test network you will reset the ERC721 contract. So you will then need to delete the contents of the ```terms``` folder as these terms will relate to option NFT id's that no longer exist.

A simpler way of doing this is running [server tests](create-test-contracts) script, which will clean away all old contracts and create some test options for you to use.

The port number is defined in the ```serverConfig.js``` file in the Web Server project root. 

By default the Web Server will start on [http://localhost:8191](http:://localhost:8191). You can navigate to this and run the Web Server calls directly, e.g. ```http:/localhost:8191/list```, which will return a JSON list of all option contracts currently held on the Web Server.

```cd webserver```
```npx hardhat run --network localhost server.js```

### 7. Create Test Contracts

This step is optional. The script deletes any existing option terms and then creates some test contracts and then verified that all Web Server features are working.

```cd webserver\tests```
```npx hardhat run --network localhost serverTest.js```

### 8. Start Front End

This takes a while to get going, even on a fast machine, so be patient.

```cd frontend```
```yarn dev```

### 9.Set-up Meta Mask

See [Meta Mask](start-ui.md#install-metamask) for how to connect Meta Mask to this local test environment.

### 10. Go to Front End

After all of this you can go to a browser and interact with our demo [http:/localhost:3000](http:/localhost:3000)