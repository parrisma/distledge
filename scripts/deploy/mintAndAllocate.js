const crypto = require('crypto');
const { depositQtyUSD, depositQtyEUR, depositQtyCNY, appleIssue, teslaIssue } = require("@deploy/testConstants.js");

/**
 * 
 * @param {*} hre Hardhat runtime environment
 * @param {*} escrow_manager - The account that is used to create and manage Escrow contracts
 * @param {*} option_buyer - The account that will act as the option buyer in the tests
 * @param {*} option_buyer2 - The account that will act as the option buyer2 in the tests
 * @param {*} option_buyer3 - The account that will act as the option buyer3 in the tests
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
    option_buyer2,
    option_buyer3,
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

    // SELLER
    console.log("\nOption seller pays physical cash (USD,CNY,EUR) to Escrow account which mints stable coin tokens and transfers them");
    var transId = crypto.randomUUID();
    await escrowUSDCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_seller.address, depositQtyUSD * 10000, transId);
    console.log("Option seller has " + await erc20USDStableCoin.balanceOf(option_seller.address) + " USD Token");

    transId = crypto.randomUUID();
    await escrowEURCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_seller.address, depositQtyEUR * 10000, transId);
    console.log("Option seller has " + await erc20EURStableCoin.balanceOf(option_seller.address) + " EUR Token");

    transId = crypto.randomUUID();
    await escrowCNYCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_seller.address, depositQtyCNY * 10000, transId);
    console.log("Option seller has " + await erc20CNYStableCoin.balanceOf(option_seller.address) + " CNY Token");

    console.log("\nInitial shares issued as stable share");
    await escrowAppleAccount.connect(escrow_manager).processDepositTransaction(option_seller.address, appleIssue, transId);
    console.log("Option seller has " + await erc20AppleStableShare.balanceOf(option_seller.address) + " Apple Token");

    await escrowTeslaAccount.connect(escrow_manager).processDepositTransaction(option_seller.address, teslaIssue, transId);
    console.log("Option seller has " + await erc20TeslaStableShare.balanceOf(option_seller.address) + " Tesla Token");

    // BUYER
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

    // BUYER 2
    console.log("\nOption buyer 3 pays physical cash (USD,CNY,EUR) to Escrow account which mints stable coin tokens and transfers them");
    transId = crypto.randomUUID();
    await escrowUSDCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer2.address, depositQtyUSD, transId);
    console.log("Option buyer 2 has " + await erc20USDStableCoin.balanceOf(option_buyer2.address) + " USD Token");

    transId = crypto.randomUUID();
    await escrowEURCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer2.address, depositQtyEUR, transId);
    console.log("Option buyer 2 has " + await erc20EURStableCoin.balanceOf(option_buyer2.address) + " EUR Token");

    transId = crypto.randomUUID();
    await escrowCNYCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer2.address, depositQtyCNY, transId);
    console.log("Option buyer 2 has " + await erc20CNYStableCoin.balanceOf(option_buyer2.address) + " CNY Token");

    // BUYER 3
    console.log("\nOption buyer 3 pays physical cash (USD,CNY,EUR) to Escrow account which mints stable coin tokens and transfers them");
    transId = crypto.randomUUID();
    await escrowUSDCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer3.address, depositQtyUSD, transId);
    console.log("Option buyer 3 has " + await erc20USDStableCoin.balanceOf(option_buyer3.address) + " USD Token");

    transId = crypto.randomUUID();
    await escrowEURCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer3.address, depositQtyEUR, transId);
    console.log("Option buyer 3 has " + await erc20EURStableCoin.balanceOf(option_buyer3.address) + " EUR Token");

    transId = crypto.randomUUID();
    await escrowCNYCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer3.address, depositQtyCNY, transId);
    console.log("Option buyer 3 has " + await erc20CNYStableCoin.balanceOf(option_buyer3.address) + " CNY Token");

}

module.exports = {
    mintAndAllocate
}