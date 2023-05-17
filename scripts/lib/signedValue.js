require('module-alias/register'); // npm i --save module-alias

/**
 * Take the given value, create a nonce and then a signature from the given signer address
 * @param {*} hre Hardhat runtime environment
 * @param {Signer address} signer The signer account to use to create the signature
 * @param {float} value The value to sign.
 * @returns {value, nonce, sig} The Value passed, the nonce used and the signature created
 */
async function signedValue(hre, signer, value) {
    // Create a signed message
    const nonce = Math.floor(Date.now());
    const secretMessage = hre.ethers.utils.solidityPack(["uint256", "uint256"], [value, nonce]);
    const secretMessageHash = hre.ethers.utils.keccak256(secretMessage);
    const sig = await signer.signMessage(ethers.utils.arrayify(secretMessageHash)); // Now signed as secure source
    return { value, nonce, sig }
}

/**
* Take Json object and return signature of terms.
* @param {termsAsJson} the option terms to be signed as a JSON object
* @param {signingAccount} the account to use to sign the terms
*/
async function getSignedHashOfOptionTerms(termsAsJson,
    signingAccount) {
    const secretMessage = ethers.utils.solidityPack(["string"], [JSON.stringify(termsAsJson)]);

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

module.exports = {
    signedValue,
    getSignedHashOfOptionTerms
}