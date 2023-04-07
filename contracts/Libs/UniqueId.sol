// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

/**
 ** @notice Library to generate globally unique id's similar to GUIDs
 ** @dev COntract address etc is unique, but this is a functional id for contracts equiv to say ISIN
 */
library UniqueId {
    /**
     * @dev Generate a unique ID
     */
    function getUniqueId() public view returns (bytes32 id) {
        id = keccak256(
            abi.encodePacked(msg.sender, block.timestamp, block.difficulty)
        );
    }
}
