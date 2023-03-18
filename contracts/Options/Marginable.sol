// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "../StableCoins/ERC20StableCoin.sol";
import "../DataFeeder/ReferenceLevel.sol";

abstract contract Marginable {
    address internal _broker;
    uint256 internal _marginAmount;
    uint16 internal _initialMargin; // Initial margin in percentage
    uint16 internal _maintenanceMargin; // Maintenance margin in percentage
    ERC20StableCoin internal _marginToken;
    ERC20StableCoin internal _contractToken;
    RefernceLevel internal _fxRate;

    constructor(
        address broker,
        ERC20StableCoin marginToken,
        ERC20StableCoin contractToken,
        RefernceLevel fxRate,
        uint16 initialMargin,
        uint16 maintenanceMargin
    ) {
        _broker = broker;
        _initialMargin = initialMargin;
        _maintenanceMargin = maintenanceMargin;
        _marginToken = marginToken;
        _contractToken = contractToken;
        _fxRate = fxRate;
        _marginAmount = 0; // Initialize margin as 0 before actual margin calls
    }

    /**
     * @dev Throws if called by any account other than the broker.
     */
    modifier onlyBroker() {
        require(_broker == msg.sender, "Marginable: caller is not the broker");
        _;
    }

    event MarginAdjusted(uint256 amount, uint256 currentAmount);

    function calInitialMargin(
        uint256 contractValue
    ) public virtual returns (uint256) {
        return margin(contractValue, _initialMargin);
    }

    function calMaintenanceMargin(
        uint256 contractValue
    ) public virtual returns (uint256) {
        return margin(contractValue, _maintenanceMargin);
    }

    function margin(
        uint256 contractValue,
        uint marginRate
    ) internal view returns (uint256) {
        uint256 currentMargin = (contractValue *
            marginRate *
            _contractToken.unitsPerToken() *
            uint256(_fxRate.getVerifiedValue())) /
            (_marginToken.unitsPerToken() * 10 ** _fxRate.getDecimals()); // Calculation with decimals
        return currentMargin;
    }

    function adjustMargin(
        address client,
        uint256 amount
    ) public virtual onlyBroker returns (bool) {
        require(
            _marginToken.allowance(client, _broker) >= amount,
            "Marginable: Client must pre-authorise transfer of margin call"
        );
        _marginToken.transferFrom(client, _broker, amount);
        _marginAmount = _marginAmount + amount;
        emit MarginAdjusted(amount, _marginAmount);
        return (true);
    }

    /**
     ** @notice Get the written terms of the margin specification
     ** @return The written terms of the margin specification
     */
    function marginTerms() public view virtual returns (string memory) {
        return
            string.concat(
                "Initial margin as ",
                Strings.toString(_initialMargin),
                "% of the contract value, maintenance margin as ",
                Strings.toString(_maintenanceMargin),
                "% of the value"
            );
    }
}
