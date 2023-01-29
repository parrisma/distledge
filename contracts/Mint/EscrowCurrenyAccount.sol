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

    mapping(string => Transaction) transactions; // uniqueTransactionId to Transaction details.

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
     ** @notice return the current balance on hand of the real ccy
     ** @return true if registered Ok
     */
    function registerDepositTransaction(
        address transactingAddress_,
        uint256 quantity_,
        string memory uniqueTransactionId
    ) public returns (bool) {
        require(
            transactions[uniqueTransactionId].active = false,
            "Transaction already registered and processed"
        );
        transactions[uniqueTransactionId] = Transaction(
            true,
            false,
            true,
            transactingAddress_,
            quantity_
        );
        return true;
    }
}
