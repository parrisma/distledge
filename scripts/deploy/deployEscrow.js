/**
 * Deploy the Escrow contracts and link to the already deployed stable coins
 * @param {*} hre Hardhat runtime environment
 * @param {Address} escrow_manager The Signer account to use to issue the escrow accounts
 * @param {contract} usdStableCoin The USD Stable Coin Contract
 * @param {contract} eurStableCoin The EUR Stable Coin Contract
 * @param {contract} cnyStableCoin The CNY Stable Coin Contract
 * @returns {Address} Of the Escrow contracts that were deployed USD, EUR, CNY
 */
async function deployAndLinkEscrowAccounts(hre, escrow_manager, usdStableCoin, eurStableCoin, cnyStableCoin) {

    const onePercentReserve = 1;

    console.log("\nCreate Escrow Accounts and Link to Stable Coins");
    const EscrowCurrenyAccount = await hre.ethers.getContractFactory("EscrowCurrenyAccount");

    escrowUSDCurrenyAccount = await EscrowCurrenyAccount.connect(escrow_manager).deploy(usdStableCoin.address, onePercentReserve);
    await usdStableCoin.transferOwnership(await escrowUSDCurrenyAccount.connect(escrow_manager).contractAddress());
    await escrowUSDCurrenyAccount.connect(escrow_manager).unPause();
    console.log("Escrow Account created and managing token [" + await escrowUSDCurrenyAccount.managedTokenAddress() + "] for [" + await escrowUSDCurrenyAccount.managedTokenName() + "]");

    escrowEURCurrenyAccount = await EscrowCurrenyAccount.connect(escrow_manager).deploy(eurStableCoin.address, onePercentReserve);
    await eurStableCoin.transferOwnership(await escrowEURCurrenyAccount.connect(escrow_manager).contractAddress());
    await escrowEURCurrenyAccount.connect(escrow_manager).unPause();
    console.log("Escrow Account created and managing token [" + await escrowEURCurrenyAccount.managedTokenAddress() + "] for [" + await escrowEURCurrenyAccount.managedTokenName() + "]");

    escrowCNYCurrenyAccount = await EscrowCurrenyAccount.connect(escrow_manager).deploy(cnyStableCoin.address, onePercentReserve);
    await cnyStableCoin.transferOwnership(await escrowCNYCurrenyAccount.connect(escrow_manager).contractAddress());
    await escrowCNYCurrenyAccount.connect(escrow_manager).unPause();
    console.log("Escrow Account created and managing token [" + await escrowCNYCurrenyAccount.managedTokenAddress() + "] for [" + await escrowCNYCurrenyAccount.managedTokenName() + "]");


    return [escrowUSDCurrenyAccount, escrowEURCurrenyAccount, escrowCNYCurrenyAccount]

}

module.exports = {
    deployAndLinkEscrowAccounts
}