const addressConfig = require("./contractAddressesConfig.json");
const equityPriceABI = require("./EquityPrice.json");
const FXPriceABI = require("./FXPrice.json");
const USDCoin = require("./ERC20USDStableCoin.json");
const EURCoin = require("./ERC20EURStableCoin.json");
const CNYCoin = require("./ERC20CNYStableCoin.json");

module.exports = {
  equityPriceABI,
  FXPriceABI,
  USDCoin,
  EURCoin,
  CNYCoin,
  addressConfig,
};
