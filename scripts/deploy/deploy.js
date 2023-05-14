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
const { deployAndLinkEscrowAccounts } = require("@deploy/deployEscrow.js");
const { deployEquityPrices } = require("@deploy/deployEquityPrices.js");
const { deployFXRates } = require("@deploy/deployFXRates.js");
const { deployERC271 } = require("@deploy/deployERC271.js");
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
  [escrow_manager, stable_coin_issuer, data_vendor, option_seller, option_buyer] = await namedAccounts(sharedConfig);

  console.log(`\nAccount Addresses`);
  console.log(`Escrow Manager     : [${sharedConfig.escrowAccount.accountAddress}]`);
  console.log(`Stable Coin Issuer : [${sharedConfig.tokenAccount.accountAddress}]`);
  console.log(`Data Vendor        : [${sharedConfig.dataAccount.accountAddress}]`);
  console.log(`Option Seller      : [${sharedConfig.sellerAccount.accountAddress}]`);
  console.log(`Option Buyer       : [${sharedConfig.buyerAccount.accountAddress}]`);

  /**
  ** Deploy the three stable coin currencies.
  */
  const [usdStableCoin, eurStableCoin, cnyStableCoin] = await deployStableCoins(sharedConfig, hre, stable_coin_issuer);

  /**
  ** Deploy the three Escrow accounts and take ownership of the three stable coins.
  */
  const [usdEscrowAccount, eurEscrowAccount, cnyEscrowAccount] = await deployAndLinkEscrowAccounts(sharedConfig, hre, escrow_manager, usdStableCoin, eurStableCoin, cnyStableCoin);

  /**
  ** Deploy & initialize the equity prices
  */
  const [teslaEquityPriceContract] = await deployEquityPrices(sharedConfig, hre, data_vendor, data_vendor); // data_vendor is owner and source

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
  const [erc271OptionContractTypeOne] = await deployERC271(sharedConfig, hre, escrow_manager);

  /**
  ** Initial coin minting and allocation to trading accounts.
  */
  await mintAndAllocate(hre,
    escrow_manager,
    option_buyer,
    option_seller,
    escrowUSDAccount,
    escrowEURAccount,
    escrowCNYAccount,
    erc20USDStableCoin,
    erc20EURStableCoin,
    erc20CNYStableCoin);

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
