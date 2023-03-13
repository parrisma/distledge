const hre = require("hardhat");

var escrow_manager;
var stable_coin_issuer;
var data_vendor;
var option_seller;
var option_buyer

async function namedAccounts() {
    /**
     * Get and allocate account roles on the network
     */
    [escrow_manager, stable_coin_issuer, data_vendor, option_seller, option_buyer] = await hre.ethers.getSigners();
    return [escrow_manager, stable_coin_issuer, data_vendor, option_seller, option_buyer];
}

module.exports = {
    namedAccounts
}
