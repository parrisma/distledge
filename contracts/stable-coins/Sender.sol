// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract Sender {
    address private owner;

    constructor() public {
        owner = msg.sender;
    }

    function updateOwner(address newOwner) public {
        require(msg.sender == owner, "only current owner can update owner");
        owner = newOwner;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
