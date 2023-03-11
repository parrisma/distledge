/*
** To run this only [> npx hardhat test --grep "Full Simulation"]
*/

const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const crypto = require('crypto');
const { TASK_NODE } = require("hardhat/builtin-tasks/task-names");
const { ethers } = require("hardhat");

/**
** Define all the parties in the simulation
** 
** escrow_manager - The party that manages escrow for stable coins
** stable_coin_issuer - The party this issues and manages stable coins
** data_vendor - the party selling reference data on chain
** option_seller - The party offering options
** option_buyer - The party buying options
*/
var escrow_manager;
var stable_coin_issuer;
var data_vendor;
var option_seller;
var option_buyer;

/**
 * Stable coins CNY, USD and EUR
 */
var erc20USDStableCoin;
var erc20CNYStableCoin;
var erc20EURStableCoin;

/**
 * Escrow accounts fro CNY,USD and EUR
 */
const onePercentReserve = 1;
var escrowUSDCurrenyAccount;
var escrowEURCurrenyAccount;
var escrowCNYCurrenyAccount;

/**
* Exchange rates & initial buy in's to stable coins
*/
const USD_to_EUR = 0.93;
const EUR_to_USD = 1.0 / USD_to_EUR;
const USD_to_CNY = 6.87;
const CNY_to_USD = 1.0 / USD_to_CNY;
const USDEUR_ticker = "USDEUR";
const USDEUR_Description = "USD to EUR Spot FX Rate"

const depositQtyUSD = 10000000000; // 100.00 USD where token is in 2 DP
const depositQtyEUR = depositQtyUSD * USD_to_EUR;
const depositQtyCNY = depositQtyUSD * USD_to_CNY;
const FXPriceDecimals = 5;

/**
 * Mock price data source
 */
const equityPriceDecimals = 2;
const teslaPriceFeb2023 = 20831; // $208.31
const teslaTicker = "TSLA";
const teslaDescription = "TESLA Regular Stock"

/**
* SimpleOption
*/
var simpleOption;
var premium;
var notional;
var strike;
var equityPriceContract;
var fxPriceContract;
var premiumToken;
var settlementToken;
var uniqueOptionId;
var settlementAmount;

/**
 * This suite uses globals, so you cannot run the tests individually, or out of sequence - but the aim here
 * is to show an end to end integration. 
 * 
 * There is probably a better way to set this up, but for now - we will run with this.
 */
