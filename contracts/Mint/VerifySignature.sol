// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VerifySignature {
    function recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) public view returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        bytes memory prefix = "\x19Ethereum Signed Message:\n32"; // This prefix is added by Etherium when sent.
        bytes32 prefixedHash = keccak256(
            abi.encodePacked(prefix, _ethSignedMessageHash)
        );
        return ecrecover(prefixedHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
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

    function verifiedData(
        uint256 number_,
        string memory message_,
        bytes memory sig
    ) public view returns (address) {
        bytes32 hashedMessage = keccak256(abi.encodePacked(number_, message_));
        console.logBytes32(hashedMessage);
        return recoverSigner(hashedMessage, sig);
    }
}
