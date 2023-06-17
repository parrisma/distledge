/*
** Get the currently connect account/wallet or open metamask login
**
** Used window.ethereum which only exists if MetaMask or other wallet is installed in browser.
*/
export async function getConnectAccount() {
    if (window.ethereum) {
        try {
            const addressList = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            if (addressList.length == 0) {
                console.log('No accounts are connected');
                return null;
            } else {
                return addressList[0]; // Currently connected account
            }
        } catch (err) {
            console.log(`Failed to get accounts [${err.message}]`);
            return null;
        }
    } else {
        console.log(`Install MetaMask or other virtual ethereum wallet`);
        return null;
    }
};