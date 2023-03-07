// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../../Libs/VerifySigner.sol";

contract mockVerifiedSigner is Ownable {
    using VerifySigner for *;
    address _expectedSigner;

    constructor() Ownable() {
        _expectedSigner = msg.sender;
    }

    /**
     ** @dev Set a new expected signer
     **/
    function setExpectedSigner(address expectedSigner_) public onlyOwner {
        require(
            expectedSigner_ != address(0),
            "mockVerifiedSigner: Bad expected signer address"
        );
        _expectedSigner = expectedSigner_;
    }

    /**
     ** @dev mock method that throws if params not signed by expected signer
     **/
    function verifiedData(
        uint256 number_,
        string memory message_,
        uint256 nonce_,
        bytes memory sig
    ) public view returns (bool) {
        /** Hash the params as would have been done by sender, this is required to
         ** verify the params as signed by the given signature.
         */
        bytes32 hashedMessage = keccak256(
            abi.encodePacked(number_, message_, nonce_)
        );
        require(
            VerifySigner.checkVerifiedSender(
                _expectedSigner,
                hashedMessage,
                sig
            ),
            "mockVerifiedSigned: Required sender did not sign data"
        );
        return (true);
    }
}
