require('module-alias/register'); // npm i --save module-alias
const { getSignedHashOfOptionTerms } = require("@scripts/lib/signedValue");
const { isNumeric } = require("@lib/generalUtil");
const { getAccount } = require("@scripts/lib/accounts");
const { persistDeleteOneTerm,persistOptionIdExists } = require("@webserver/serverPersist");

/**
 * Ask the ERC721 Option NFT Contract if the given OptionId has been minted
 * 
 * @param {*} erc721OptionNFTContract - The ERC721 Option NFT contract to Ask
 * @param {*} optionId - The option terms as JSON
 * @param {*} managerAccount - The manager account that will sign the terms
 * @returns optionID (NFT Id) minted by ERC721, the Hash of teh terms & the full NFT URI 
 */
async function erc721OptionNFTExists(
    erc721OptionNFTContract,
    optionId) {
    const exists = await erc721OptionNFTContract.exists(optionId);
    return exists;
}

async function transferOwnerToManagerAccount(erc721OptionNFTContract, managerAccount) {
    await erc721OptionNFTContract.transferOwnership(managerAccount);
}

/**
 * Request the ERC721 Option NFT Contract to mint a new Option NFT for the given option Terms.
 * @param {*} erc721OptionNFTContract - The ERC721 Option NFT contract to Ask
 * @param {*} optionTermsAsJson - The option terms as JSON
 * @returns True if ERC721 Option NFT Contract confirms option ID exists else False.
 */
async function mintERC721OptionNFT(
    erc721OptionNFTContract,
    optionTermsAsJson,
    managerAccount) {

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
    return [Number(optionId), mintedSignedHash, response];
}

async function settleERC721OptionNFT(
    erc721OptionNFTContract,
    premiumTokenContract,
    managerAccount,
    sellerAddress,
    buyerAddress,
    premiumToken,
    premiumAmount,
    mintedOptionId) {

    const buyerBalance = await premiumTokenContract.balanceOf(buyerAddress);

    /**
     * This will throw an ERC20 insufficient allowance error, unless the buyer has pre
     * authorized the premium transfer. This cannot be done in teh web server as we don't
     * have access (we are no logged in vla MetaMask or ..) to the buyer account. All we
     * know here is teh raw Hax address to transfer to. 
     * 
     * So the authorization call below must be done in the UI that is logged in as buyer
     * or in the test script calling the WebService that has the buyer account object,
     * 
     * -> premiumTokenContract.connect(buyerAddress).approve(sellerAddress, premiumAmount);
     */

    const buyerAccount = await getAccount(buyerAddress);
    const premiumInDecimal = Number(await premiumTokenContract.unitsPerToken()) * Number(premiumAmount);

    console.log(`Authorizing premium payment of [${premiumAmount}, ${premiumInDecimal} in decimals] from Buyer [${buyerAddress}] to Seller [${sellerAddress}]`);
    await premiumTokenContract.connect(buyerAccount).approve(erc721OptionNFTContract.address, premiumInDecimal); // Authorize payment to ERC721 contract.

    await erc721OptionNFTContract.connect(managerAccount).approve(buyerAddress, mintedOptionId);
    await erc721OptionNFTContract.connect(managerAccount).safeTransferOptionFrom(
        sellerAddress,
        buyerAddress,
        mintedOptionId,
        premiumToken,
        premiumInDecimal, // Transfer premium taking decimals as account
        false
    );
}

async function exerciseERC721OptionNFT(
    erc721OptionNFTContract,
    settlementTokenContract,
    managerAccount,
    sellerAddress,
    buyerAddress,
    uniqueId,
    settlementToken,
    settlementValue) {

        console.log(`start exercise. 
            sellerAddress:${sellerAddress}, 
            buyerAddress:${buyerAddress}, 
            managerAccount:${managerAccount.address}, 
            uniqueId:${uniqueId}, 
            settlementToken:${settlementToken}, 
            settlementValue:${settlementValue}`);
        
        const sellerAccount = await getAccount(sellerAddress);
        const buyerAccount = await getAccount(buyerAddress);
       
        const settlementValueInDecimal = 10 ** Number(await settlementTokenContract.decimals()) * Number(settlementValue);

        
        await settlementTokenContract.connect(sellerAccount).approve(erc721OptionNFTContract.address, settlementValueInDecimal); // Authorize payment to ERC721 contract.
        await erc721OptionNFTContract.connect(buyerAccount).approve(managerAccount.address, uniqueId);
       
        await erc721OptionNFTContract.connect(managerAccount).safeTransferOptionFrom(
            buyerAddress,
            sellerAddress,
            uniqueId,
            settlementToken,
            settlementValue
        );

        await erc721OptionNFTContract.connect(managerAccount).burnOption(uniqueId);

        await deleteHandler(optionId);

        console.log("finish exercise.");
}

async function deleteHandler(optionId) {
    console.log(`Handle Delete One Terms Request`);
    if (await persistOptionIdExists(optionId)) {
        await persistDeleteOneTerm(optionId);
    } else {
        console.error(`The Option [${optionId}]is not existed.`)
    }
}

module.exports = {
    mintERC721OptionNFT,
    erc721OptionNFTExists,
    settleERC721OptionNFT,
    exerciseERC721OptionNFT
};