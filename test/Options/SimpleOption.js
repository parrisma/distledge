const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const crypto = require("crypto");
const { TASK_NODE } = require("hardhat/builtin-tasks/task-names");
const { ethers } = require("hardhat");

/**
 * This suite tests the SimpleOption
 *
 * TODO: Complete test's use Integration.js for inspiration
 */

describe("Simple Option Test Suite", function () {
  // Define accounts
  let escrow_manager;
  let stable_coin_issuer;
  let data_vendor;
  let option_seller;
  let option_buyer;

  // ERC20StableCoin
  let premiumToken; // ERC20USDStableCoin
  let settlementToken; // ERC20CNYStableCoin
  // Price sources
  let equityPrice;
  let fxPrice;
  // Option factory
  let SimpleOption;

  const genericDecimals = 2;
  const forexRate = 0.1;
  const premium = 10;
  const notional = 100;
  const underlyingPrice = 1000;
  const strike = 1000;
  const defaultTokenBalance = 10000000000000;

  it("Valuate contract as positive return when spot is greater than strike", async function () {
    // Value of the contract is notional * (underlying price - strike price)
    const currentUnderlyingPrice = 1200;
    await updateEquityPrice(currentUnderlyingPrice);
    var simpleOption = await getSimpleOption();

    expect(await simpleOption.connect(option_buyer).valuation()).to.equal(
      20000
    );
  });

  it("Valuate contract as zero when spot is equal to strike", async function () {
    // Value of the contract is notional * (underlying price - strike price)
    const currentUnderlyingPrice = 1000;
    await updateEquityPrice(currentUnderlyingPrice);
    var simpleOption = await getSimpleOption();

    expect(await simpleOption.connect(option_buyer).valuation()).to.equal(0);
  });

  it("Valuate contract as zero when spot is lower than strike", async function () {
    // Value of the contract is notional * (underlying price - strike price)
    const currentUnderlyingPrice = 800;
    await updateEquityPrice(currentUnderlyingPrice);
    var simpleOption = await getSimpleOption();

    expect(await simpleOption.connect(option_buyer).valuation()).to.equal(0);
  });

  it("Settlement amount changed when underlying price changed", async function () {
    // Settlement amount of the contract is value * underlying price
    const currentUnderlyingPrice = 1200;
    await updateEquityPrice(currentUnderlyingPrice);
    var simpleOption = await getSimpleOption();

    expect(await simpleOption.connect(option_seller).valuation()).to.equal(
      20000
    );
    expect(
      await simpleOption.connect(option_seller).settlementAmount()
    ).to.equal(24000000);
  });

  it("Balance of seller account reduced after exercise", async function () {
    var sellerBalanceBeforeExercise = await settlementToken.balanceOf(
      option_seller.address
    );

    const currentUnderlyingPrice = 1200;
    await updateEquityPrice(currentUnderlyingPrice);
    var simpleOption = await getSimpleOption();

    var settlementAmount = await simpleOption
      .connect(option_seller)
      .settlementAmount();
    await settlementToken
      .connect(option_seller)
      .approve(simpleOption.contractAddress(), settlementAmount);
    console.log("Settlement amount for SimpleOption is " + settlementAmount);

    expect(await simpleOption.connect(option_buyer).exercise()).to.emit(
      simpleOption,
      "Exercised"
    );
    // Settlement amount of the contract is value * underlying price(24000000)
    expect(await settlementToken.balanceOf(option_seller.address)).to.equal(
      Number(sellerBalanceBeforeExercise) - Number(settlementAmount)
    );
  });

  it("Balance of buyer account increased after exercise", async function () {
    var buyerBalanceBeforeExercise = await settlementToken.balanceOf(
      option_buyer.address
    );

    const currentUnderlyingPrice = 1200;
    await updateEquityPrice(currentUnderlyingPrice);
    var simpleOption = await getSimpleOption();

    var settlementAmount = await simpleOption
      .connect(option_seller)
      .settlementAmount();
    await settlementToken
      .connect(option_seller)
      .approve(simpleOption.contractAddress(), settlementAmount);
    console.log("Settlement amount for SimpleOption is " + settlementAmount);

    expect(await simpleOption.connect(option_buyer).exercise()).to.emit(
      simpleOption,
      "Exercised"
    );
    // Settlement amount of the contract is value * underlying price(24000000)
    expect(await settlementToken.balanceOf(option_buyer.address)).to.equal(
      Number(buyerBalanceBeforeExercise) + Number(settlementAmount)
    );
  });

  // Setup a contract based on premium in USD, settile in CNY
  beforeEach(async function () {
    // Get accounts
    [
      escrow_manager,
      stable_coin_issuer,
      data_vendor,
      option_seller,
      option_buyer,
    ] = await ethers.getSigners();

    // Setup premium and settlement tokens
    const ERC20USDStableCoin = await ethers.getContractFactory(
      "ERC20USDStableCoin"
    );
    const ERC20CNYStableCoin = await ethers.getContractFactory(
      "ERC20CNYStableCoin"
    );
    premiumToken = await ERC20USDStableCoin.connect(
      stable_coin_issuer
    ).deploy();
    settlementToken = await ERC20CNYStableCoin.connect(
      stable_coin_issuer
    ).deploy();

    // Setup deposite of seller & buyer accounts
    const EscrowCurrenyAccount = await ethers.getContractFactory(
      "EscrowCurrenyAccount"
    );
    const escrowPremiumTokenAccount = await EscrowCurrenyAccount.connect(
      escrow_manager
    ).deploy(premiumToken.address, 1);
    await premiumToken.transferOwnership(
      await escrowPremiumTokenAccount.connect(escrow_manager).contractAddress()
    );
    escrowPremiumTokenAccount.connect(escrow_manager).unPause();
    const transId1 = crypto.randomUUID();
    await escrowPremiumTokenAccount
      .connect(escrow_manager)
      .processDepositTransaction(
        option_seller.address,
        defaultTokenBalance,
        transId1
      );
    const transId2 = crypto.randomUUID();
    await escrowPremiumTokenAccount
      .connect(escrow_manager)
      .processDepositTransaction(
        option_buyer.address,
        defaultTokenBalance,
        transId2
      );
    const escrowSettlementTokenAccount = await EscrowCurrenyAccount.connect(
      escrow_manager
    ).deploy(settlementToken.address, 1);
    await settlementToken.transferOwnership(
      await escrowSettlementTokenAccount
        .connect(escrow_manager)
        .contractAddress()
    );
    escrowSettlementTokenAccount.connect(escrow_manager).unPause();
    const transId3 = crypto.randomUUID();
    await escrowSettlementTokenAccount
      .connect(escrow_manager)
      .processDepositTransaction(
        option_seller.address,
        defaultTokenBalance,
        transId3
      );
    const transId4 = crypto.randomUUID();
    await escrowSettlementTokenAccount
      .connect(escrow_manager)
      .processDepositTransaction(
        option_buyer.address,
        defaultTokenBalance,
        transId4
      );

    // Initialize forex rate and price feed
    var { EquityPrice, FXPrice } = await deployPriceContracts();
    fxPrice = await FXPrice.connect(data_vendor).deploy(
      "USDCNY",
      "USD/CNY Forex",
      data_vendor.address,
      genericDecimals
    );
    var { value, nonce, sig } = await signedValue(
      data_vendor,
      forexRate * 10 ** genericDecimals
    );
    await fxPrice
      .connect(data_vendor)
      .setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
    const actualFXValue = await fxPrice.connect(data_vendor).getVerifiedValue();
    console.log(
      "FX price feed created with ticker " +
        (await fxPrice.getTicker()) +
        " with initial rate " +
        actualFXValue / 10 ** genericDecimals
    );

    equityPrice = await EquityPrice.connect(data_vendor).deploy(
      "Underlying",
      "Underlying price",
      data_vendor.address,
      genericDecimals
    );
    var { value, nonce, sig } = await signedValue(data_vendor, underlyingPrice);
    await equityPrice
      .connect(data_vendor)
      .setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
    const actualValue = await equityPrice
      .connect(data_vendor)
      .getVerifiedValue();
    console.log(
      "Underlying price feed created with ticker " +
        (await equityPrice.getTicker()) +
        " with initial price " +
        actualValue / 10 ** genericDecimals
    );
    SimpleOption = await ethers.getContractFactory("SimpleOption");
  });

  async function signedValue(signer, value) {
    // Create a signed message
    const nonce = Math.floor(Date.now());
    const secretMessage = ethers.utils.solidityPack(
      ["uint256", "uint256"],
      [value, nonce]
    );
    const secretMessageHash = ethers.utils.keccak256(secretMessage);
    const sig = await signer.signMessage(
      ethers.utils.arrayify(secretMessageHash)
    ); // Now signed as secure source
    return { value, nonce, sig };
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

    return { EquityPrice, FXPrice };
  }

  async function updateEquityPrice(underlyingPrice) {
    var { value, nonce, sig } = await signedValue(data_vendor, underlyingPrice);
    await equityPrice
      .connect(data_vendor)
      .setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
    const actualValue = await equityPrice
      .connect(data_vendor)
      .getVerifiedValue();
    console.log(
      "Underlying price with ticker " +
        (await equityPrice.getTicker()) +
        " updated to " +
        actualValue / 10 ** genericDecimals
    );
  }

  async function updateForexRate(currentForexRate) {
    var { value, nonce, sig } = await signedValue(
      data_vendor,
      currentForexRate
    );
    await fxPrice
      .connect(data_vendor)
      .setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
    const actualFXValue = await fxPrice.connect(data_vendor).getVerifiedValue();
    console.log(
      "Forex rate with ticker " +
        (await fxPrice.getTicker()) +
        " updated to " +
        actualFXValue / 10 ** genericDecimals
    );
  }

  async function getSimpleOption() {
    const uniqueId = crypto.randomUUID();
    var simpleOption = await SimpleOption.connect(option_seller).deploy(
      uniqueId,
      "SimpleOption",
      "SimpleOption",
      option_buyer.address,
      premium,
      premiumToken.address,
      settlementToken.address,
      notional,
      strike,
      equityPrice.address,
      fxPrice.address
    );
    const [tokenSymbol, premiumAmount] = await simpleOption.premium();
    await premiumToken
      .connect(option_buyer)
      .approve(await simpleOption.contractAddress(), premiumAmount);

    await premiumToken.allowance(
      option_buyer.address,
      simpleOption.contractAddress()
    );
    // Buyer approve premium transfer, so we can do the deal.
    await simpleOption.connect(option_buyer).acceptTerms();
    return simpleOption;
  }
});
