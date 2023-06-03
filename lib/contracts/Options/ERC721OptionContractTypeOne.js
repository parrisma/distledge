require('module-alias/register'); // npm i --save module-alias
const { getSignedHashOfOptionTerms } = require("@scripts/lib/signedValue");
const { isNumeric } = require("@lib/generalUtil");

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
    sellerAccount,
    buyerAccount,
    premiumToken,
    premiumAmount,
    mintedOptionId) {
    // // Approve premium token transfer
    // await premiumTokenContract
    //     .approve(erc721OptionNFTContract.address, 
    //         premiumAmount);

    // // Approve option transfer
    // await erc721OptionContractTypeOne
    //     .approve(buyerAccount, mintedOptionId);
    const buyerBalance = await premiumTokenContract.balanceOf(buyerAccount);

    // const exists = await erc721OptionNFTContract.exists(mintedOptionId); // This works fine
    // await erc721OptionNFTContract.burnOption(mintedOptionId); // This works fine

    await erc721OptionNFTContract.safeTransferOptionFrom(
        buyerAccount,
        sellerAccount,
        mintedOptionId,
        premiumToken,
        premiumAmount
    );
}

module.exports = {
    mintERC721OptionNFT,
    erc721OptionNFTExists,
    settleERC721OptionNFT
};