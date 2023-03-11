// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../Libs/VerifySigner.sol";

/**
 ** Acts as bridge with off-chain source.
 **
 ** Allows a valid sender to be set and then verifies that all updates are from the
 ** defined valid source.
 */
contract SecureLevel is Ownable {
    event ChangeOfSource(address current_, address new_);
    event LevelUpdated(uint256 value_);

    using VerifySigner for *;
    address _expectedSigner;
    string _symbol;
    string _description;
    uint256 _value;
    uint256 _lastUpdate;
    bool _live;

    constructor(string memory symbol_, string memory description_) Ownable() {
        _expectedSigner = msg.sender;
        _symbol = symbol_;
        _description = description_;
        _live = false;
        _value = 0;
    }

    /**
     ** @dev Set a new expected signer
     **/
    function setExpectedSigner(address expectedSigner_) public onlyOwner {
        require(
            expectedSigner_ != address(0),
            "SecureLevel: Bad expected signer address"
        );
        address _prev = _expectedSigner;
        _expectedSigner = expectedSigner_;
        emit ChangeOfSource(_prev, _expectedSigner);
    }

    /**
     ** @dev mock method that throws if params not signed by expected signer
     **/
    function setVerifiedValue(
        uint256 value_,
        uint256 nonce_,
        bytes memory sig
    ) public onlySigner {
        /** Hash the params as would have been done by sender, this is required to
         ** verify the params as signed by the given signature.
         */
        bytes32 hashedMessage = keccak256(abi.encodePacked(value_, nonce_));
        require(
            VerifySigner.checkVerifiedSender(
                _expectedSigner,
                hashedMessage,
                sig
            ),
            "SecureLevel: Required sender did not sign data"
        );
        _value = value_;
        _live = true;
        _lastUpdate = block.timestamp;
        emit LevelUpdated(_value);
    }

    /**
     ** @dev mock method that throws if params not signed by expected signer
     **/
    function getVerifiedValue() public view returns (uint256, uint256) {
        require(true == _live, "SecureLevel: No value has yet been set");
        return (_value, _lastUpdate);
    }

    /**
     ** @dev mock method that throws if params not signed by expected signer
     **/
    function getDetails()
        public
        view
        returns (
            string memory,
            string memory,
            bool,
            uint256,
            uint256
        )
    {
        return (_symbol, _description, _live, _value, _lastUpdate);
    }

    /**
     * @dev Throws if called by any account other than the expected signer..
     */
    modifier onlySigner() {
        _checkSigner();
        _;
    }

    /**
     * @dev Throws if the sender is not the expected signer.
     */
    function _checkSigner() internal view virtual {
        require(
            _expectedSigner == _msgSender(),
            "SecureLevel: caller is not the verified signer"
        );
    }
}
