const hre = require("hardhat");

var escrow_manager;
var stable_token_issuer;
var data_vendor;
var option_seller;
var option_buyer

async function namedAccounts(sharedConfig) {
    /**
     * Get and allocate account roles on the network
     */
    [escrow_manager, stable_token_issuer, data_vendor, option_seller, option_buyer] = await hre.ethers.getSigners();
    console.log(escrow_manager.address);
    console.log(sharedConfig);

    sharedConfig.escrowAccount.accountAddress = `${escrow_manager.address}`;
    sharedConfig.tokenAccount.accountAddress = `${stable_token_issuer.address}`;
    sharedConfig.dataAccount.accountAddress = `${data_vendor.address}`;
    sharedConfig.sellerAccount.accountAddress = `${option_seller.address}`;
    sharedConfig.buyerAccount.accountAddress = `${option_buyer.address}`;

    return [escrow_manager, stable_token_issuer, data_vendor, option_seller, option_buyer];
}

async function getAccount(accountAddr) {
    /**
     * Get and allocate account on the network
     */
    const account = await hre.ethers.getSigner(accountAddr);
    return account;
}

module.exports = {
    namedAccounts,
    getAccount
}
