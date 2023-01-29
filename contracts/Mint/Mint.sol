// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "../stable-coins/ERC20StableCoin.sol";

/*
 ** @author Mark Parris
 ** @title Manage a list of addresses that are able to mint (and burn) Stable Coin Tokens.
 */
contract Mint is Ownable, Pausable {
    struct MintableStableCoin {
        bool active; // neede to check if coin is already being tracked in mapping
        ERC20StableCoin erc20StableCoin;
    }

    // Collection of stable coins that can be bought/sold, indexed by token id
    mapping(string => MintableStableCoin) private mintableStableCoins;

    constructor() Ownable() Pausable() {}

    /*
     ** @author Mark Parris
     ** @title Add given stablecoin if not already registered as a mintable coin.
     */
    function addMintableCoin(ERC20StableCoin erc20StableCoin)
        public
        onlyOwner
        whenNotPaused
        returns (bool)
    {
        require(
            mintableStableCoins[erc20StableCoin.symbol()].active = false,
            "Coin cannot be added, already registered as mintable coin"
        );
        mintableStableCoins[erc20StableCoin.symbol()] = MintableStableCoin(
            true,
            erc20StableCoin
        );
        return true;
    }
}
