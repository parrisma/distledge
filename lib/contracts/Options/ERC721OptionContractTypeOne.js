require('module-alias/register'); // npm i --save module-alias
const { getSignedHashOfOptionTerms } = require("@scripts/lib/signedValue");
const { isNumeric } = require("@lib/generalUtil");
const { getAccount, isSameAddress } = require("@scripts/lib/accounts");
const { persistDeleteOneTerm, persistOptionIdExists } = require("@webserver/serverPersist");

/**
 * Ask the ERC721 Option NFT Contract if the given OptionId has been minted
 * 
 * @param {*} erc721OptionNFTContract - The ERC721 Option NFT contract to Ask
 * @param {*} optionId - The option terms as JSON
 * @param {*} managerAccount - The manager account that will sign the terms
 * @returns optionID (NFT Id) minted by ERC721, the Hash of the terms & the full NFT URI 
 */
async function erc721OptionNFTExists(
    erc721OptionNFTContract,
    optionId) {
    const exists = await erc721OptionNFTContract.exists(optionId);
    return exists;
}

/**
 * Request the ERC721 Option NFT Contract to mint a new Option NFT for the given option Terms.
 * 
 * @param {*} erc721OptionNFTContract - The ERC721 Option NFT contract to Ask
 * @param {*} optionTermsAsJson - The option terms as JSON
 * @param {*} managerAccount - The manager account to sign the terms
 * @param {*} issuerAddress - The address of the issuer account
 * @returns True if ERC721 Option NFT Contract confirms option ID exists else False.
 */
async function mintERC721OptionNFT(
    erc721OptionNFTContract,
    optionTermsAsJson,
    managerAccount,
    issuerAddress) {

    /**
     *  Convert option terms to string, ready to be hashed and signed
     */
    optionTermsAsString = undefined
    if (optionTermsAsJson !== undefined && optionTermsAsJson !== null && optionTermsAsJson.constructor == Object) {
        optionTermsAsString = JSON.stringify(optionTermsAsJson);
    } else {
        optionTermsAsString = optionTermsAsJson; // Already a string
    }

    /**
     * Created a signed hash of terms & request the ERC721 contract to mint an associated NFT. This will return am NTF URI
     * that the WebServer will honour. At this point the option terms are not saved, as the WebServer needs to know the 
     * unique optionId (NTF Id) that is allocated ny the ERC721 contract. So there is a risk here that we mint an NFT and
     * the associated resources (file) is never created by the WebServer. This is inherent risk of this model of keeping
     * off chain details, so we just need to ensure there is error handling and that we burn any hanging NFT's
     */
    sig = await getSignedHashOfOptionTerms(optionTermsAsString, managerAccount);
    const txResponse = await erc721OptionNFTContract.mintOption(sig);
    const txReceipt = await txResponse.wait();
    var response = undefined;
    for (var j = 0; j < txReceipt.events.length; j++) { // There can be more than one event in response
        const e = txReceipt.events[j];
        if (e["event"] === "OptionMinted") {
            response = e["args"];
            break;
        }
    }
    if (null === response) {
        throw new Error(`Missing expected response from mintOption`);
    }

    /**
     * The response is the full URI that contains the newly allocated option id, so we break down the URI & verify that
     * the URI also contains the expected hash of the terms.
     */
    const uriParts = `${response}`.split("/");
    if (5 != uriParts.length) {
        throw new Error(`Unexpected response from ERC721 Contract for option mint, expected URI but got [${response}]`);
    }
    const optionId = uriParts[3];
    const mintedSignedHash = uriParts[4];
    if (`${sig}` !== mintedSignedHash) {
        throw new Error(`Minted Option NFT URI hash does not match expected hash, got [${mintedSignedHash}] expected [${sig}]`)
    }
    if (!isNumeric(`${optionId}`)) {
        throw new Error(`Malformed minted Option NFT UTI, option id was non numeric :[${optionId}]`)
    }

    /**
     * Option is minted as owner by manager account, so we do a zero cost transfer to sellerAddress
     */
    await erc721OptionNFTContract.connect(managerAccount).approve(issuerAddress, Number(optionId));

    await erc721OptionNFTContract.connect(managerAccount).safeTransferOptionFrom(
        managerAccount.address,
        issuerAddress,
        Number(optionId),
        optionTermsAsJson.settlementToken,
        Number(0));

    return [Number(optionId), mintedSignedHash, response];
}

