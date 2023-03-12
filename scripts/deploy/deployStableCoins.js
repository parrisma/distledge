/**
 * Deploy the Stable Coin Contracts
 * @param {*} hre Hardhat runtime environment
 * @param {Address} coin_issuer The Signer account to use to issue the stable coins
 * @returns {Address} Of the StableCoin contracts that were deployed USD, EUR, CNY
 */
async function deployStableCoins(hre, coin_issuer) {

    console.log("\nIssue Stable Coins");
    const ERC20USDStableCoin = await hre.ethers.getContractFactory("ERC20USDStableCoin");
    erc20USDStableCoin = await ERC20USDStableCoin.connect(stable_coin_issuer).deploy();
    console.log(`Stable coin token for ISO Ccy [${await erc20USDStableCoin.isoCcyCode()}] created at address [${erc20USDStableCoin.address}]`);

    const ERC20EURStableCoin = await hre.ethers.getContractFactory("ERC20EURStableCoin");
    erc20EURStableCoin = await ERC20EURStableCoin.connect(stable_coin_issuer).deploy();
    console.log(`Stable coin token for ISO Ccy [${await erc20EURStableCoin.isoCcyCode()}] created at address [${erc20EURStableCoin.address}]`);

    const ERC20CNYStableCoin = await hre.ethers.getContractFactory("ERC20CNYStableCoin");
    erc20CNYStableCoin = await ERC20CNYStableCoin.connect(stable_coin_issuer).deploy();
    console.log(`Stable coin token for ISO Ccy [${await erc20CNYStableCoin.isoCcyCode()}] created at address [${erc20CNYStableCoin.address}]\n`);

    return [erc20USDStableCoin, erc20EURStableCoin, erc20CNYStableCoin]

}

module.exports = {
    deployStableCoins
}