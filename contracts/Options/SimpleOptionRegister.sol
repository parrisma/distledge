// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./OptionRegister.sol";
import "./OptionContract.sol";

contract SimpleOptionRegister is OptionRegister {
    struct Trade {
        address _seller;
        address _buyer;
        address _optionAddr;
    }

    address[] registeredContracts;
    mapping(address => Trade) trades;

    function registerContract(
        address optionContractAddressToRegister
    ) public override {
        registeredContracts.push(optionContractAddressToRegister);
        OptionContract optionContract = OptionContract(
            optionContractAddressToRegister
        );
        trades[optionContractAddressToRegister] = Trade({
            _seller: optionContract.getSeller(),
            _buyer: optionContract.getBuyer(),
            _optionAddr: optionContractAddressToRegister
        });
        emit OptionRegistered(
            optionContract.getSeller(),
            optionContractAddressToRegister
        );
    }

    function getOptionsForSeller(
        address seller
    ) public view override returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < registeredContracts.length; i++) {
            if (seller == trades[registeredContracts[i]]._seller) {
                count++;
            }
        }
        address[] memory optionsForSeller = new address[](count);
        count = 0;
        for (uint256 i = 0; i < registeredContracts.length; i++) {
            if (seller == trades[registeredContracts[i]]._seller) {
                optionsForSeller[count] = registeredContracts[i];
                count++;
            }
        }
        return optionsForSeller;
    }

    function getOptionsForBuyer(
        address buyer
    ) public view override returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < registeredContracts.length; i++) {
            if (buyer == trades[registeredContracts[i]]._buyer) {
                count++;
            }
        }
        address[] memory optionsForBuyer = new address[](count);
        count = 0;
        for (uint256 i = 0; i < registeredContracts.length; i++) {
            if (buyer == trades[registeredContracts[i]]._buyer) {
                optionsForBuyer[count] = registeredContracts[i];
                count++;
            }
        }
        return optionsForBuyer;
    }

    function getOptions() public view override returns (address[] memory) {
        return registeredContracts;
    }

    function purgeContract(
        address optionContractAddressToPurge
    ) public override {
        for (uint256 i = 0; i < registeredContracts.length; i++) {
            if (registeredContracts[i] == optionContractAddressToPurge) {
                address lastKey = registeredContracts[
                    registeredContracts.length - 1
                ];
                registeredContracts[i] = lastKey;
                registeredContracts.pop();
                delete trades[optionContractAddressToPurge];
                emit OptionPurged(optionContractAddressToPurge);
            }
        }
    }
}
