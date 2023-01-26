const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("SimpleERC20", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySimpleERC20() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const SimpleERC20 = await ethers.getContractFactory("SimpleERC20");
    const simpleERC20 = await SimpleERC20.deploy();

    return { simpleERC20, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should have zero total at inception", async function () {
      const { simpleERC20 } = await loadFixture(deploySimpleERC20);

      expect(await simpleERC20.totalSupply()).to.equal(0);
    });

    it("Should set the right owner", async function () {
      const { simpleERC20, owner } = await loadFixture(deploySimpleERC20);

      expect(await simpleERC20.owner()).to.equal(owner.address);
    });
  });

  describe("MintAndBurn", function () {
    it("Should have one unit after minting one", async function () {
      const { simpleERC20, owner } = await loadFixture(deploySimpleERC20);
      await simpleERC20.connect(owner).mint(1)
      expect(await simpleERC20.totalSupply()).to.equal(1);
    });

    it("Should fail if caller of mint is not the owner", async function () {
      const { simpleERC20, owner, otherAccount } = await loadFixture(deploySimpleERC20);
      await expect(simpleERC20.connect(otherAccount).mint(1)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Should have zero units after burning totalSupply", async function () {
      const { simpleERC20, owner } = await loadFixture(deploySimpleERC20);
      totalSupply = await simpleERC20.totalSupply();
      await simpleERC20.connect(owner).burn(totalSupply)
      expect(await simpleERC20.totalSupply()).to.equal(0);
    });

    it("Should fail if caller of burn is not the owner", async function () {
      const { simpleERC20, owner, otherAccount } = await loadFixture(deploySimpleERC20);
      await expect(simpleERC20.connect(otherAccount).burn(0)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });
});