async function settleERC721OptionNFT(
    erc721OptionNFTContract,
    premiumTokenContract,
    managerAccount,
    issuerAddress,
    buyerAddress,
    premiumToken,
    premiumAmount,
    mintedOptionId) {

    /**
     * This will throw an ERC20 insufficient allowance error, unless the buyer has pre
     * authorized the premium transfer. This cannot be done in the web server as we don't
     * have access (we are no logged in vla MetaMask or ..) to the buyer account. All we
     * know here is the raw Hax address to transfer to. 
     * 
     * So the authorization call below must be done in the UI that is logged in as buyer
     * or in the test script calling the WebService that has the buyer account object,
     * 
     * -> premiumTokenContract.connect(buyerAddress).approve(sellerAddress, premiumAmount);
     */

    const issuerAccount = await getAccount(issuerAddress);
    const premiumInDecimal = Number(await premiumTokenContract.unitsPerToken()) * Number(premiumAmount);

    // const buyerAccount = await getAccount(buyerAddress);
    // console.log(`Authorizing premium payment of [${premiumAmount}, ${premiumInDecimal} in decimals] from Buyer [${buyerAddress}] to Seller [${issuerAddress}]`);
    // await premiumTokenContract.connect(buyerAccount).approve(erc721OptionNFTContract.address, premiumInDecimal); // Authorize payment to ERC721 contract.

    const oo = erc721OptionNFTContract.connect(managerAccount).ownerOf(mintedOptionId);
    await erc721OptionNFTContract.connect(issuerAccount).approve(buyerAddress, Number(mintedOptionId));
    await erc721OptionNFTContract.connect(issuerAccount).safeTransferOptionFrom(
        issuerAddress,
        buyerAddress,
        mintedOptionId,
        premiumToken,
        premiumInDecimal
    );
}

/**
 * Exercise the given option as follows.
 * 
 * @param {*} erc721OptionNFTContract - The ERC721 Contract NFT was issued from
 * @param {*} settlementTokenContract - The Token the settlement value is to be paid in
 * @param {*} managerAccount - The Address of the control account
 * @param {*} issuerAddress - Address of the account that issued (sold) the option originally
 * @param {*} exerciseAddress - Address of the current NFT Owner
 * @param {*} nftOptionId - The ERC721 NFT Id to be exercised
 * @param {*} settlementFXLevelContract - The Level contract that supplies the settle FX rate
 * @param {*} settlementValue - The value to be transferred from seller to buyer
 * @param {*} referenceLevelContract - The valuation reference level.
 */
