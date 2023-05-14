require("@nomicfoundation/hardhat-network-helpers");
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-web3");
require("dotenv").config();
require("hardhat-deploy");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");

//Assign environment variables for local use.
const GOERLI_RPC_URL =
  process.env.GOERLI_RPC_URL ||
  "https://eth-goerli.alchemyapi.io/v2/your-api-key";
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key";

const ETHERSCAN_API_KEY =
  process.env.ETHERSCAN_API_KEY || "Your etherscan API key";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
            details: {
              yul: false,
            },
          },
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chianId: 31337,
      blockGasLimit: 60000000, // Network block gasLimit
      allowUnlimitedContractSize: true,
    },
    goerli: {
      url: GOERLI_RPC_URL, //test network RPC URL is defined in .env file.
      accounts: [PRIVATE_KEY], //Personal account private key must be defined in .env file.
      chainId: 5,
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: { goerli: ETHERSCAN_API_KEY }, //Etherscan API Key is generated from https://docs.etherscan.io/getting-started/viewing-api-usage-statistics
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  mocha: {
    timeout: 500000,
  },
  gasReporter: {
    enabled: COINMARKETCAP_API_KEY === "key" ? false : true,
    outputFile: "gas-report.txt",
    noColors: false,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    // gasPrice: 2000,
    // token: "MATIC",
    token: "ETH",
  },
};
