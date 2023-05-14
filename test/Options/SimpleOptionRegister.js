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
 */

describe("Simple Option Register Test Suite", function () {
  // Define accounts
  let escrow_manager;
  let stable_coin_issuer;
  let data_vendor;
  let option_seller1;
  let option_seller2;
  let option_buyer1;
  let option_buyer2;

  // ERC20StableCoin
  let premiumToken; // ERC20USDStableCoin
  let settlementToken; // ERC20CNYStableCoin
  // Price sources
  let equityPrice;
  let fxPrice;
  // Option factory
  let SimpleOption;
  // SimpleOptionRegister
  let SimpleOptionRegister;
  let simpleOptionRegister;

  const equityDecimals = 4;
  const fxDecimals = 6;
  const forexRate = 0.1;
  const premium = 10;
  const notional = 100;
  const underlyingPrice = 100000;
  const strike = 100000;
  const defaultTokenBalance = 10000000000000;

  it("Register Option Contracts", async function () {
    const SimpleOptionRegister = await ethers.getContractFactory(
      "SimpleOptionRegister"
    );
    simpleOptionRegister = await SimpleOptionRegister.deploy();
    var simpleOption1 = await getSimpleOption(
      "Simple Option 1",
      option_seller1,
      option_buyer1
    );
    var simpleOption2 = await getSimpleOption(
      "Simple Option 2",
      option_seller2,
      option_buyer2
    );
    const optionAddr1 = await simpleOption1.contractAddress();
    const optionAddr2 = await simpleOption2.contractAddress();
    var options = await simpleOptionRegister.getOptions();
    console.log("Option size before register:" + options.length);
    await simpleOptionRegister.registerContract(optionAddr1);
    await simpleOptionRegister.registerContract(optionAddr2);
    options = await simpleOptionRegister.getOptions();
    console.log("Option size after register:" + options.length);
    expect(options.length).to.equal(2);
    expect(options[0]).to.equal(optionAddr1);
    expect(options[1]).to.equal(optionAddr2);
  });

  it("Get Options For Seller", async function () {
    var options = await simpleOptionRegister.getOptions();
    var sellerOptions1 = await simpleOptionRegister.getOptionsForSeller(
      option_seller1.address
    );
    var sellerOptions2 = await simpleOptionRegister.getOptionsForSeller(
      option_seller2.address
    );
    expect(options.length).to.equal(2);
    expect(sellerOptions1.length).to.equal(1);
    expect(sellerOptions2.length).to.equal(1);
    expect(sellerOptions1[0]).to.equal(options[0]);
    expect(sellerOptions2[0]).to.equal(options[1]);
  });

  it("Get Options For Buyer", async function () {
    var options = await simpleOptionRegister.getOptions();
    var buyerOptions1 = await simpleOptionRegister.getOptionsForBuyer(
      option_buyer1.address
    );
    var buyerOptions2 = await simpleOptionRegister.getOptionsForBuyer(
      option_buyer2.address
    );
    expect(options.length).to.equal(2);
    expect(buyerOptions1.length).to.equal(1);
    expect(buyerOptions2.length).to.equal(1);
    expect(buyerOptions1[0]).to.equal(options[0]);
    expect(buyerOptions2[0]).to.equal(options[1]);
  });

  it("Purge Option Contracts", async function () {
    var options = await simpleOptionRegister.getOptions();
    console.log("Option size before purge:" + options.length);
    console.log("Purging option with address: " + options[0]);
    await simpleOptionRegister.purgeContract(options[0]);
    options = await simpleOptionRegister.getOptions();
    console.log("Option size after purging one option:" + options.length);
    expect(options.length).to.equal(1);
    await simpleOptionRegister.purgeContract(options[0]);
    options = await simpleOptionRegister.getOptions();
    console.log("Option size after purging another option:" + options.length);
    expect(options.length).to.equal(0);
  });

  // Setup a contract based on premium in USD, settile in CNY
  beforeEach(async function () {
    // Get accounts
    [
      escrow_manager,
      stable_coin_issuer,
      data_vendor,
      option_seller1,
      option_seller2,
      option_buyer1,
      option_buyer2,
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
    const EscrowAccount = await ethers.getContractFactory("EscrowAccount");
    const escrowPremiumTokenAccount = await EscrowAccount.connect(
      escrow_manager
    ).deploy(premiumToken.address, 1);
    await premiumToken.transferOwnership(
      await escrowPremiumTokenAccount.connect(escrow_manager).contractAddress()
    );
    escrowPremiumTokenAccount.connect(escrow_manager).unPause();
    await escrowPremiumTokenAccount
      .connect(escrow_manager)
      .processDepositTransaction(
        option_seller1.address,
        defaultTokenBalance,
        crypto.randomUUID()
      );
    await escrowPremiumTokenAccount
      .connect(escrow_manager)
      .processDepositTransaction(
        option_seller2.address,
        defaultTokenBalance,
        crypto.randomUUID()
      );
    await escrowPremiumTokenAccount
      .connect(escrow_manager)
      .processDepositTransaction(
        option_buyer1.address,
        defaultTokenBalance,
        crypto.randomUUID()
      );
    await escrowPremiumTokenAccount
      .connect(escrow_manager)
      .processDepositTransaction(
        option_buyer2.address,
        defaultTokenBalance,
        crypto.randomUUID()
      );
    const escrowSettlementTokenAccount = await EscrowAccount.connect(
      escrow_manager
    ).deploy(settlementToken.address, 1);
    await settlementToken.transferOwnership(
      await escrowSettlementTokenAccount
        .connect(escrow_manager)
        .contractAddress()
    );
    escrowSettlementTokenAccount.connect(escrow_manager).unPause();
    await escrowSettlementTokenAccount
      .connect(escrow_manager)
      .processDepositTransaction(
        option_seller1.address,
        defaultTokenBalance,
        crypto.randomUUID()
      );
    await escrowSettlementTokenAccount
      .connect(escrow_manager)
      .processDepositTransaction(
        option_seller2.address,
        defaultTokenBalance,
        crypto.randomUUID()
      );
    await escrowSettlementTokenAccount
      .connect(escrow_manager)
      .processDepositTransaction(
        option_buyer1.address,
        defaultTokenBalance,
        crypto.randomUUID()
      );
    await escrowSettlementTokenAccount
      .connect(escrow_manager)
      .processDepositTransaction(
        option_buyer2.address,
        defaultTokenBalance,
        crypto.randomUUID()
      );

    // Initialize forex rate and price feed
    var { EquityPrice, FXPrice } = await deployPriceContracts();
    fxPrice = await FXPrice.connect(data_vendor).deploy(
      "USDCNY",
      "USD/CNY Forex",
      data_vendor.address,
      fxDecimals
    );
    var { value, nonce, sig } = await signedValue(
      data_vendor,
      forexRate * 10 ** fxDecimals
    );
    await fxPrice
      .connect(data_vendor)
      .setVerifiedValue(value, nonce, ethers.utils.arrayify(sig));
    const actualFXValue = await fxPrice.connect(data_vendor).getVerifiedValue();
    console.log(
      "FX price feed created with ticker " +
        (await fxPrice.getTicker()) +
        " with initial rate " +
        actualFXValue / 10 ** fxDecimals
    );

    equityPrice = await EquityPrice.connect(data_vendor).deploy(
      "Underlying",
      "Underlying price",
      data_vendor.address,
      equityDecimals
    );
    var { value, nonce, sig } = await signedValue(
      data_vendor,
      underlyingPrice * 10 ** equityDecimals
    );
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
        actualValue / 10 ** equityDecimals
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

  async function getSimpleOption(optionName, option_seller, option_buyer) {
    const uniqueId = crypto.randomUUID();
    var simpleOption = await SimpleOption.connect(option_seller).deploy(
      uniqueId,
      optionName,
      optionName + "Desc",
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
