import { SimpleOptionABI, SimpleOptionByteCode } from "../constants";

/*
** Use WEB-3 to deploy and register a new SimpleOption Contract
*/
export async function deployOptionContract(
    optionIssuerAddress,
    uniqueId,
    optionName,
    optionDescription,
    buyerAddress,
    premium,
    premiumTokenAddress,
    settlementTokenAddress,
    notional,
    strike,
    referencePriceAddress,
    referenceFxAddress
) {

    /* Create Web 3 Provider so we have connection to local test network.
    */
    var Web3 = require('web3');
    var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/')); // Replace at some point with MetaMask provider.

    console.log(`uniqueId: [${uniqueId}]`);
    console.log(optionName);
    console.log(optionDescription);
    console.log(buyerAddress);
    console.log(premium);
    console.log(premiumTokenAddress);
    console.log(settlementTokenAddress);
    console.log(notional);
    console.log(strike);
    console.log(referencePriceAddress);
    console.log(referenceFxAddress);

    var simpleOptionContract = new web3.eth.Contract(SimpleOptionABI);
    var simpleOptionTransaction = simpleOptionContract.deploy(
        {
            data: SimpleOptionByteCode['bytecode'],
            arguments:
                [
                    uniqueId,
                    optionName,
                    optionDescription,
                    buyerAddress,
                    premium,
                    premiumTokenAddress,
                    settlementTokenAddress,
                    notional,
                    strike,
                    referencePriceAddress,
                    referenceFxAddress
                ]
        });

    try {
        simpleOptionTransaction.send({
            from: optionIssuerAddress,
            gas: 60000000
        }).then((instance) => { console.log(instance) });
    } catch (err) {
        console.log(`Failed deploy contract with error [${err}]`);
    }
};

