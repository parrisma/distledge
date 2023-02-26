const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
require("dotenv").config();
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  log("----------------------------------------------------");
  log("Deploying EquityPrice and waiting for confirmations...");
  const ticker = "TCKR";
  const equityPrice = await deploy("EquityPrice", {
    from: deployer,
    args: [ticker, ethUsdPriceFeedAddress],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`EquityPrice deployed at ${equityPrice.address}`);
  log(developmentChains);
  log(network.name);
  log(process.env.ETHERSCAN_API_KEY);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("verifying");
    await verify(equityPrice.address, [ticker, ethUsdPriceFeedAddress]);
    log("verify done");
  }
};
module.exports.tags = ["all", "EquityPrice"];
