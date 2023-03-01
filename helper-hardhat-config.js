const networkConfig = {
  31337: {
    name: "localhost",
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
};

const developmentChains = ["hardhat", "localhost"];

// Change the directory to your front end project path
const frontEndContractsAddressFile =
  "../nextjs-distledge/constants/networkMapping.json";
const frontEndAbiLocation = "../nextjs-distledge/constants/";

module.exports = {
  networkConfig,
  developmentChains,
  frontEndContractsAddressFile,
  frontEndAbiLocation,
};
