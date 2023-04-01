const addressConfig = require("./contractAddressesConfig.json");
const equityPriceABI = require("./EquityPrice.json");
const FXPriceABI = require("./FXPrice.json");
const StableCoinABI = require("./ERC20StableCoin.json");
const EscrowStableCoinABI = require("./EscrowCurrenyAccount.json");
const DisplayMap = require("./DisplayMap.json");

module.exports = {
  equityPriceABI,
  FXPriceABI,
  StableCoinABI,
  EscrowStableCoinABI,
  addressConfig,
  DisplayMap
};
