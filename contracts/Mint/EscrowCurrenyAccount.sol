// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "../stable-coins/ERC20StableCoin.sol";

/*
 ** @author Mark Parris
 ** @title Simulate an Escrow Curreny Account that can verify deposits and withdrawals that back a stable coin token
 */
contract EscrowCurrenyAccount is Ownable, Pausable {
    event Deposit(
        address _from,
        uint256 _quantity,
        string transactionId,
        uint256 _balance
    );
    event Withdrawal(
        address _to,
        uint256 _quantity,
        string transactionId,
        uint256 _balance
    );

    ERC20StableCoin private _erc20StableCoin;
    uint256 _physicalBalance;
    uint256 _reserverPercent;
    uint256 _unitsPerToken;

    constructor(address erc20StableCoinAddr_, uint8 reserverPercent_)
        Ownable()
        Pausable()
    {
        super._pause(); // Started in Paused state to allow for full validation of Token ownership.

        require(
            reserverPercent_ >= 1 && reserverPercent_ <= 100,
            "Rserver percent (%) must be > 0 and < 100"
        );
        _reserverPercent = reserverPercent_;

        _erc20StableCoin = ERC20StableCoin(erc20StableCoinAddr_);
        _unitsPerToken = _erc20StableCoin.unitsPerToken();
        _physicalBalance = 0;

        require(
            isBalanced() == true,
            "escrow balance and coin supply must be equal at inception."
        );
    }

    /*
     ** @author Mark Parris
     ** @notice Un pause the contract if all control conditions are met
     ** @return true when un paused.
     */
    function unPause() public onlyOwner whenPaused returns (bool) {
        require(
            _erc20StableCoin.owner() == address(this),
            "EscrowCurrenyAccount not owner of managed token"
        );
        require(
            isBalanced() == true,
            "escrow balance and coin supply must be equal at inception."
        );
        super._unpause();
        return true;
    }

    /*
     ** @author Mark Parris
     ** @notice regsiter a deposit transaction verified by unique transaction id
     ** @return true if registered ok
     */
    function balanceOnHand() public view whenNotPaused returns (uint256) {
        return _physicalBalance;
    }

    /*
     ** @author Mark Parris
     ** @notice return the address of the token being managed
     ** @return the address of the managed token
     */
    function managedTokenAddress() public view onlyOwner returns (address) {
        return address(_erc20StableCoin);
    }

    /*
     ** @author Mark Parris
     ** @notice return true if there is sufficent physical balance to back the toke.
     ** @return true if registered ok
     */
    function isBalanced() public view returns (bool) {
        return _physicalBalance >= _erc20StableCoin.totalSupply();
    }

    /*
     ** @author Mark Parris
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

    /*
     ** @author Mark Parris
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

    /*
     ** @author Mark Parris
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

        uint256 tokenQty = quantity_ * _unitsPerToken;
        if (deposit) {
            _erc20StableCoin.mint(quantity_);
            _erc20StableCoin.approve(owner(), tokenQty);
            _erc20StableCoin.transfer(transactingAddress_, tokenQty);
            _physicalBalance = _physicalBalance + tokenQty;
            emit Deposit(
                transactingAddress_,
                quantity_,
                uniqueTransactionId_,
                _physicalBalance
            );
        } else {
            require(
                _physicalBalance >= tokenQty,
                "Insufficent escrow balance for token withdrawal"
            );
            // TODO: fix withdrawal.
            _erc20StableCoin.transferFrom(transactingAddress_, address(this), tokenQty);
            _physicalBalance = _physicalBalance - tokenQty;
            _erc20StableCoin.burn(quantity_);
            emit Withdrawal(
                transactingAddress_,
                quantity_,
                uniqueTransactionId_,
                _physicalBalance
            );
        }
        return true;
    }

    /*
     ** @author Mark Parris
     ** @notice Return the address of the contract instance.
     ** @return the contract instance address.
     */
    function contractAddress() public view onlyOwner returns (address) {
        return address(this);
    }
}
