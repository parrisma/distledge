import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import AccountDropDown from "../components/dropdown/AccountsDropDown";
import OptionList from "../components/OptionList";

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    var [buyerAccount, setBuyerAccount] = useState("?");

    async function update(newAccountId) {
        if (isWeb3Enabled) {
            setBuyerAccount(newAccountId)
            console.log(`New Buyer Account: [${buyerAccount}]`);
        } else {
            console.log(`Buyer Tab: Not Web3 Connected`);
        }
    }

    useEffect(() => {
    }, [isWeb3Enabled, buyerAccount]);

    return (
        <div>
            <div>
                <AccountDropDown
                    handleChange={(value) => { update(value) }}
                    placeholder={`Buyer Account`} />
            </div>
            <div>
                <OptionList buyerAccount={buyerAccount} />
            </div>
        </div>
    );
};

export default Contract;
