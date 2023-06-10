/**
* To use this
* 
* (1) In a separate window 'npx hardhat node'
* (2) In a separate window 'npx hardhat run --network hardhat scripts\deploy\deploy.js'
* 
* This starts a hardhat environment with a network called 'hardhat' and deploys all of the base
* contracts. You can then interact with these contracts via MetaMask or the test UI by linking them
* to the specific instance of the contract addresses that are created here.
* 
*/
require('module-alias/register'); // npm i --save module-alias
const hre = require("hardhat");
const { deployStableCoins } = require("@deploy/deployStableCoins.js");
const { deployStableShares } = require("@deploy/deployStableShares.js");
const { deployAndLinkEscrowAccounts } = require("@deploy/deployEscrow.js");
const { deployEquityPrices } = require("@deploy/deployEquityPrices.js");
const { deployFXRates } = require("@deploy/deployFXRates.js");
const { deployERC721 } = require("@deploy/deployERC721.js");
const { mintAndAllocate } = require("@deploy/mintAndAllocate.js");
const { namedAccounts } = require("@scripts/lib/accounts.js");
const { sharedConfig, cleanUpSharedConfig, writeSharedConfig } = require("@scripts/lib/sharedConfig.js");


async function main() {

  console.log(`\n========================================\n`);
  console.log(` D E P L O Y  T E S T  C O N T R A C T S`);
  console.log(`\n========================================\n`);

  console.log(`\n===== Clean up old shared config\n`);

  cleanUpSharedConfig();

  /**
   * Get and allocate account roles on the network
   */
  [escrow_manager,
    stable_token_issuer,
    data_vendor,
    option_seller,
    option_buyer,
    option_buyer2,
    option_buyer3] = await namedAccounts(sharedConfig);

  console.log(`\nAccount Addresses`);
  console.log(`Escrow Manager      : [${sharedConfig.escrowAccount.accountAddress}]`);
  console.log(`Stable Token Issuer : [${sharedConfig.tokenAccount.accountAddress}]`);
  console.log(`Data Vendor         : [${sharedConfig.dataAccount.accountAddress}]`);
  console.log(`Option Seller       : [${sharedConfig.sellerAccount.accountAddress}]`);
  console.log(`Option Buyer 1      : [${sharedConfig.buyerAccount.accountAddress}]`);
  console.log(`Option Buyer 2      : [${sharedConfig.buyer2Account.accountAddress}]`);
  console.log(`Option Buyer 3      : [${sharedConfig.buyer3Account.accountAddress}]`);

  /**
  ** Deploy the three stable coin currencies.
  */
  const [usdStableCoin, eurStableCoin, cnyStableCoin] = await deployStableCoins(sharedConfig, hre, stable_token_issuer);

  /**
  ** Deploy the three stable shares.
  */
  const [appleStableShare, teslaStableShare] = await deployStableShares(sharedConfig, hre, stable_token_issuer);

  /**
  ** Deploy the three Escrow accounts and take ownership of the three stable coins.
  */
  const [usdEscrowAccount,
    eurEscrowAccount,
    cnyEscrowAccount,
    appleEscrowAccount,
    teslaEscrowAccount] =
    await deployAndLinkEscrowAccounts(
      sharedConfig,
      hre,
      escrow_manager,
      usdStableCoin,
      eurStableCoin,
      cnyStableCoin,
      appleStableShare,
      teslaStableShare);

  /**
  ** Deploy & initialize the equity prices
  */
  const [teslaEquityPriceContract,
    appleEquityPriceContract] = await deployEquityPrices(sharedConfig, hre, data_vendor, data_vendor); // data_vendor is owner and source

  /**
  ** Deploy & initialize the FX Rates
  */
  const [
    UsdEurFXRateContract,
    UsdCnyFXRateContract,
    UsdUsdFXRateContract,
    EurEurFXRateContract,
    CnyCnyFXRateContract] = await deployFXRates(sharedConfig, hre, data_vendor, data_vendor); // data_vendor is owner and source

  /* Deploy ERC217 Contracts
  */
  const [erc721OptionContractTypeOne] = await deployERC721(sharedConfig, hre, escrow_manager);

  /**
  ** Initial coin minting and allocation to trading accounts.
  */
  await mintAndAllocate(hre,
    escrow_manager,
    option_buyer,
    option_seller,
    usdEscrowAccount,
    eurEscrowAccount,
    cnyEscrowAccount,
    appleEscrowAccount,
    teslaEscrowAccount,
    usdStableCoin, 
    eurStableCoin, 
    cnyStableCoin,
    appleStableShare, 
    teslaStableShare);

  /**
   * Save the shared config for other test services to read.
   */
  console.log(`\n===== Write new shared config\n`);
  writeSharedConfig();

  /* Done, with noe issues
  */
  process.exitCode = 0;
  console.log(`\n===== Done with no issues\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  console.log(`\n===== Done with Error [${error.message}]\n`);
});
