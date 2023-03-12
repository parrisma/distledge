const crypto = require('crypto');
const { depositQtyUSD, depositQtyEUR, depositQtyCNY } = require("./testConstants.js");

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
    console.log("Option seller has " + await erc20EURStableCoin.balanceOf(option_seller.address) + " USD Token");

    transId = crypto.randomUUID();
    await escrowCNYCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_seller.address, depositQtyCNY, transId);
    console.log("Option seller has " + await erc20CNYStableCoin.balanceOf(option_buyer.address) + " USD Token");

    console.log("\nOption buyer pays physical cash (USD,CNY,EUR) to Escrow account which mints stable coin tokens and transfers them");
    transId = crypto.randomUUID();
    await escrowUSDCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer.address, depositQtyUSD, transId);
    console.log("Option buyer has " + await erc20USDStableCoin.balanceOf(option_buyer.address) + " USD Token");

    transId = crypto.randomUUID();
    await escrowEURCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer.address, depositQtyEUR, transId);
    console.log("Option buyer has " + await erc20EURStableCoin.balanceOf(option_buyer.address) + " USD Token");

    transId = crypto.randomUUID();
    await escrowCNYCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer.address, depositQtyCNY, transId);
    console.log("Option buyer has " + await erc20CNYStableCoin.balanceOf(option_buyer.address) + " USD Token");
}

module.exports = {
    mintAndAllocate
}