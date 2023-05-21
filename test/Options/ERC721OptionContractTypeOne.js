const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const crypto = require("crypto");
const { TASK_NODE } = require("hardhat/builtin-tasks/task-names");
const { ethers } = require("hardhat");


/*
** Take Json object and return signature of terms.
*/
async function getSignedHashOfOptionTerms(terms, signingAccount) {
    const secretMessage = ethers.utils.solidityPack(["string"], [JSON.stringify(terms)]);

    /* We now hash the message, and we will sign the hash of the message rather than the raw
    ** raw encoded (packed) message
    */
    const secretMessageHash = ethers.utils.keccak256(secretMessage);

    /*
    ** The message is now signed by the signingAccount
    */
    const sig = await signingAccount.signMessage(ethers.utils.arrayify(secretMessageHash)); // Don't forget to arrayify to send bytes

    return sig;
}

/*
**
*/
async function verifySignedTerms(terms, signingAccount, ERC721OptionURI) {
    // Split URI to extract signature
    signature = (ERC721OptionURI.split("/"))[4];

    // Hash the terms
    const secretMessage = ethers.utils.solidityPack(["string"], [JSON.stringify(terms)]);
    const secretMessageHash = ethers.utils.keccak256(secretMessage);

    /*
    ** We now use ethers to verify the message, this will return the account that signed the message. ONLY is the message and
    ** signature match. In most cases this function will return an address, but it will only return the signer address if
    ** every thing lines up.
    */
    const ethersRecoveredSigner = await ethers.utils.verifyMessage(ethers.utils.arrayify(secretMessageHash), ethers.utils.arrayify(signature)); // arrayify 

    return ethersRecoveredSigner == signingAccount.address;
}

