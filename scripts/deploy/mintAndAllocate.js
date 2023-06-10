const crypto = require('crypto');
const { depositQtyUSD, depositQtyEUR, depositQtyCNY, appleIssue, teslaIssue } = require("@deploy/testConstants.js");

/**
 * 
 * @param {*} hre Hardhat runtime environment
 * @param {*} escrow_manager - The account that is used to create and manage Escrow contracts
 * @param {*} option_buyer - The account that will act as the option buyer in the tests
 * @param {*} option_seller - The account that will act as the option seller in the tests
 * @param {*} escrowUSDCurrenyAccount - The deployed USD Escrow Account
 * @param {*} escrowEURCurrenyAccount - The deployed EUR Escrow Account
 * @param {*} escrowCNYCurrenyAccount - The deployed CNY Escrow Account
 * @param {*} escrowAppleAccount - The deployed Apple Escrow Account
 * @param {*} escrowTeslaAccount - The deployed Tesla Escrow Account
 * @param {*} erc20USDStableCoin - The deployed USD stable coin
 * @param {*} erc20EURStableCoin - The deployed EUR stable coin
 * @param {*} erc20CNYStableCoin - The deployed CNY stable coin
 * @param {*} erc20AppleStableShare - The deployed Apple stable share
 * @param {*} erc20TeslaStableShare - The deployed Tesla stable share
 */
async function mintAndAllocate(hre,
    escrow_manager,
    option_buyer,
    option_seller,
    escrowUSDCurrenyAccount,
    escrowEURCurrenyAccount,
    escrowCNYCurrenyAccount,
    escrowAppleAccount,
    escrowTeslaAccount,
    erc20USDStableCoin,
    erc20EURStableCoin,
    erc20CNYStableCoin,
    erc20AppleStableShare,
    erc20TeslaStableShare
) {

    /**
     * Mint and allocate initial balances as tokens, using the Escrow accounts
     */

    console.log("\nOption seller pays physical cash (USD,CNY,EUR) to Escrow account which mints stable coin tokens and transfers them");
    var transId = crypto.randomUUID();
    await escrowUSDCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_seller.address, depositQtyUSD, transId);
    console.log("Option seller has " + await erc20USDStableCoin.balanceOf(option_seller.address) + " USD Token");

    transId = crypto.randomUUID();
    await escrowEURCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_seller.address, depositQtyEUR, transId);
    console.log("Option seller has " + await erc20EURStableCoin.balanceOf(option_seller.address) + " EUR Token");

    transId = crypto.randomUUID();
    await escrowCNYCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_seller.address, depositQtyCNY, transId);
    console.log("Option seller has " + await erc20CNYStableCoin.balanceOf(option_seller.address) + " CNY Token");

    console.log("\nOption buyer pays physical cash (USD,CNY,EUR) to Escrow account which mints stable coin tokens and transfers them");
    transId = crypto.randomUUID();
    await escrowUSDCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer.address, depositQtyUSD, transId);
    console.log("Option buyer has " + await erc20USDStableCoin.balanceOf(option_buyer.address) + " USD Token");

    transId = crypto.randomUUID();
    await escrowEURCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer.address, depositQtyEUR, transId);
    console.log("Option buyer has " + await erc20EURStableCoin.balanceOf(option_buyer.address) + " EUR Token");

    transId = crypto.randomUUID();
    await escrowCNYCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer.address, depositQtyCNY, transId);
    console.log("Option buyer has " + await erc20CNYStableCoin.balanceOf(option_buyer.address) + " CNY Token");

    console.log("\nInitial shares issued as stable share");
    await escrowAppleAccount.connect(escrow_manager).processDepositTransaction(escrow_manager.address, appleIssue, transId);
    console.log("Manager has " + await erc20AppleStableShare.balanceOf(escrow_manager.address) + " Apple Token");

    await escrowTeslaAccount.connect(escrow_manager).processDepositTransaction(escrow_manager.address, teslaIssue, transId);
    console.log("Manager has " + await erc20TeslaStableShare.balanceOf(escrow_manager.address) + " Tesla Token");
}

module.exports = {
    mintAndAllocate
}