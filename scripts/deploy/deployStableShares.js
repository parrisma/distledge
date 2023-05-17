/**
 * Deploy the Stable Share Contracts
 * @param {json} sharedConfig JSON Object in while all shared config is held
 * @param {*} hre Hardhat runtime environment
 * @param {Address} stableShareIssuer The Signer account to use to issue the stable shares
 * @returns {Address} Of the StableShare contracts that were deployed
 */
async function deployStableShares(sharedConfig, hre, stableShareIssuer) {

    console.log("\nIssue Stable Shares");
    const ERC20AppleStableShare = await hre.ethers.getContractFactory("ERC20AppleStableShare");
    erc20AppleStableShare = await ERC20AppleStableShare.connect(stableShareIssuer).deploy();
    console.log(`Stable share [${await erc20AppleStableShare.assetCode()}] created at address [${erc20AppleStableShare.address}]`);

    const ERC20TeslaStableShare = await hre.ethers.getContractFactory("ERC20TeslaStableShare");
    erc20TeslaStableShare = await ERC20TeslaStableShare.connect(stableShareIssuer).deploy();
    console.log(`Stable share [${await erc20TeslaStableShare.assetCode()}] created at address [${erc20TeslaStableShare.address}]`);

    sharedConfig.appleStableShare = erc20AppleStableShare.address;
    sharedConfig.teslaStableShare = erc20TeslaStableShare.address;

    return [erc20AppleStableShare, erc20TeslaStableShare]

}

module.exports = {
    deployStableShares
}