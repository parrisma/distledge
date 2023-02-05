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
        require(
            reserverPercent_ >= 1 && reserverPercent_ <= 100,
            "Rserver percent (%) must be > 0 and < 100"
        );
        _reserverPercent = reserverPercent_;

        _erc20StableCoin = ERC20StableCoin(erc20StableCoinAddr_);
        _unitsPerToken = _erc20StableCoin.unitsPerToken();
        _physicalBalance = 0;

        require(
            _erc20StableCoin.owner() == owner(),
            "Escrow Account must be the owner of the given token"
        );

        require(
            _physicalBalance == _erc20StableCoin.totalSupply(),
            "escrow balance and coin supply must be equal at inception."
        );
    }

    /*
     ** @author Mark Parris
     ** @notice Return true if account is in paused state.
     ** @return true if registered ok
     */
    function inPausedState() public view returns (bool) {
        console.log(owner());
        return super.paused();
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
     ** @notice return true if there is sufficent physical balance to back the toke.
     ** @return true if registered ok
     */
    function isBalanced() public view whenNotPaused returns (bool) {
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
        require(quantity_ > 0, "Trasaction quantity must be greater than zero");
        require(
            transactingAddress_ != address(0),
            "Transction counterparty address must be valid"
        );

        if (deposit) {
            console.log(msg.sender);
            console.log(_erc20StableCoin.owner());
            console.log(owner());
            //_erc20StableCoin.mint(quantity_);
            //_erc20StableCoin.approve(owner(), 1 * _unitsPerToken);
            //_erc20StableCoin.transferFrom(
            //    owner(),
            //    transactingAddress_,
            //    1 * _unitsPerToken
            //);
            emit Deposit(
                transactingAddress_,
                quantity_,
                uniqueTransactionId_,
                _physicalBalance
            );
        } else {
            emit Withdrawal(
                transactingAddress_,
                quantity_,
                uniqueTransactionId_,
                _physicalBalance
            );
        }
        return true;
    }
}
