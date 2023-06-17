// SPDX-License-Identifier: MIT

// ERC721 For Type 1 Option Contracts.

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract ERC721OptionContractTypeOne is ERC721URIStorage, Pausable, Ownable {
    /**
     * @notice When the base URI of the NFT set is modified.
     * @param oldURI - The previous base URI
     * @param oldURI - The new (replacment) base URI
     */
    event ChangeOfBaseURI(string oldURI, string newURI);

    /**
     * @notice When an new NFT is minted
     * @param optionURI - The URI of the newly minted option
     */
    event OptionMinted(string optionURI);

    /**
     * @notice When an NFT is burned
     * @param optionURI - The URI of tyeh burnt option
     */
    event OptionBurned(string optionURI);

    /**
     * @notice When an NFT ownership is transfered
     * @param optionURI - The URI of the transfered option
     * @param from - The previous option owner
     * @param to - The new option owner
     */
    event OptionTransfer(string optionURI, address from, address to);

    using Address for address;

    using Counters for Counters.Counter;
    Counters.Counter private _OptionIds;

    string internal baseURI;

    /**
     ** @notice Construct ERC721 Master Contract for Type 1 Options.
     */
    constructor() ERC721("Option Contract Type 1", "OptT1") {
        setBaseURI("http://localhost:8191");
    }

    /**
     * @notice Base URI for computing {tokenURI}.
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /**
     * @notice Get the Base URI.
     * @return string - the current base URI
     */
    function getBaseURI() public view returns (string memory) {
        return baseURI;
    }

    /**
     * @notice Set the Base URI.
     * @notice emits ChangeOfBaseURI event on success
     * @return  string - the previous base URI
     */
    function setBaseURI(
        string memory newBaseURI
    ) public onlyOwner whenNotPaused returns (string memory) {
        string memory oldBaseURI = baseURI;
        baseURI = newBaseURI;
        emit ChangeOfBaseURI(oldBaseURI, baseURI);
        return oldBaseURI;
    }

    /**
     * @notice mint a new Option contract.
     * @notice emits OptionMinted event on success
     * @param signedOptionHash - The hash of the option terms signed by the current owner.
     * @return unit - The id of the newly minted option.
     */
    function mintOption(
        string memory signedOptionHash
    ) public onlyOwner whenNotPaused returns (uint256) {
        _OptionIds.increment();

        uint256 newOptionId = _OptionIds.current();
        _mint(owner(), newOptionId);
        _setTokenURI(
            newOptionId,
            string(
                abi.encodePacked(
                    "/",
                    Strings.toString(newOptionId),
                    "/",
                    signedOptionHash
                )
            )
        );

        emit OptionMinted(tokenURI(newOptionId));

        return newOptionId;
    }

    /**
     * @notice burn an existing Option contract.
     * @notice emits OptionBurned event on success
     * @param optionId - the ID of the option to burn
     */
    function burnOption(uint256 optionId) public onlyOwner whenNotPaused {
        string memory tokenURIBeforeBurn = tokenURI(optionId);
        _burn(optionId);
        emit OptionBurned(tokenURIBeforeBurn);
    }

    /**
     * @notice Has the given option id already been minted
     * @param optionId - the ID of the option to check
     */
    function exists(
        uint256 optionId
    ) public view onlyOwner whenNotPaused returns (bool) {
        return _exists(optionId);
    }

    /**
     * @notice Transfer NFT ownership, and transfer payment amount from buyer (to) seller (from)
     * @notice emits OptionTransfer event on success
     *
     * @dev Athorisations for NFT & Payement transfer must be done before calling.
     *
     * @param from - the current owner of the NFT and reciever of payment
     * @param to - the target owner of NFT and payer of payment
     * @param optionId - the ID of the option to transfer
     * @param paymentToken - the ERC20 token that payment is to be made in
     * @param paymentAmount - the amount of the payment in the defined token
     */
    function safeTransferOptionFrom(
        address from,
        address to,
        uint256 optionId,
        address paymentToken,
        uint256 paymentAmount
    ) public virtual whenNotPaused {
        require(
            paymentToken.isContract(),
            "paymentToken not an ERC20 Contract"
        );
        ERC20(paymentToken).transferFrom(to, from, paymentAmount); // Buyer (to) pays premium to seller (from)
        safeTransferFrom(from, to, optionId, "");
        emit OptionTransfer(tokenURI(optionId), from, to);
    }
}
