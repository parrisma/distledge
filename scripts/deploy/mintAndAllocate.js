const crypto = require('crypto');
const { depositQtyUSD, depositQtyEUR, depositQtyCNY } = require("./testConstants.js");

/**
 * 
 * @param {*} hre Hardhat runtime environment
 * @param {account address} escrow_manager - The account that is used to create and manage Escrow contracts
 * @param {account address} option_buyer - The account that will act as the option buyer in the tests
 * @param {account address} option_seller - The account that will act as the option seller in the tests
 * @param {deployed EscrowAccount contract} escrowUSDCurrenyAccount - The deployed USD Escrow Account
 * @param {deployed EscrowAccount contract} escrowEURCurrenyAccount - The deployed EUR Escrow Account
 * @param {deployed EscrowAccount contract} escrowCNYCurrenyAccount - The deployed CNY Escrow Account
 * @param {deployed stable coin contract} erc20USDStableCoin - The deployed USD stable coin
 * @param {deployed stable coin contract} erc20EURStableCoin - The deployed EUR stable coin
 * @param {deployed stable coin contract} erc20CNYStableCoin - The deployed CNY stable coin
 */
async function mintAndAllocate(hre,
    escrow_manager,
    option_buyer,
    option_seller,
    escrowUSDCurrenyAccount,
    escrowEURCurrenyAccount,
    escrowCNYCurrenyAccount,
    erc20USDStableCoin,
    erc20EURStableCoin,
    erc20CNYStableCoin) {

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
}

module.exports = {
    mintAndAllocate
}