// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "../stable-coins/ERC20StableCoin.sol";

/*
 ** @author Mark Parris
 ** @title Simulate an Escrow Curreny Account that can verify deposits and withdrawals
 */
contract EscrowCurrenyAccount is Ownable, Pausable {
    event Deposit(address _from, uint256 _quantity);
    event Withdrawal(address _to, uint256 _quantity);

    struct Transaction {
        bool active;
        bool used;
        bool deposit; // not deposit => withdrawal
        address _party;
        uint256 _quantity;
    }

    mapping(bytes32 => Transaction) transactions; // uniqueTransactionId to Transaction details.

    ERC20StableCoin private _erc20StableCoin;
    uint256 _balance;

    constructor(ERC20StableCoin erc20StableCoin_) Ownable() Pausable() {
        _erc20StableCoin = erc20StableCoin_;
        _balance = 0;
    }

    /*
     ** @author Mark Parris
     ** @notice regsiter a deposit transaction verified by unique transaction id
     ** @return true if registered ok
     */
    function balanceOnHand() public view returns (uint256) {
        return _balance;
    }

    /*
     ** @author Mark Parris
     ** @notice Make a note of a confirmed deposit from a registered source
     ** @return true if registered Ok
     */
    function registerDepositTransaction(
        address transactingAddress_,
        uint256 quantity_,
        bytes32 uniqueTransactionId
    ) public returns (bool) {
        return
            registerTransaction(
                true,
                transactingAddress_,
                quantity_,
                uniqueTransactionId
            );
    }

    /*
     ** @author Mark Parris
     ** @notice Make a note of a confirmed withdrawal from a registered source
     ** @return true if registered Ok
     */
    function registerWithdrawalTransaction(
        address transactingAddress_,
        uint256 quantity_,
        bytes32 uniqueTransactionId
    ) public returns (bool) {
        return
            registerTransaction(
                false,
                transactingAddress_,
                quantity_,
                uniqueTransactionId
            );
    }

    /*
     ** @author Mark Parris
     ** @notice Make a note of a confirmed transaction from a registered source
     ** @return true if registered Ok
     */
    function registerTransaction(
        bool deposit,
        address transactingAddress_,
        uint256 quantity_,
        bytes32 uniqueTransactionId
    ) private returns (bool) {
        require(
            transactions[uniqueTransactionId].active = false,
            "Transaction already registered and processed"
        );
        transactions[uniqueTransactionId] = Transaction(
            true, // Active
            false, // Not yes processed
            deposit, // deposit
            transactingAddress_,
            quantity_
        );
        return true;
    }
}
