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

const genericDecimals = 2;
const forexRate = 0.1;

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
  // let mockAggregator;
  let equityPrice;
  let fxPrice;
  // let simpleOption;
  let SimpleOption;

  const premium = 10;
  const notional = 100;
  const strike = 1000;
  const defaultTokenBalance = 10000000000000;

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
    var { value, nonce, sig } = await signedValue(data_vendor, 1000);
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

  async function updateEquityPrice(
    _equityPriceSource,
    _data_vendor,
    _underlyingPrice
  ) {
    var { value, nonce, sig } = await signedValue(
      _data_vendor,
      _underlyingPrice
    );
    await _equityPriceSource
      .connect(_data_vendor)
      .setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
    const actualValue = await _equityPriceSource
      .connect(_data_vendor)
      .getVerifiedValue();
    console.log(
      "Underlying price with ticker " +
        (await _equityPriceSource.getTicker()) +
        " updated to " +
        actualValue / 10 ** genericDecimals
    );
  }

  it("Valuate contract as positive return when spot is greater than strike", async function () {
    // Value of the contract is notional * (underlying price - strike price)
    const underlyingPrice = 1200;

    await updateEquityPrice(equityPrice, data_vendor, underlyingPrice);

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
    simpleOption.connect(option_buyer).acceptTerms();

    expect(await simpleOption.connect(option_buyer).valuation()).to.equal(
      20000
    );
  });

  it("Valuate contract as zero when spot is equal to strike", async function () {
    // Value of the contract is notional * (underlying price - strike price)
    const underlyingPrice = 1000;
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
        " changed to " +
        actualValue / 10 ** genericDecimals
    );

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
    simpleOption.connect(option_buyer).acceptTerms();

    expect(await simpleOption.connect(option_buyer).valuation()).to.equal(0);
  });

  it("Valuate contract as zero when spot is lower than strike", async function () {
    // Value of the contract is notional * (underlying price - strike price)
    const underlyingPrice = 800;
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
        " changed to " +
        actualValue / 10 ** genericDecimals
    );

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
    simpleOption.connect(option_buyer).acceptTerms();

    expect(await simpleOption.connect(option_buyer).valuation()).to.equal(0);
  });
});
