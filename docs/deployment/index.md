# Deploying

- [Deploying](#deploying)
  - [Things we use](#things-we-use)
  - [Pull Project](#pull-project)
  - [Install node](#install-node)
  - [Start Services](#start-services)
    - [Hardhat Test Network (local chain)](#hardhat-test-network-local-chain)
    - [Local WebServer that supports NFTs](#local-webserver-that-supports-nfts)
    - [Test Option Contracts](#test-option-contracts)
    - [Dummy Price Feeds](#dummy-price-feeds)
    - [Front End - React UI](#front-end---react-ui)

## Things we use

1. [Node Package Manager](https://docs.npmjs.com/)
2. [Yarn](https://yarnpkg.com/)
3. [JavaScript](https://www.w3schools.com/js/)
4. [React JS](https://react.dev/)
5. [Moralis](https://moralis.io/)
6. [Solidity](https://docs.soliditylang.org/en/v0.8.20/)
7. [Open Zeppelin](https://www.openzeppelin.com/)
8. [ERC20 Token Standard](https://docs.openzeppelin.com/contracts/4.x/erc20)
9. [ERC721 NFT Standard](https://docs.openzeppelin.com/contracts/4.x/erc721)
10. [Hardhat](https://hardhat.org/)
11. [Interplanetary File System (IPFS)](https://ipfs.tech/)
12. [MetaMask](https://metamask.io/)

## Pull Project

Clone or pull the project locally. e.g.

```text
mkdir distledge
cd distledge
git clone https://github.com/parrisma/distledge.git
```

## Install node

Install npm and then run npm install from within the project directory to install all the [required node packages](https://github.com/parrisma/distledge/blob/main/package.json).

```text
npm install -g npm
cd distledge
npm install --legacy-peer-deps
```

## Start Services

In this order, in different command windows.

### Hardhat Test Network (local chain)

```text
npm run node
```

### Local WebServer that supports NFTs

```text
npm run ftb
```

For full details see [here](../howto/strart-environment.md), once the WebServer is running, so can interact with it via [http://localhost:8191](http://localhost:8191).

It, will also start an IPFS server that you can read about [here](../howto/ipfs.md) and interact with via [http://localhost:9091](http://localhost:9091)

### Test Option Contracts

```text
npm run deploy-opt
```

### Dummy Price Feeds

To simulate a ticking market

```text
npm run price-feed
```

### Front End - React UI

```text
npm run frontend
```

For full details on UI setup and use, see [here](../howto/start-ui.md), once it is running you can interact with it via [http://localhost:3000/](http://localhost:3000/)
