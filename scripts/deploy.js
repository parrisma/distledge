/**
 * This deployment script deploys all base contracts. The only contracts not deployed are those that are
 * deployed on demand and are in effect one-shot NFT's
 */
const { ethers, network } = require('hardhat');
const { verify } = require('../utils/verify');

async function deploy_stable_coins(stable_coin_issuer, option_seller) {

  /// 
  const ERC20USDStableCoin = await ethers.getContractFactory("ERC20USDStableCoin");
  erc20USDStableCoin = await ERC20USDStableCoin.connect(stable_coin_issuer).deploy();
  console.log(`\nStable coin token for ISO Ccy [${await erc20USDStableCoin.isoCcyCode()}] created at address [${erc20USDStableCoin.address}]`);
  console.log(`1`);
  await erc20USDStableCoin.connect(stable_coin_issuer).mint(100);
  console.log(`2`);
  console.log(`${await erc20USDStableCoin.connect(stable_coin_issuer).balanceOf(stable_coin_issuer.address)}`);
  //erc20USDStableCoin.connect(stable_coin_issuer.address).approve(stable_coin_issuer.address, 1);
  await erc20USDStableCoin.connect(stable_coin_issuer).transfer(option_seller.address, 1);

  /// 0x6Af87A5bC0c8adE6431EBc98105D351879f3423e

}

async function main() {
  /**
   * Get and allocate account roles on the network
   */
  [escrow_manager, stable_coin_issuer, data_vendor, option_seller, option_buyer] = await ethers.getSigners();

  console.log(`\n`);
  console.log(`Escrow Manager     : [${escrow_manager.address}]`);
  console.log(`Stable Coin Issuer : [${stable_coin_issuer.address}]`);
  console.log(`Data Vendor        : [${data_vendor.address}]`);
  console.log(`Option Seller      : [${option_seller.address}]`);
  console.log(`Option Buyer       : [${option_buyer.address}]`);

  await deploy_stable_coins(stable_coin_issuer, option_seller);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.log(`\nStarted\n`);
  console.error(error);
  process.exitCode = 1;
  console.log(`\nDone\n`);
});
