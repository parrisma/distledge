// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

abstract contract Marginable {
    struct MarginTerms {
        uint16 _initialMargin; // Initial margin in percentage
        uint16 _maintenanceMargin; // Maintenance margin in percentage
        uint8 _decimals; // Decimal places to be evaluate in the calculation
    }

    MarginTerms internal terms;

    constructor(MarginTerms memory _terms) {
        terms = _terms;
    }

    event MarginAdjusted(uint256 amount, uint256 totalAmount);

    function adjustMargin() public virtual returns (bool);
}
