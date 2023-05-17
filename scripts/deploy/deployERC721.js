require('module-alias/register'); // npm i --save module-alias
const { serverConfig } = require("@webserver/serverConfig.js");

/**
 * Deploy the ERC721 Contracts
 * @param {json} sharedConfig JSON Object in while all shared config is held
 * @param {*} hre Hardhat runtime environment
 * @param {Address} erc721Issuer The Signer account to use to issue the ERC721's
 * @returns {Address} Of the ERC721 contracts that were deployed
 */
async function deployERC721(sharedConfig, hre, erc721Issuer) {

    console.log("\nIssue ERC721 Contracts");
    const ERC721OptionContractTypeOne = await hre.ethers.getContractFactory("ERC721OptionContractTypeOne");
    erc721OptionContractTypeOne = await ERC721OptionContractTypeOne.connect(erc721Issuer).deploy();
    console.log(`ERC721 Option NTF Contract [${await erc721OptionContractTypeOne.name()}] created at address [${erc721OptionContractTypeOne.address}]`);

    erc721BaseURI = `http://localhost:${serverConfig.port}`
    await erc721OptionContractTypeOne.connect(erc721Issuer).setBaseURI(erc721BaseURI);
    newBaseURI = await erc721OptionContractTypeOne.connect(erc721Issuer).getBaseURI();
    if (newBaseURI != erc721BaseURI) {
        throw new Error(`Failed to set ERC271 Option Type One Base URI - expected [${erc721BaseURI}] but got [${newBaseURI}]`)
    } else {
        console.log(`ERC721 NFT Option Type one Base URI set to [${newBaseURI}]`);
    }

    sharedConfig.erc721OptionContractTypeOne = erc721OptionContractTypeOne.address;

    return [erc721OptionContractTypeOne]

}

module.exports = {
    deployERC721
}