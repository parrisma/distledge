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
    event LevelUpdated(int256 value_);

    using VerifySigner for *;
    address _expectedSigner;
    string _symbol;
    string _description;
    int256 _value;
    uint256 _lastUpdate;
    bool _live;
    bool _greaterThanZero = false;
    bool _greaterEqualZero = false;

    constructor(string memory symbol_, string memory description_) Ownable() {
        _expectedSigner = msg.sender;
        _symbol = symbol_;
        _description = description_;
        _live = false;
        _value = 0;
    }

    /**
     ** @notice Set the address that must sign all value updates
     */
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
     ** @notice Set modifier constrain, all updates must be greater than zero
     */
    function setGreaterThanZero() public onlyOwner {
        _greaterThanZero = true;
        _greaterEqualZero = false;
    }

    /**
     ** @notice Set modifier constrain, all updates must be greater than or equal to zero
     */
    function setGreaterEqualZero() public onlyOwner {
        _greaterThanZero = false;
        _greaterEqualZero = true;
    }

    /**
     ** @notice update modifier to ensure value constraints are honored at point of update
     */
    modifier checkConstraints(int256 value) {
        if (_greaterThanZero) {
            require(
                value > 0,
                "SecureLevel: Constraint set for value update greater than zero"
            );
        }
        if (_greaterEqualZero) {
            require(
                value >= 0,
                "SecureLevel: Constraint set for value update greater than or equal to zero"
            );
        }
        _;
    }

    /**
     ** @notice Set a new value, but update must be signed by pre-set verified address
     */
    function setVerifiedValue(
        int256 value_,
        uint256 nonce_,
        bytes memory sig
    ) public onlySigner checkConstraints(value_) {
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
     ** @notice Get the current value and the time is was updated
     ** @return The current value
     */
    function getVerifiedValue() public view returns (int256) {
        require(true == _live, "SecureLevel: No value has yet been set");
        return (_value);
    }

    /**
     ** @notice Get all of the contract details.
     ** @return The symbol
     ** @return The description
     ** @return True, if an an update been seen since construction
     ** @return The current value
     ** @return The timestamp of the update
     */
    function getDetails()
        public
        view
        returns (
            string memory,
            string memory,
            bool,
            int256,
            uint256
        )
    {
        return (_symbol, _description, _live, _value, _lastUpdate);
    }

    /**
     ** @notice Get the current ticker symbol.
     **/
    function getTicker() public view returns (string memory) {
        return (_symbol);
    }

    /**
     ** @notice modifier, throws if called by any account other than the expected signer..
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