async function exerciseERC721OptionNFT(
    erc721OptionNFTContract,
    settlementTokenContract,
    managerAccount,
    issuerAddress,
    exerciseAddress,
    nftOptionId,
    settlementFXLevelContract,
    settlementValue,
    referenceLevelContract) {

    console.log(`start exercise. 
            Issuer Account:[${issuerAddress}], 
            Current Owner :[${exerciseAddress}], 
            Manager Account:[${managerAccount.address}], 
            NFT Id:[${nftOptionId}], 
            Settlement FX:[${settlementFXLevelContract.address}], 
            Settlement Value:[${settlementValue}]`);


    const issuerAccount = await getAccount(issuerAddress);
    const exerciseAccount = await getAccount(exerciseAddress);

    /**
     * Check account requesting exercise is the current owner.
     */
    const currentOwnerAddress = await erc721OptionNFTContract.connect(managerAccount).ownerOf(Number(nftOptionId));
    if (!isSameAddress(currentOwnerAddress, exerciseAddress)) {
        throw new Error(`[${exerciseAddress}] is not current owner of [[${nftOptionId}]], so cannot exercise it, [${currentOwnerAddress}] is the owner`)
    }

    /**
     * Calculate the settlement value = value * settlementFx
     */
    const settleFxRate = Number(await settlementFXLevelContract.connect(managerAccount).getVerifiedValue());
    if (isNaN(settleFxRate)) {
        throw new Error(`Failed to get settlement FX rate for exercise from Level [${settlementFXLevelContract.address}]`);
    }
    const settleFXDecimals = await settlementFXLevelContract.connect(managerAccount).getDecimals();
    if (isNaN(settleFXDecimals)) {
        throw new Error(`Failed to get settlement Fx decimals for exercise from Level [${settlementFXLevelContract.address}]`);
    }
    const settleDecimals = await settlementTokenContract.connect(managerAccount).decimals();
    if (isNaN(settleDecimals)) {
        throw new Error(`Failed to get settlement decimals for exercise from Token [${settlementTokenContract.address}]`);
    }
    const refDecimals = await referenceLevelContract.connect(managerAccount).getDecimals();
    if (isNaN(refDecimals)) {
        throw new Error(`Failed to get settlement decimals for exercise from Token [${referenceLevelContract.address}]`);
    }

    var settlementValue = ((settlementValue / (10 ** refDecimals)) * (settleFxRate / (10 ** settleFXDecimals))) * (10 ** settleDecimals);
    settlementValue = Math.floor(settlementValue);

    /**
     * Check issuer can afford to settle the option value.
     */
    availableBalance = Number(await settlementTokenContract.connect(managerAccount).balanceOf(issuerAddress));
    if (availableBalance < settlementValue) {
        throw new Error(`Issuer [${issuerAddress}] has insufficient funds to settle, needs [${settlementValue}] but only has [${availableBalance}]`);
    }

    /**
     * Current Owner (exerciseAccount) to Authorize NFT transfer back to Issuer
     */
    await erc721OptionNFTContract.connect(exerciseAccount).approve(issuerAccount.address, nftOptionId);

    /**
     * issuerAccount to authorize payment of settlement amount to exerciseAccount
     */
    await settlementTokenContract.connect(issuerAccount).approve(erc721OptionNFTContract.address, settlementValue);

    /**
     * Atomic call to transfer both NFT & Settlement - either both will pass or neither
     */
    try {
        await erc721OptionNFTContract.connect(exerciseAccount).safeTransferOptionFrom(
            exerciseAddress,
            issuerAddress,
            nftOptionId,
            settlementTokenContract.address,
            settlementValue
        );
    } catch (err) {
        throw new Error(`ERC721 Contract [${nftOptionId}] - failed to exercise - safeTransferOptionFrom returned [${err.message}]`);
    }

    const newOwner = await erc721OptionNFTContract.connect(managerAccount).ownerOf(Number(nftOptionId));
    if (!isSameAddress(newOwner, issuerAddress)) {
        throw new Error(`Failed to exercise [${nftOptionId}] owner transfer failed from [${issuerAddress}] to [${newOwner}]`);
    }

    /**
     * The option can now be burned as it is exercised and all value is settled.
     */
    await erc721OptionNFTContract.connect(managerAccount).burnOption(nftOptionId);
    nftOptionIdExists = await erc721OptionNFTContract.connect(managerAccount).exists(Number(nftOptionId));
    if (nftOptionIdExists) {
        throw new Error(`Failed to burn [[${nftOptionId}]] after exercise`)
    }

    /**
     * Clean up the persisted option terms
     */
    await deleteHandler(optionId);

    console.log(`Exercise of [${nftOptionId}] - all OK`);

    return;
}

/**
 * Delete the persisted terms of the given option id
 * @param {*} optionId - The Option Id for which terms are to be deleted.
 */
async function deleteHandler(optionId) {
    console.log(`Handle Delete Option Terms Request for NFT Id [${optionId}]`);
    if (await persistOptionIdExists(optionId)) {
        await persistDeleteOneTerm(optionId);
    } else {
        console.error(`The Option [${optionId}] does not existed.`)
    }
}

module.exports = {
    mintERC721OptionNFT,
    erc721OptionNFTExists,
    settleERC721OptionNFT,
    exerciseERC721OptionNFT
};