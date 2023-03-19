// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "hardhat/console.sol";

/**
 ** Library to enforce signing of data sent to contract methods.
 */
library VerifySigner {
    /**
     ** @dev Extract the signer address from the given hashed message
     **
     ** @param ethSignedMessageHash - The messages as signed by Ethereum - send from another contract or Javascript client
     ** @param signature - The signature the signed message as signed with.
     */
    function recoverSigner(
        bytes32 ethSignedMessageHash,
        bytes memory signature
    ) private pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        bytes memory prefix = "\x19Ethereum Signed Message:\n32"; // This prefix is added by Etherium when sent.
        bytes32 prefixedHash = keccak256(
            abi.encodePacked(prefix, ethSignedMessageHash)
        );
        return ecrecover(prefixedHash, v, r, s);
    }

    /**
     ** @dev Break down the signature into its constituant parts so it can be used to determin the signer
     ** @return (r, s, v) - signature consituants required to be passed to 'ecrecover'
     */
    function splitSignature(
        bytes memory sig
    ) private pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }
    }

    /**
     ** @dev Return true if the hashed data was signed by the given sender
     **
     ** @param expectedSender - The address of the account we are testing the data to have been signed by
     ** @param hashedData - A hash of the data that should have been signed by the expected sender
     ** @param sig - The signature to test with.
     */
    function checkVerifiedSender(
        address expectedSender,
        bytes32 hashedData,
        bytes memory sig
    ) public pure returns (bool) {
        address signer = recoverSigner(hashedData, sig);
        return (expectedSender == signer);
    }
}
