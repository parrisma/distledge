const { ethers } = require("hardhat");
const fs = require("fs");
const { frontEndAbiLocation } = require("../../helper-hardhat-config");

/**
 * Export ABI to front end where from given address of a deployed contract
 * @param {*} contractName 
 * @param {*} contractAddress 
 */
async function updateAbiFromDeployedContractAddress(
    contractName,
    contractAddress) {
    try {
        const deployedContract = await ethers.getContractAt(
            contractName,
            contractAddress
        );
        fs.writeFileSync(
            `${frontEndAbiLocation}${contractName}.json`,
            deployedContract.interface.format(ethers.utils.FormatTypes.json)
        );
        console.log(`Exported ABI for [${contractName}] at deployed address [${contractAddress}]`)
    } catch (err) {
        console.log(`Failed to export ABI for ${contractName} with error [${err}]`);
    }
}

/**
 * Export ABI & Bytecode file to front end, by taking latest builds from project artifacts
 * 
 * @param {*} contractGroup - The folder in which the contract lives as part of the solidity source on contracts folder.
 * @param {*} contractName - The solidity contract name
 * @param {*} abiLocation - The path to where Abi & Bytecode are to be exported
 */
async function exportAbiAndBytecodeFromBuildArtifacts(
    contractGroup,
    contractName,
    abiLocation) {
    try {
        const interfaceFilename = `${abiLocation}${contractName}.json`;
        const bytecodeFilename = `${abiLocation}${contractName}-bytecode.json`;

        if (fs.existsSync(interfaceFilename)) {
            console.log(`Cleaning up old interface export [${interfaceFilename}]`);
            fs.unlinkSync(interfaceFilename);
        }
        if (fs.existsSync(bytecodeFilename)) {
            console.log(`Cleaning up old bytecode export [${bytecodeFilename}]`);
            fs.unlinkSync(bytecodeFilename);
        }

        const contractFile = `./artifacts/contracts/${contractGroup}/${contractName}.sol/${contractName}.json`;
        let jsonData = JSON.parse(fs.readFileSync(contractFile, 'utf-8'));
        const iface = new ethers.utils.Interface(jsonData.abi);
        fs.writeFileSync(
            interfaceFilename,
            iface.format(ethers.utils.FormatTypes.json));
        console.log(`Exported Interface (ABI) for [${contractFile}]`);
        fs.writeFileSync(
            bytecodeFilename,
            `{"bytecode":"${jsonData.bytecode}"}`);
        console.log(`Exported Bytecode for [${contractFile}]`);
    } catch (err) {
        console.log(`Failed to export for ${contractName} with error [${err}]`);
    }
}

module.exports = {
    updateAbiFromDeployedContractAddress,
    exportAbiAndBytecodeFromBuildArtifacts
}

