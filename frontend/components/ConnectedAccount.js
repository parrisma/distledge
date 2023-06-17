import { addressConfig } from "@/constants";
import { getDisplayName } from "@/lib/DisplayName";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

/* Show the name of the given connected account
*/
const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    const { account } = useMoralis();
    const [acct, setAccount] = useState(`?`);
    const [acctName, setAccountName] = useState(`?`);

    /* Extract all Accounts from address config by matching names.
    */
    var accountDict = {};
    for (const key in addressConfig) {
        if (key.match(/.*Account.*/)) {
            if (addressConfig[key].accountName) {
                const optionName = getDisplayName(addressConfig[key].accountName);
                accountDict[`${addressConfig[key].accountAddress}`.toUpperCase()] = `${optionName}`;
            }
        }
    }

    function accountDisplayName(account) {
        const accToFind = account.toUpperCase();
        if (`${accToFind}` in accountDict) {
            return accountDict[accToFind];
        }
        return `Unknown`;
    }

    useEffect(() => {
        console.log("Connected account changed to:", account);
        setAccount(account);
        setAccountName(accountDisplayName(`${account}`.toString()));
        if (typeof props.handleChange === 'function') {
            props.handleChange(account);
        }
    }, [isWeb3Enabled, account])

    return (
        <div>
            {isWeb3Enabled ?
                (
                    <div className="header-3">
                        Connected as {acctName} @ {acct}
                    </div>) :
                (
                    <div className="header-3-red">
                        Not connected, Press Connect
                    </div>
                )
            }
        </div>
    );
};

export default Contract;