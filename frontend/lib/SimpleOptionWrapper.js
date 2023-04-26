import { HelloWorldABI, HelloWorldByteCode } from "../constants";
import { SimpleOptionABI, SimpleOptionByteCode } from "../constants";
import { ERC20USDStableCoin, ERC20USDStableByteCode } from "../constants";
import { ethers } from "ethers";

export async function deployOptionContract() {
    var Web3 = require('web3');
    var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));

    const testAccountAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // this address needs to be an account created on the test net.
    const buyerAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // 
    const premiumTokenAddress = '0x8464135c8F25Da09e49BC8782676a84730C318bC'; // USDS
    const settlementTokenAddress = '0x71C95911E9a5D330f4D621842EC243EE1343292e';
    const refPriceAddress = `0x663F3ad617193148711d28f5334eE4Ed07016602`;
    const fxRefAddress = `0x8438Ad1C834623CfF278AB6829a248E37C2D7E3f`;

    /* Create Web 3 Provider so we have connection to local test network.
    */
    var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));

    var simpleOptionContract = new web3.eth.Contract(SimpleOptionABI);
    var simpleOptionTransaction = simpleOptionContract.deploy(
        {
            data: SimpleOptionByteCode['bytecode'],
            arguments:
                ["1234", // Unique Id
                    "Test Simple Option", // Name
                    "Simple Option Description", // Description
                    buyerAddress, // buyer
                    456, // Premium
                    premiumTokenAddress, // Premium Token
                    settlementTokenAddress, // Settlement Token
                    1000, // Notional
                    100, // Strike
                    refPriceAddress, // Reference Price
                    fxRefAddress // FxRef Price
                ]
        });

    try {
        simpleOptionTransaction.send({ from: testAccountAddress, gas: 9999999 }).then((instance) => { console.log(instance) });
    } catch (err) {
        console.log(`Failed deploy contract with error [${err}]`);
    }
};

