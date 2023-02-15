const {ethers, network} = require('hardhat');
const { verify } = require('../utils/verify');
require('dotenv').config();

//Command line => yarn hardhat run scripts/00-dataprovider-equityprice-deploy.js --network goerli

//API KEY for etherscan where an official website to explore smart contract on the blockchain
//It must be saved privately in the .env file
const ETHERSCAN_API_KEY=process.env.ETHERSCAN_API_KEY;

async function main(){
        
    //Deploy
    const name="EquityPrice";    
    const dataFeedAddress=network.config.dataFeed;
    const contract= await ethers.getContractFactory(name);
    console.log(`Deploying Contract ${name} in network ${network.name} with chainid[${network.config.chainId}]...from ${dataFeedAddress}...`);    
    const deployed=await contract.deploy(dataFeedAddress);
    console.log(`Contract deployed with address ${deployed.address}`);

    //Verify
    //Same as running in CLI => yarn hardhat verify --goerli <contract_address> <constructor_args>
    if(ETHERSCAN_API_KEY){
        await verify(deployed.address,[dataFeedAddress]);
        console.log("Verification is complete!")
    }
}

main()
    .then(()=> process.exit(0))
    .catch((err)=> {
        console.log(err);
        process.exit(-1);
    })    