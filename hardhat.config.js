require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
      hardhat: {
          blockGasLimit: 60000000 // Network block gasLimit
      },
  },
};