/*
* This suite tests the ERC721 Option Type One.
*/
describe("ERC721 Option Test Suite", function () {

    /*
    ** Test constants.
    */
    const expectedBaseURI = "http://localhost:8191";
    const testBaseURI = "http::/test:1234";
    const expectedName = "Option Contract Type 1";
    const expectedSymbol = "OptT1";

    /*
    ** Define accounts to be used by all tests.
    */
    let owner;
    let traderOne;
    let traderTwo;
    let agent;

    // Master ERC721 Contract
    let erc721OptionContractTypeOne;

    // Payment Token
    let erc20USDStableCoin;

    // Test terms for an option.
    optionOneTerms =
    {
        "term_one": "Term One Value - 1",
        "term_two": 3241,
        "term_three": {
            "term_four": "577c146e-ecaf-11ed-a05b-0242ac120003",
            "term_five": 453209756635401243
        }
    }

    optionTwoTerms =
    {
        "term_one": "Term One Value - 2",
        "term_two": 6482,
        "term_three": {
            "term_four": "88bcd61a-3591-45c9-b1c2-34377ff61ef5",
            "term_five": 786450934733123
        }
    }

    /**
     * Create the ERC721 Contract Against which all the tests will run.
     */
    before(async function () {
        console.log(`\t>> Starting set-up that runs once before all tests`);

        // Assign accounts.
        [owner, traderOne, traderTwo, agent] = await ethers.getSigners();

        // Create the ERC721 Option Contract.
        const ERC721OptionContractTypeOne = await ethers.getContractFactory("ERC721OptionContractTypeOne");
        erc721OptionContractTypeOne = await ERC721OptionContractTypeOne.deploy();

        //Token that will be used for option transfer - but could be any ERC20 token.
        const ERC20USDStableCoin = await ethers.getContractFactory("ERC20USDStableCoin");
        erc20USDStableCoin = await ERC20USDStableCoin.deploy();
        await erc20USDStableCoin.connect(owner).mint(300);
        await erc20USDStableCoin.connect(owner).transfer(traderOne.address, 100);
        await erc20USDStableCoin.connect(owner).transfer(traderTwo.address, 100);

        console.log(`\t<< Done set-up that runs once before all tests\n\n`);
    });

    it("ERC20 SetUp Checks", async function () {
        expect(await erc20USDStableCoin.connect(owner).balanceOf(owner.address)).to.equal(100);
        expect(await erc20USDStableCoin.connect(owner).balanceOf(traderOne.address)).to.equal(100);
        expect(await erc20USDStableCoin.connect(owner).balanceOf(traderTwo.address)).to.equal(100);
    });

    it("ERC721 Option Basic Checks", async function () {
        expect(await erc721OptionContractTypeOne.connect(owner).name()).to.equal(expectedName);
        expect(await erc721OptionContractTypeOne.connect(owner).symbol()).to.equal(expectedSymbol);
        expect(await erc721OptionContractTypeOne.connect(owner).getBaseURI()).to.equal(expectedBaseURI);
        expect(await erc721OptionContractTypeOne.connect(owner).balanceOf(owner.address)).to.equal(0);
        expect(await erc721OptionContractTypeOne.connect(owner).balanceOf(traderOne.address)).to.equal(0);
        expect(await erc721OptionContractTypeOne.connect(owner).balanceOf(traderTwo.address)).to.equal(0);
        expect(await erc721OptionContractTypeOne.connect(owner).exists(0)).to.equal(false); // No options yet minted
    });

    it("ERC721 Option Base URI Checks", async function () {
        await expect(erc721OptionContractTypeOne.connect(traderOne).setBaseURI("NotOwnerSoShouldRevert")).to.be.revertedWith(
            "Ownable: caller is not the owner"
        );

        await expect(erc721OptionContractTypeOne.connect(owner).setBaseURI(testBaseURI))
            .to.emit(erc721OptionContractTypeOne, 'ChangeOfBaseURI')
            .withArgs(expectedBaseURI, testBaseURI);
        expect(await erc721OptionContractTypeOne.connect(owner).getBaseURI()).to.equal(testBaseURI);

        await expect(erc721OptionContractTypeOne.connect(owner).setBaseURI(expectedBaseURI))
            .to.emit(erc721OptionContractTypeOne, 'ChangeOfBaseURI')
            .withArgs(testBaseURI, expectedBaseURI);
        expect(await erc721OptionContractTypeOne.connect(owner).getBaseURI()).to.equal(expectedBaseURI);
    });

    it("ERC721 Option Mint", async function () {
        await expect(erc721OptionContractTypeOne.connect(traderOne).mintOption("NotOwnerSoShouldRevert")).to.be.revertedWith(
            "Ownable: caller is not the owner"
        );

        const expectedOptionId = 1;
        signedHashOfTerms = await getSignedHashOfOptionTerms(optionOneTerms, owner);
        const expectedOptionURI = `${expectedBaseURI}/${expectedOptionId}/${signedHashOfTerms}`
        await expect(erc721OptionContractTypeOne.connect(owner).mintOption(signedHashOfTerms))
            .to.emit(erc721OptionContractTypeOne, 'OptionMinted')
            .withArgs(expectedOptionURI);

        expect(await verifySignedTerms(optionOneTerms, owner, expectedOptionURI)).to.equal(true);
        expect(await erc721OptionContractTypeOne.connect(owner).balanceOf(owner.address)).to.equal(1);
        expect(await erc721OptionContractTypeOne.connect(owner).tokenURI(expectedOptionId)).to.equal(expectedOptionURI);
    });

    it("ERC721 Option Burn", async function () {
        // Burns the option created by Option Mint tests.

        const nonExistentOptionId = 99999;
        await expect(erc721OptionContractTypeOne.connect(traderOne).burnOption(nonExistentOptionId)).to.be.revertedWith(
            "Ownable: caller is not the owner"
        );

        await expect(erc721OptionContractTypeOne.connect(owner).burnOption(nonExistentOptionId)).to.be.revertedWith(
            "ERC721: invalid token ID"
        );

        const optionIdCreatedByMintTest = 1;
        signedHashOfTerms = await getSignedHashOfOptionTerms(optionOneTerms, owner);
        expect(await erc721OptionContractTypeOne.connect(owner).exists(optionIdCreatedByMintTest)).to.equal(true);
        const expectedOptionURI = `${expectedBaseURI}/${optionIdCreatedByMintTest}/${signedHashOfTerms}`
        await expect(erc721OptionContractTypeOne.connect(owner).burnOption(optionIdCreatedByMintTest))
            .to.emit(erc721OptionContractTypeOne, 'OptionBurned')
            .withArgs(expectedOptionURI);

        expect(await erc721OptionContractTypeOne.connect(owner).balanceOf(owner.address)).to.equal(0);
        expect(await erc721OptionContractTypeOne.connect(owner).exists(optionIdCreatedByMintTest)).to.equal(false);
    });

    it("ERC721 Mint and Transfer", async function () {

        // Mint an Option that can be transferred
        const expectedOptionId = 2;
        expect(await erc721OptionContractTypeOne.connect(owner).exists(expectedOptionId)).to.equal(false);
        signedHashOfTerms = await getSignedHashOfOptionTerms(optionOneTerms, owner);
        const expectedOptionURI = `${expectedBaseURI}/${expectedOptionId}/${signedHashOfTerms}`
        await expect(erc721OptionContractTypeOne.connect(owner).mintOption(signedHashOfTerms))
            .to.emit(erc721OptionContractTypeOne, 'OptionMinted')
            .withArgs(expectedOptionURI);
        expect(await erc721OptionContractTypeOne.connect(owner).balanceOf(owner.address)).to.equal(1);
        expect(await erc721OptionContractTypeOne.connect(owner).exists(expectedOptionId)).to.equal(true);


        const paymentAmount = 25;
        // Transfer will fail, if buyer does not have required funds authorized, for current owner to transfer
        await expect(erc721OptionContractTypeOne.connect(owner).safeTransferOptionFrom(owner.address, traderOne.address, expectedOptionId, erc20USDStableCoin.address, paymentAmount)).to.be.revertedWith(
            "ERC20: insufficient allowance"
        );

        // Grant allowance, so contract can spend buyer ERC20 tokens.
        await expect(await erc20USDStableCoin.connect(traderOne).approve(erc721OptionContractTypeOne.address, paymentAmount))
            .to.emit(erc20USDStableCoin, 'Approval')
            .withArgs(traderOne.address, erc721OptionContractTypeOne.address, paymentAmount);

        // Transfer will fail, if seller has not approved transfer
        await expect(erc721OptionContractTypeOne.connect(agent).safeTransferOptionFrom(
            owner.address,
            traderOne.address,
            expectedOptionId,
            erc20USDStableCoin.address,
            paymentAmount)).to.be.revertedWith(
                "ERC721: caller is not token owner or approved"
            );

        // Approve transfer of Option NFT
        await expect(await erc721OptionContractTypeOne.connect(owner).approve(traderOne.address, expectedOptionId))
            .to.emit(erc721OptionContractTypeOne, 'Approval')
            .withArgs(owner.address, traderOne.address, expectedOptionId);

        // Transfer will fail, if seller has not approved transfer
        await expect(erc721OptionContractTypeOne.connect(owner).safeTransferOptionFrom(
            owner.address,
            traderOne.address,
            expectedOptionId,
            erc20USDStableCoin.address,
            paymentAmount)
        )
            .to.emit(erc721OptionContractTypeOne, 'OptionTransfer')
            .withArgs(expectedOptionURI, owner.address, traderOne.address);

        // Check Token Balances
        expect(await erc20USDStableCoin.connect(owner).balanceOf(owner.address)).to.equal(125);
        expect(await erc20USDStableCoin.connect(owner).balanceOf(traderOne.address)).to.equal(75);
        expect(await erc20USDStableCoin.connect(owner).balanceOf(traderTwo.address)).to.equal(100);

        // Check Option NFT Balances
        expect(await erc721OptionContractTypeOne.connect(owner).balanceOf(owner.address)).to.equal(0);
        expect(await erc721OptionContractTypeOne.connect(owner).balanceOf(traderOne.address)).to.equal(1);
        expect(await erc721OptionContractTypeOne.connect(owner).balanceOf(traderTwo.address)).to.equal(0);
    });

});