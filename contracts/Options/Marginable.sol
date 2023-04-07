// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "../StableAsset/ERC20StableAsset.sol";
import "../DataFeeder/ReferenceLevel.sol";

/**
 ** A contract that requires a margin against loss to be maintained.
 **
 ** TODO : I think this should work more like escrow, where the margin is held by an independent party
 **      : and paid out to the losing party in the case of default.
 **      : This could be done as part of this contract with a method only callable by the independent
 **      : margin holder party. This method would do a token transfer to the party who suffered the loss
 **      : or would be returned to the margin depositor on exercise if no default.
 **      : We also need methods to allow only broker and only buyer to transfer in margin.
 **
 **      : All in all nice idea and great start, just needs a bit of a re-think.
 */
abstract contract Marginable {
    address internal _broker;
    uint256 internal _marginAmount;
    uint16 internal _initialMargin; // Initial margin in percentage
    uint16 internal _maintenanceMargin; // Maintenance margin in percentage
    ERC20StableAsset internal _marginToken;
    ERC20StableAsset internal _contractToken;
    RefernceLevel internal _fxRate;

    uint internal _decimal = 4; // Decimal places of the initial margin and maintenance margin. Default to 4.

    constructor(
        address broker,
        ERC20StableAsset marginToken,
        ERC20StableAsset contractToken,
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

    /**
     ** @notice Calculate te initial mergin to be deposited.
     */
    function calculateInitialMargin(
        uint256 contractValue
    ) public virtual returns (uint256) {
        return margin(contractValue, _initialMargin);
    }

    /**
     ** @notice calculate the margin adjustment.
     **
     ** TODO : this could be combined with calculateInitialMargin() and just have a single method
     **      : that returned the current margin at the time of call. This is more how such contracts
     **      : work where margin is calculated peridoically (e.g. daily) or as a result of a given
     **      : % market move.
     */
    function calculateMaintenanceMargin(
        uint256 contractValue
    ) public virtual returns (uint256) {
        return margin(contractValue, _maintenanceMargin);
    }

    /**
     ** @dev Calculate the current margin.
     **
     ** TODO: Would ideally declare explicity as private to underpin that this is a utility method.
     **     : could make this a single current margin function. Instead of initial margin you could
     **     : just have minium-margin and margin . This woule give same effect and remove two methods
     **     : from the contract.
     */
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

    /**
     * TODO Rename and refine the method.
     * Should not be marked only broker, as
     * Buyer and Seller may need to make margin payments depending on the contract value. If the contract goes against buyer they may need to place more margin - if it goes in their favour the broker may need to return some margin - otherwise buyer is over exposed to credit risk of seller
     */
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
