const { run } = require('hardhat')

//Common utility function to veify deployed contract by submiting the contract bytecode to etherscans.
//The structure of smart contract is visible after verification is complete.
const verify = async (contractAddress, args) => {
    try{
        await run("verify:verify",{
            address:contractAddress,
            constructorArguments: args
        })
    }catch(ex){
        if(ex.name !== "NomicLabsHardhatPluginError")            
            console.error(ex);        
    }
}

module.exports={ verify }

