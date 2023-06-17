// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "../StableAsset/ERC20StableAsset.sol";

/**
 ** @author Mark Parris
 ** @title Simulate an Escrow Account that can verify deposits and withdrawals that back a stable coin token
 */
contract EscrowAccount is Ownable, Pausable {
    event Deposit(
        string _assetCode,
        address _from,
        uint256 _quantity,
        string transactionId,
        uint256 _balance
    );
    event Withdrawal(
        string _assetCode,
        address _to,
        uint256 _quantity,
        string transactionId,
        uint256 _balance
    );

    ERC20StableAsset private _erc20StableAsset;
    uint256 _physicalBalance;
    uint256 _reserverPercent;
    uint256 _unitsPerToken;
    uint256 _tokenDecimals;

    /**
     ** Construct an stable asset escrow account.
     ** @param erc20StableCoinAddr_ the address of the already deployed token that the Escrow account will take ownership of.
     ** @param reservePercent_ the minimum balance on hand that cannot be burned when tokens are sold back to their master asset
     */
    constructor(
        address erc20StableCoinAddr_,
        uint8 reserverPercent_
    ) Ownable() Pausable() {
        super._pause(); // Started in Paused state to allow for full validation of Token ownership.

        require(
            reserverPercent_ >= 1 && reserverPercent_ <= 100,
            "Reserve percent (%) must be > 0 and < 100"
        );
        _reserverPercent = reserverPercent_;

        _erc20StableAsset = ERC20StableAsset(erc20StableCoinAddr_);
        _unitsPerToken = _erc20StableAsset.unitsPerToken();
        _tokenDecimals = _erc20StableAsset.decimals();
        _physicalBalance = 0;

        require(
            isBalanced() == true,
            "Escrow balance and coin supply must be equal at inception."
        );
    }

    /**
     ** @notice Un pause the contract if all control conditions are met
     ** @return true when un paused.
     */
    function unPause() public onlyOwner whenPaused returns (bool) {
        require(
            _erc20StableAsset.owner() == address(this),
            "EscrowAccount not owner of managed token"
        );
        require(
            isBalanced() == true,
            "Escrow balance and coin supply must be equal at inception."
        );
        super._unpause();
        return true;
    }

    /**
     ** @notice Return the number of decimal adjusted tokens on hand.
     ** @return true if registered ok
     */
    function balanceOnHand() public view whenNotPaused returns (uint256) {
        return _physicalBalance;
    }

    /**
     ** @notice return the address of the token being managed
     ** @return the address of the managed token
     */
    function managedTokenAddress() public view onlyOwner returns (address) {
        return address(_erc20StableAsset);
    }

    /**
     ** @notice return the name of the token being managed
     ** @return the name of the managed token
     */
    function managedTokenName() public view returns (string memory) {
        return _erc20StableAsset.name();
    }

    /**
     ** @notice return true if there is sufficent physical balance to back the toke.
     ** @return true if registered ok
     */
    function isBalanced() public view returns (bool) {
        return _physicalBalance >= _erc20StableAsset.totalSupply();
    }

    /**
     * @notice return the number of decimal places underlying token uses.
     */
    function decimals() public view returns (uint8) {
        return _erc20StableAsset.decimals();
    }

    /**
     ** @notice Process a deposit transaction & mint tokens as needed
     ** @return true if processed Ok
     */
    function processDepositTransaction(
        address transactingAddress_,
        uint256 quantity_,
        string memory uniqueTransactionId_
    ) public whenNotPaused onlyOwner returns (bool) {
        return
            processTransaction(
                true,
                transactingAddress_,
                quantity_,
                uniqueTransactionId_
            );
    }

    /**
     ** @notice Process a withdrawal & burn tokens as needed
     ** @return true if processed Ok
     */
    function processWithdrawalTransaction(
        address transactingAddress_,
        uint256 quantity_,
        string memory uniqueTransactionId_
    ) public whenNotPaused onlyOwner returns (bool) {
        return
            processTransaction(
                false,
                transactingAddress_,
                quantity_,
                uniqueTransactionId_
            );
    }

    /**
     ** @notice Process the given transaction
     ** @return true if registered Ok
     */
    function processTransaction(
        bool deposit,
        address transactingAddress_,
        uint256 quantity_,
        string memory uniqueTransactionId_
    ) private whenNotPaused onlyOwner returns (bool) {
        require(
            quantity_ > 0,
            "Transaction quantity must be greater than zero"
        );
        require(
            transactingAddress_ != address(0),
            "Transaction counter-party address must be valid"
        );

        if (deposit) {
            _erc20StableAsset.mint(quantity_);
            _erc20StableAsset.approve(owner(), quantity_);
            _erc20StableAsset.transfer(transactingAddress_, quantity_);
            _physicalBalance = _physicalBalance + quantity_;
            emit Deposit(
                _erc20StableAsset.assetCode(),
                transactingAddress_,
                quantity_,
                uniqueTransactionId_,
                _physicalBalance
            );
        } else {
            require(
                _physicalBalance >= quantity_,
                "Insufficent escrow balance for token withdrawal"
            );
            _erc20StableAsset.transferFrom(
                transactingAddress_,
                address(this),
                quantity_
            );
            _physicalBalance = _physicalBalance - quantity_;
            _erc20StableAsset.burn(quantity_);
            emit Withdrawal(
                _erc20StableAsset.assetCode(),
                transactingAddress_,
                quantity_,
                uniqueTransactionId_,
                _physicalBalance
            );
        }
        return true;
    }

    /**
     ** @notice Return the address of the contract instance.
     ** @return the contract instance address.
     */
    function txfr(address from, address to, uint256 qty) public returns (bool) {
        _erc20StableAsset.transferFrom(from, to, qty);
        return true;
    }

    /**
     ** @notice Return the address of the contract instance.
     ** @return the contract instance address.
     */
    function contractAddress() public view onlyOwner returns (address) {
        return address(this);
    }
}
