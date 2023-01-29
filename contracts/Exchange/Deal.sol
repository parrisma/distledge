// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
 ** All Deals must implment this abstract interface so they can be managed by the Exchange contract
 */
abstract contract Deal is Ownable {
    /*
     ** Execute the deal (one shot)
     */
    function execute() public virtual returns (bool);
}
