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
    [
        escrow_manager,
        stable_token_issuer,
        data_vendor,
        option_seller,
        option_buyer,
        option_buyer_2,
        option_buyer_3
    ] = await hre.ethers.getSigners();
    console.log(escrow_manager.address);
    console.log(sharedConfig);

    sharedConfig.escrowAccount.accountAddress = `${escrow_manager.address}`;
    sharedConfig.tokenAccount.accountAddress = `${stable_token_issuer.address}`;
    sharedConfig.dataAccount.accountAddress = `${data_vendor.address}`;
    sharedConfig.sellerAccount.accountAddress = `${option_seller.address}`;
    sharedConfig.buyerAccount.accountAddress = `${option_buyer.address}`;
    sharedConfig.buyer2Account.accountAddress = `${option_buyer_2.address}`;
    sharedConfig.buyer3Account.accountAddress = `${option_buyer_3.address}`;

    return [
        escrow_manager,
        stable_token_issuer,
        data_vendor,
        option_seller,
        option_buyer,
        option_buyer_2,
        option_buyer_3];
}

async function getAccount(accountAddr) {
    /**
     * Get and allocate account on the network
     */
    const account = await hre.ethers.getSigner(accountAddr);
    return account;
}

/**
 * Case insensitive address comparison as hex numbers in address can be both upper & lower case.
 * 
 * @param {*} addr1 - Address one to compare
 * @param {*} addr2 - Address two to compare
 * @returns True, if address are the same.
 */
function isSameAddress(addr1, addr2){
    return (`${addr1}`.toUpperCase() === `${addr2}`.toUpperCase());
}

module.exports = {
    namedAccounts,
    isSameAddress,
    getAccount
}
