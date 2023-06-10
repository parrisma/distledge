/**
 * Deploy the Escrow contracts and link to the already deployed stable coins
 * @param {json} sharedConfig JSON Object in while all shared config is held
 * @param {*} hre Hardhat runtime environment
 * @param {Address} escrow_manager The Signer account to use to issue the escrow accounts
 * @param {contract} usdStableCoin The USD Stable Coin Contract
 * @param {contract} eurStableCoin The EUR Stable Coin Contract
 * @param {contract} cnyStableCoin The CNY Stable Coin Contract
 * @param {contract} appleStableShare The Apple Stable Share Contract
 * @param {contract} teslaStableShare The Tesla Stable Share Contract
 * @returns {Address} Of the Escrow contracts that were deployed USD, EUR, CNY
 */
async function deployAndLinkEscrowAccounts(sharedConfig,
    hre,
    escrow_manager,
    usdStableCoin,
    eurStableCoin,
    cnyStableCoin,
    appleStableShare,
    teslaStableShare) {

    const onePercentReserve = 1;

    console.log("\nCreate Escrow Accounts and Link to Stable Assets");
    const EscrowAccount = await hre.ethers.getContractFactory("EscrowAccount");

    escrowUSDAccount = await EscrowAccount.connect(escrow_manager).deploy(usdStableCoin.address, onePercentReserve);
    await usdStableCoin.transferOwnership(await escrowUSDAccount.connect(escrow_manager).contractAddress());
    await escrowUSDAccount.connect(escrow_manager).unPause();
    console.log("Escrow Account created and managing token [" + await escrowUSDAccount.managedTokenAddress() + "] for [" + await escrowUSDAccount.managedTokenName() + "]");

    escrowEURAccount = await EscrowAccount.connect(escrow_manager).deploy(eurStableCoin.address, onePercentReserve);
    await eurStableCoin.transferOwnership(await escrowEURAccount.connect(escrow_manager).contractAddress());
    await escrowEURAccount.connect(escrow_manager).unPause();
    console.log("Escrow Account created and managing token [" + await escrowEURAccount.managedTokenAddress() + "] for [" + await escrowEURAccount.managedTokenName() + "]");

    escrowCNYAccount = await EscrowAccount.connect(escrow_manager).deploy(cnyStableCoin.address, onePercentReserve);
    await cnyStableCoin.transferOwnership(await escrowCNYAccount.connect(escrow_manager).contractAddress());
    await escrowCNYAccount.connect(escrow_manager).unPause();
    console.log("Escrow Account created and managing token [" + await escrowCNYAccount.managedTokenAddress() + "] for [" + await escrowCNYAccount.managedTokenName() + "]");

    escrowAppleAccount = await EscrowAccount.connect(escrow_manager).deploy(appleStableShare.address, onePercentReserve);
    await appleStableShare.transferOwnership(await escrowAppleAccount.connect(escrow_manager).contractAddress());
    await escrowAppleAccount.connect(escrow_manager).unPause();
    console.log("Escrow Account created and managing token [" + await escrowAppleAccount.managedTokenAddress() + "] for [" + await escrowAppleAccount.managedTokenName() + "]");

    escrowTeslaAccount = await EscrowAccount.connect(escrow_manager).deploy(teslaStableShare.address, onePercentReserve);
    await teslaStableShare.transferOwnership(await escrowTeslaAccount.connect(escrow_manager).contractAddress());
    await escrowTeslaAccount.connect(escrow_manager).unPause();
    console.log("Escrow Account created and managing token [" + await escrowTeslaAccount.managedTokenAddress() + "] for [" + await escrowTeslaAccount.managedTokenName() + "]");

    sharedConfig.usdEscrowAccount = escrowUSDAccount.address;
    sharedConfig.eurEscrowAccount = escrowEURAccount.address;
    sharedConfig.cnyEscrowAccount = escrowCNYAccount.address;
    sharedConfig.appleEscrowAccount = escrowAppleAccount.address;
    sharedConfig.teslaEscrowAccount = escrowTeslaAccount.address;

    return [escrowUSDAccount, escrowEURAccount, escrowCNYAccount, escrowAppleAccount, escrowTeslaAccount]

}

module.exports = {
    deployAndLinkEscrowAccounts
}