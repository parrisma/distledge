const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const crypto = require('crypto');

const symbol = "SECS";
const description = "Secure Source Description";
const decimals = 2;

describe("Equity Price Test Suite", function () {
  async function deployEquityPrice() {
    // Get named accounts & deploy SecureLevel contract
    const [owner, secure_source, other_source] = await ethers.getSigners();

    // Deploy Library
    const VerifySignerLib = await ethers.getContractFactory("VerifySigner");
    const verifySignerLib = await VerifySignerLib.deploy();
    await verifySignerLib.deployed();

    const EquityPrice = await ethers.getContractFactory("EquityPrice", {
      libraries: {
        VerifySigner: verifySignerLib.address,
      },
    });
    const equityPrice = await EquityPrice.connect(owner).deploy(symbol, description, secure_source.address, decimals);

    return { equityPrice, owner, secure_source, other_source }
  }

  async function signedValue(signer, value) {
    // Create a signed message
    const nonce = Math.floor(Date.now());
    const secretMessage = ethers.utils.solidityPack(["uint256", "uint256"], [value, nonce]);
    const secretMessageHash = ethers.utils.keccak256(secretMessage);
    const sig = await signer.signMessage(ethers.utils.arrayify(secretMessageHash)); // Now signed as secure source
    return { value, nonce, sig }
  }

  it("Equity Price Construct and Set", async function () {

    var { equityPrice, owner, secure_source, other_source } = await loadFixture(deployEquityPrice);

    var expectedPx = 50;
    var { value, nonce, sig } = await signedValue(secure_source, expectedPx);
    await expect(equityPrice.connect(secure_source).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig)))
      .to.emit(equityPrice, 'LevelUpdated')
      .withArgs(value);

    var expectedPx = expectedPx + 1;
    var { value, nonce, sig } = await signedValue(secure_source, expectedPx);
    await expect(equityPrice.connect(secure_source).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig)))
      .to.emit(equityPrice, 'LevelUpdated')
      .withArgs(value);
  });

  it("Equity Price OK when set to zero", async function () {

    var { equityPrice, owner, secure_source, other_source } = await loadFixture(deployEquityPrice);

    var expectedPx = 0;
    var { value, nonce, sig } = await signedValue(secure_source, expectedPx);
    await expect(equityPrice.connect(secure_source).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig)))
      .to.emit(equityPrice, 'LevelUpdated')
      .withArgs(value);
  });

  it("Equity Price will be rejected when price is negative figure", async function () {
    //Define the bad price.
    var { equityPrice, owner, secure_source, other_source } = await loadFixture(deployEquityPrice);

    var expectedPx = -1;
    var { value, nonce, sig } = await signedValue(secure_source, expectedPx);
    await expect(equityPrice.connect(secure_source).setVerifiedValue(value, nonce, ethers.utils.arrayify(sig))).to.be.revertedWith(
      "SecureLevel: Constraint set for value update greater than or equal to zero"
    );
  });
});