describe("Financial Contract Full Integration Test and Simulation", function () {

    /**
     * 
     * @param {The address of the account that needs to sign the price update} signer 
     * @param {The value to update the price to} value 
     * @returns The new value of the price, the signing nonce & the signature.
     */
    async function signedValue(signer, value) {
        // Create a signed message
        const nonce = Math.floor(Date.now());
        const secretMessage = ethers.utils.solidityPack(["uint256", "uint256"], [value, nonce]);
        const secretMessageHash = ethers.utils.keccak256(secretMessage);
        const sig = await signer.signMessage(ethers.utils.arrayify(secretMessageHash)); // Now signed as secure source
        return { value, nonce, sig }
    }

    async function deployPriceContracts() {
        // Deploy Library
        const VerifySignerLib = await ethers.getContractFactory("VerifySigner");
        const verifySignerLib = await VerifySignerLib.deploy();
        await verifySignerLib.deployed();

        const EquityPrice = await ethers.getContractFactory("EquityPrice", {
            libraries: {
                VerifySigner: verifySignerLib.address,
            },
        });

        const FXPrice = await ethers.getContractFactory("FXPrice", {
            libraries: {
                VerifySigner: verifySignerLib.address,
            },
        });

        return { EquityPrice, FXPrice }
    }

    /* 
    ** This is an integration suite that also demo's how the Contracts 
    ** come together to model buying and selling financial option contracts
    ** on-chain
    */

    describe("Integration Full Simulation", async function () {
        it("Set-up Stable Coins USD, CNY and EUR", async function () {

            // Accounts are defined as global Vars
            [escrow_manager, stable_coin_issuer, data_vendor, option_seller, option_buyer] = await ethers.getSigners();

            /**
            ** First, we need to make stable coins available 
            **
            ** We create the coins and then transfer them to bw owned by the escrow accounts
            */
            const ERC20USDStableCoin = await ethers.getContractFactory("ERC20USDStableCoin");
            erc20USDStableCoin = await ERC20USDStableCoin.connect(stable_coin_issuer).deploy();
            expect(await erc20USDStableCoin.isoCcyCode()).to.equal("USD");
            console.log("\nStable coin token for ISO Ccy [" + await erc20USDStableCoin.isoCcyCode() + "] created");

            const ERC20CNYStableCoin = await ethers.getContractFactory("ERC20CNYStableCoin");
            erc20CNYStableCoin = await ERC20CNYStableCoin.connect(stable_coin_issuer).deploy();
            expect(await erc20CNYStableCoin.isoCcyCode()).to.equal("CNY");
            console.log("Stable coin token for ISO Ccy [" + await erc20CNYStableCoin.isoCcyCode() + "] created");

            const ERC20EURStableCoin = await ethers.getContractFactory("ERC20EURStableCoin");
            erc20EURStableCoin = await ERC20EURStableCoin.connect(stable_coin_issuer).deploy();
            expect(await erc20EURStableCoin.isoCcyCode()).to.equal("EUR");
            console.log("Stable coin token for ISO Ccy [" + await erc20EURStableCoin.isoCcyCode() + "] created");

        });

        it("Set-up Escrow accounts to manage stable coin physical cash audit", async function () {

            /**
            ** Create the Ccy specific escrow accounts & take ownership of relevant stable coin.
            */
            const EscrowCurrenyAccount = await ethers.getContractFactory("EscrowCurrenyAccount");

            escrowUSDCurrenyAccount = await EscrowCurrenyAccount.connect(escrow_manager).deploy(erc20USDStableCoin.address, onePercentReserve);
            await erc20USDStableCoin.transferOwnership(await escrowUSDCurrenyAccount.connect(escrow_manager).contractAddress());
            expect(await escrowUSDCurrenyAccount.managedTokenAddress()).to.equal(erc20USDStableCoin.address);
            expect(await escrowUSDCurrenyAccount.isBalanced()).to.equal(true);
            await escrowUSDCurrenyAccount.connect(escrow_manager).unPause();
            console.log("\nEscrow Account created and managing token [" + await escrowUSDCurrenyAccount.managedTokenAddress() + "] for [" + await escrowUSDCurrenyAccount.managedTokenName() + "]");

            escrowEURCurrenyAccount = await EscrowCurrenyAccount.connect(escrow_manager).deploy(erc20EURStableCoin.address, onePercentReserve);
            await erc20EURStableCoin.transferOwnership(await escrowEURCurrenyAccount.connect(escrow_manager).contractAddress());
            expect(await escrowEURCurrenyAccount.managedTokenAddress()).to.equal(erc20EURStableCoin.address);
            expect(await escrowEURCurrenyAccount.isBalanced()).to.equal(true);
            await escrowEURCurrenyAccount.connect(escrow_manager).unPause();
            console.log("Escrow Account created and managing token [" + await escrowEURCurrenyAccount.managedTokenAddress() + "] for [" + await escrowEURCurrenyAccount.managedTokenName() + "]");

            escrowCNYCurrenyAccount = await EscrowCurrenyAccount.connect(escrow_manager).deploy(erc20CNYStableCoin.address, onePercentReserve);
            await erc20CNYStableCoin.transferOwnership(await escrowCNYCurrenyAccount.connect(escrow_manager).contractAddress());
            expect(await escrowCNYCurrenyAccount.managedTokenAddress()).to.equal(erc20CNYStableCoin.address);
            expect(await escrowCNYCurrenyAccount.isBalanced()).to.equal(true);
            await escrowCNYCurrenyAccount.connect(escrow_manager).unPause();
            console.log("Escrow Account created and managing token [" + await escrowCNYCurrenyAccount.managedTokenAddress() + "] for [" + await escrowCNYCurrenyAccount.managedTokenName() + "]");
        });

        it("Trading parties buy stable coins", async function () {

            /**
            ** Option buyer and seller need to buy stable coins so they can pay premiums and settle
            ** at exercise time.
            **
            ** Over an above this they need ethereum to pay gas fees. In this test case the accounts
            ** have 'test' gas assigned by ethers.js.
            */

            // Seller
            console.log("\nOption seller pays physical cash (USD,CNY,EUR) to Escrow account which mints stable coin tokens and transfers them");
            const transId1 = crypto.randomUUID();
            await expect(escrowUSDCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_seller.address, depositQtyUSD, transId1))
                .to.emit(escrowUSDCurrenyAccount, 'Deposit')
                .withArgs(option_seller.address, depositQtyUSD, transId1, depositQtyUSD);
            console.log("Option seller has " + await erc20USDStableCoin.balanceOf(option_seller.address) + " USD Token");

            const transId2 = crypto.randomUUID();
            await expect(escrowEURCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_seller.address, depositQtyEUR, transId2))
                .to.emit(escrowEURCurrenyAccount, 'Deposit')
                .withArgs(option_seller.address, depositQtyEUR, transId2, depositQtyEUR);
            console.log("Option seller has " + await erc20EURStableCoin.balanceOf(option_seller.address) + " EUR Token");

            const transId3 = crypto.randomUUID();
            await expect(escrowCNYCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_seller.address, depositQtyCNY, transId3))
                .to.emit(escrowCNYCurrenyAccount, 'Deposit')
                .withArgs(option_seller.address, depositQtyCNY, transId3, depositQtyCNY);
            console.log("Option seller has " + await erc20CNYStableCoin.balanceOf(option_seller.address) + " CNY Token");

            // Buyer
            console.log("\nOption buyer pays physical cash (USD,CNY,EUR) to Escrow account which mints stable coin tokens and transfers them");
            const transId4 = crypto.randomUUID();
            await expect(escrowUSDCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer.address, depositQtyUSD, transId4))
                .to.emit(escrowUSDCurrenyAccount, 'Deposit')
                .withArgs(option_buyer.address, depositQtyUSD, transId4, depositQtyUSD * 2.0);
            console.log("Option buyer has " + await erc20USDStableCoin.balanceOf(option_buyer.address) + " USD Token");

            const transId5 = crypto.randomUUID();
            await expect(escrowEURCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer.address, depositQtyEUR, transId5))
                .to.emit(escrowEURCurrenyAccount, 'Deposit')
                .withArgs(option_buyer.address, depositQtyEUR, transId5, depositQtyEUR * 2.0);
            console.log("Option buyer has " + await erc20EURStableCoin.balanceOf(option_buyer.address) + " EUR Token");

            const transId6 = crypto.randomUUID();
            await expect(escrowCNYCurrenyAccount.connect(escrow_manager).processDepositTransaction(option_buyer.address, depositQtyCNY, transId6))
                .to.emit(escrowCNYCurrenyAccount, 'Deposit')
                .withArgs(option_buyer.address, depositQtyCNY, transId6, depositQtyCNY * 2.0);
            console.log("Option buyer has " + await erc20CNYStableCoin.balanceOf(option_buyer.address) + " CNY Token");

        });

        it("Create Option to Trade", async function () {
            /**
            ** Create the option contract ready to trade
            **
            */

            // Seller creates option contract for sale, linked to a live reference price.
            console.log("\nSeller creates SimpleOption for sale.");

            // Deploy Equity Price contract.
            var { EquityPrice, FXPrice } = await deployPriceContracts();

            // Create and deploy price source for Tesla
            console.log("\nCreate Tesla live (mock) reference level to use in the option contract");
            equityPriceContract = await EquityPrice.connect(data_vendor).deploy(teslaTicker, teslaDescription, data_vendor.address, equityPriceDecimals);
            var { value, nonce, sig } = await signedValue(data_vendor, teslaPriceFeb2023);
            await equityPriceContract.connect(data_vendor).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
            const [actualValue, actualUpdated] = await equityPriceContract.connect(data_vendor).getVerifiedValue();
            expect(actualValue).to.equal(teslaPriceFeb2023);
            console.log("Equity price feed created with ticker " + await equityPriceContract.getTicker() + " with initial price " + actualValue / (10 ** equityPriceDecimals));

            // Create and deploy settlement FX
            fxPriceContract = await FXPrice.connect(data_vendor).deploy(USDEUR_ticker, USDEUR_Description, data_vendor.address, FXPriceDecimals);
            var { value, nonce, sig } = await signedValue(data_vendor, USD_to_EUR * (10 ** FXPriceDecimals));
            await fxPriceContract.connect(data_vendor).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
            const [actualFXValue, actualFXUpdated] = await fxPriceContract.connect(data_vendor).getVerifiedValue();
            expect(actualFXValue).to.equal(USD_to_EUR * (10 ** FXPriceDecimals));
            console.log("FX price feed created with ticker " + await fxPriceContract.getTicker() + " with initial price " + actualFXValue / (10 ** FXPriceDecimals));

            // Create the option contract
            console.log("\nCreating simple in the money option, premium paid in USD Token settled in EUR Token");
            const SimpleOption = await ethers.getContractFactory("SimpleOption");
            uniqueOptionId = crypto.randomUUID();
            const name = "SimpleOption";
            const description = "A SimpleOption Contract max(0, notional * (reference - strike))";
            premiumToken = erc20USDStableCoin;
            premium = 2; // of the premiumToken.
            settlementToken = erc20CNYStableCoin;
            notional = 100; // 1.00 to 2-DP
            var [teslaPrice, teslaPriceUpdate] = await equityPriceContract.connect(data_vendor).getVerifiedValue();
            strike = ((teslaPrice / (10 ** equityPriceDecimals)) - premium) * (10 ** equityPriceDecimals);

            simpleOption = await SimpleOption.connect(option_seller).deploy(uniqueOptionId,
                name,
                description,
                option_buyer.address,
                premium,
                premiumToken.address,
                settlementToken.address,
                notional,
                strike,
                equityPriceContract.address,
                fxPriceContract.address);

            expect(await simpleOption.id()).to.equal(uniqueOptionId);
            console.log("\n" + await simpleOption.connect(option_seller).terms());
        });

        it("Trade the option", async function () {

            /**
            ** As seller, get the premium and authorize payment in the required token
            */
            const [tokenSymbol, premiumAmount] = await simpleOption.premium();
            console.log("\nSeller needs to pay Premium of " + premiumAmount + " in " + tokenSymbol);
            var premiumToken;

            if (tokenSymbol == await erc20CNYStableCoin.symbol()) {
                premiumToken = erc20CNYStableCoin;
            } else if (tokenSymbol == await erc20EURStableCoin.symbol()) {
                premiumToken = erc20EURStableCoin;
            } else if (tokenSymbol == await erc20USDStableCoin.symbol()) {
                premiumToken = erc20USDStableCoin;
            } else {
                expect.fail("Unknown premium token");
            }

            console.log("Authorize Premium transfer of " + premiumAmount + " in " + await premiumToken.symbol());
            await premiumToken.connect(option_buyer).approve(await simpleOption.contractAddress(), premiumAmount);
            expect(await premiumToken.allowance(option_buyer.address, simpleOption.contractAddress())).to.equal(premiumAmount);

            // Buyer has approved premium transfer, so we can do the deal.
            await expect(simpleOption.connect(option_buyer).acceptTerms())
                .to.emit(simpleOption, 'DealStruck')
                .withArgs(option_buyer.address, option_seller.address, await simpleOption.id());
            console.log("Deal has been done, premium of " + await premiumToken.balanceOf(await simpleOption.contractAddress()) + " transferred to seller");
        });

        it("Value and exercise", async function () {

            /**
            ** As buyer, value the option and then exercise to collect settlement amount if > 0
            */
            const decimals = Number(await equityPriceContract.getDecimals());
            var [teslaPrice, teslaPriceUpdate] = await equityPriceContract.connect(data_vendor).getVerifiedValue();
            expect(await simpleOption.connect(option_buyer).valuation()).to.equal(Math.max(0, notional * (teslaPrice - strike)));
            console.log("\nTesla has current price of [" + Number(teslaPrice) + "]");
            console.log("simpleOption has valuation [" + Number(await simpleOption.valuation()) + "]");

            var { value, nonce, sig } = await signedValue(data_vendor, Number(teslaPrice) - (15 * (10 ** decimals)));
            await equityPriceContract.connect(data_vendor).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
            var [teslaPrice, teslaPriceUpdate] = await equityPriceContract.connect(data_vendor).getVerifiedValue();
            console.log("\nTesla price drops by 20 to [" + Number(teslaPrice) + "]");
            expect(await simpleOption.connect(option_buyer).valuation()).to.equal(0);
            console.log("simpleOption has new valuation of [" + Number(await simpleOption.valuation()) + "]");

            var { value, nonce, sig } = await signedValue(data_vendor, Number(teslaPrice) + (16 * (10 ** decimals)));
            await equityPriceContract.connect(data_vendor).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
            var [teslaPrice, teslaPriceUpdate] = await equityPriceContract.connect(data_vendor).getVerifiedValue();
            console.log("\nTesla price increases by 16 to " + Number(teslaPrice));
            console.log("simpleOption has new valuation of [" + Number(await simpleOption.valuation()) + "]");
            expect(await simpleOption.connect(option_buyer).valuation()).to.equal(Math.max(0, notional * (Number(teslaPrice) - strike)));

            /**
             *  Seller has to do periodic mark to market to adjust settlement to cover buyer exercise
             */
            settlementAmount = Number(await simpleOption.connect(option_buyer).settlementAmount());
            await settlementToken.connect(option_seller).approve(simpleOption.contractAddress(), settlementAmount);
            expect(await settlementToken.allowance(option_seller.address, simpleOption.contractAddress())).to.equal(settlementAmount);
            console.log("\nSeller has authorized [" + settlementAmount + "] of the settlement token [" + await settlementToken.symbol() + "]");

            /**
             * Buyer now exercises the deal as it is in the money. This means the contract has to pay the contract value
             * in the settlement coin.
             */
            await expect(simpleOption.connect(option_buyer).exercise())
                .to.emit(simpleOption, 'Exercised')
                .withArgs(option_buyer.address, option_seller.address, await simpleOption.id());
            console.log("Seller has settled [" + settlementAmount + "] of the settlement token [" + await settlementToken.symbol() + "]");
        });

        it("Check final balances", async function () {

            /**
            ** Check that after all transactions, token balances for buyer and seller are correct
            */
            expect(await erc20EURStableCoin.balanceOf(option_seller.address)).to.equal(Number(depositQtyEUR + 0));
            expect(await erc20EURStableCoin.balanceOf(option_buyer.address)).to.equal(Number(depositQtyEUR - 0));

            expect(await erc20USDStableCoin.balanceOf(option_seller.address)).to.equal(Number(depositQtyUSD + premium));
            expect(await erc20USDStableCoin.balanceOf(option_buyer.address)).to.equal(Number(depositQtyUSD - premium));

            expect(await erc20CNYStableCoin.balanceOf(option_seller.address)).to.equal(Number(depositQtyCNY - settlementAmount));
            expect(await erc20CNYStableCoin.balanceOf(option_buyer.address)).to.equal(Number(depositQtyCNY + settlementAmount));

            console.log("\nOption seller has " + await erc20USDStableCoin.balanceOf(option_seller.address) + " USD Token");
            console.log("Option seller has " + await erc20CNYStableCoin.balanceOf(option_seller.address) + " CNY Token");
            console.log("Option seller has " + await erc20EURStableCoin.balanceOf(option_seller.address) + " EUR Token");
            console.log("\nOption buyer has " + await erc20USDStableCoin.balanceOf(option_buyer.address) + " USD Token");
            console.log("Option buyer has " + await erc20CNYStableCoin.balanceOf(option_buyer.address) + " CNY Token");
            console.log("Option buyer has " + await erc20EURStableCoin.balanceOf(option_buyer.address) + " EUR Token");
        });
    });
});