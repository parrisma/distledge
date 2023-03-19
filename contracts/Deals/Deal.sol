// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 ** @notice An interface definition for deals where there is an exchange of value based on
 ** @notice ERC20 tokens.
 **
 ** @dev All Deals must implment this interface so they can be managed by the Exchange contract
 */
abstract contract Deal is Ownable {
    /**
     ** @notice Execute the deal (one shot) 
     */
    function execute() public virtual returns (bool);

    /**
     ** @notice A ticker (symbol) for the deal
     ** @return A globally unique string that for the type of deal.
     */
    function ticker() public virtual returns (string memory);

    /**
     ** @notice The number of seconds the deal has remaining before it cannot be executed
     ** @return Number of seconds before deal cannot be executed.
     */
    function timeToLive() public view virtual returns (uint256);

    /**
     ** @notice The seller offering the deal.
     ** @return address of seller offering the deal
     */
    function seller() public view virtual returns (address);
}
