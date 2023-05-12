// SPDX-License-Identifier: MIT

// Abstract Base contract for Option Register

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 ** @author Mark Parris
 ** @title Implements protocol for option registration
 */
abstract contract OptionRegister is Ownable, Pausable {
    event OptionRegistered(address _seller, address _optionContract);
    event OptionPurged(address _optionContract);

    /**
     ** Service starts in paused state for security
     */
    constructor() Ownable() Pausable() {
        super._pause();
    }

    /**
     ** @notice Add a record of the given contract
     ** @notice emits an OptionRegistered event only if sucesful.
     ** @dev - for concrete implementation restrict OnlyWhenNotPaused
     ** @dev - only allow option seller to add their own contracts
     ** @dev - owner can add any contract
     ** @dev - raise an error if the contract does not implement the OptionContract interface
     ** @dev - raise error to stop any contract being added if it is expired
     ** @dev - raise error if option contract address is bad or if not registered
     ** @param optionContractAddressToAdd - the address of the contract to be add
     */
    function registerContract(
        address optionContractAddressToRegister
    ) public virtual;

    /**
     ** @notice Get the list of option contract addresses for the given seller
     ** @dev - for concrete implementation restrict to OnlyWhenNotPaused
     ** @param seller the address of the option seller
     ** @return List of option contract addresses
     */
    function getOptionsForSeller(
        address seller
    ) public view virtual returns (address[] memory);

    /**
     ** @notice Get the list of option contract addresses for the given buyer
     ** @dev - for concrete implementation restrict to OnlyWhenNotPaused
     ** @param seller the address of the option buyer
     ** @return List of option contract addresses
     */
    function getOptionsForBuyer(
        address seller
    ) public view virtual returns (address[] memory);

    /**
     ** @notice Get the list of all option contracts
     ** @dev - for concrete implementation restrict OnlyWhenNotPaused
     ** @return List of all option contract addresses
     */
    function getOptions() public view virtual returns (address[] memory);

    /**
     ** @notice Delete record of the given contract
     ** @notice emits an OptionPurged event only if sucesful.
     ** @dev - for concrete implementation restrict OnlyWhenNotPaused
     ** @dev - only allow option seller to purge their own contracts
     ** @dev - owner can purge any contract
     ** @dev - raise error to stop any contract being purged when it is live (not expired)
     ** @dev - raise error if option contract address is bad or if not registered
     ** @param optionContractAddressToPurge - the address of the contract to be purged
     */
    function purgeContract(
        address optionContractAddressToPurge
    ) public view virtual;
}
