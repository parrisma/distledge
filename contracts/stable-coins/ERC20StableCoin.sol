// contracts/OceanToken.sol
// SPDX-License-Identifier: MIT

// Base contract for ERC20 Based Stable Coin

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

abstract contract ERC20StableCoin is ERC20Pausable {
    address public owner;
    uint8 private _decimals;

    constructor(address contract_owner, uint8 decimals_) {
        console.logString(Strings.toHexString(uint160(contract_owner), 20));
        owner = payable(contract_owner);
        _decimals = decimals_;
    }

    // All minting is to the owner account, the minted funds are then transfered out
    function mint(uint8 amount) public onlyOwner whenNotPaused {
        super._mint(owner, amount * unitsPerToken());
    }

    // All burning is from the owner account, based on return (transfer in) of funds
    function burn(uint256 amount) public onlyOwner whenNotPaused {
        super._burn(owner, amount * unitsPerToken());
    }

    // Pause all change activity on the contract
    function pause() public onlyOwner {
        if (!paused()) {
            super._pause();
        }
    }

    function dummy() public {
           console.logString(
            string.concat(
                "DD msg.sender: ",
                Strings.toHexString(uint160(msg.sender), 20)
            )
        );
        console.logString(
            string.concat(
                "DD owner: ",
                Strings.toHexString(uint160(this.ownerAddress()), 20)
            )
        );     
    }

    // Un pause all change activity on the contract
    function uppause() public onlyOwner {
        if (paused()) {
            super._unpause();
        }
    }

    modifier onlyOwner() {
        console.logString(
            string.concat(
                "OO msg.sender: ",
                Strings.toHexString(uint160(msg.sender), 20)
            )
        );
        console.logString(
            string.concat(
                "OO owner: ",
                Strings.toHexString(uint160(this.ownerAddress()), 20)
            )
        );
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    /**
     * Two decimal places as this is a current representation
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * The number of units per one of the Token
     */
    function unitsPerToken() public view virtual returns (uint256) {
        return 10**decimals();
    }

    function ownerAddress() public view returns (address) {
        return owner;
    }
}
