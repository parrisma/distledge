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

module.exports = {
    signedValue
}