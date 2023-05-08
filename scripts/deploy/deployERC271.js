/**
 * Deploy the ERC271 Contracts
 * @param {json} sharedConfig JSON Object in while all shared config is held
 * @param {*} hre Hardhat runtime environment
 * @param {Address} erc271Issuer The Signer account to use to issue the ERC271's
 * @returns {Address} Of the ERC271 contracts that were deployed
 */
async function deployERC271(sharedConfig, hre, erc271Issuer) {

    console.log("\nIssue ERC271 Contracts");
    const ERC271OptionContractTypeOne = await hre.ethers.getContractFactory("ERC271OptionContractTypeOne");
    erc271OptionContractTypeOne = await ERC271OptionContractTypeOne.connect(erc271Issuer).deploy();
    console.log(`ERC271 Option NTF Contract [${await erc271OptionContractTypeOne.name()}] created at address [${erc271OptionContractTypeOne.address}]`);

    sharedConfig.erc271OptionContractTypeOne = erc271OptionContractTypeOne.address;

    return [erc271OptionContractTypeOne]

}

module.exports = {
    deployERC271
}