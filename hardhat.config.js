require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-web3");
require("dotenv").config()

//Assign environment variables for local use.
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const AAPL_USD_ADDRESS = process.env.AAPL_USD_ADDRESS
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
      hardhat: {
          blockGasLimit: 60000000 // Network block gasLimit
      },
      goerli: {
        url: GOERLI_RPC_URL,  //test network RPC URL is defined in .env file.
        accounts: [PRIVATE_KEY], //Personal account private key must be defined in .env file.
        chainId: 5,
        blockConfirmations: 6,
        dataFeed: AAPL_USD_ADDRESS //From https://docs.chain.link/data-feeds/price-feeds/addresses        
      }
  },
  etherscan:{
    apiKey: {goerli:ETHERSCAN_API_KEY} //Etherscan API Key is generated from https://docs.etherscan.io/getting-started/viewing-api-usage-statistics
  }
};
