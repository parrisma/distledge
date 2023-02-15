import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.17;

contract EquityPrice {
    
    //Interface to chain link off-chain data     
    AggregatorV3Interface internal priceFeed;
        
    constructor(address priceFeedAddress){
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    //Equity entity
    struct Equity{
        string name;
        uint256 price;
    }

    //Get lastest price from chainlink-data-feed which provides a secure, reliable, and decentralized source of off-chain data
    function getPrice() public view returns(int256){
        (
            /* uint80 roundID */,
            int256 price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        )= priceFeed.latestRoundData();
        return price;
    }        
}