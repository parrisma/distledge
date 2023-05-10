const { ethers } = require("hardhat");

/*  Accounts from Test network
*/
let owner = null;
let traderOne = null;
let traderTwo = null;

async function getAccounts() {
    [owner, traderOne, traderTwo] = await ethers.getSigners();
}

async function getOwnerAccount() {
    if (null == owner) {
        await getAccounts();
    }
    return owner;
}

module.exports = {
    getOwnerAccount
}
