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
        <div className="resizable">
            <div className="div-table">
                <div className="div-table-row">
                    <div className="div-table-col">
                        <AccountDropDown
                            handleChange={(value) => { update(value) }}
                            placeholder={`Buyer Account`} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col">
                        <div className="div-table">
                            <div className="div-table-row">
                                <div className="div-table-col">
                                    <div className="pane-standard">
                                        <OptionList buyerAccount={buyerAccount} minted={true} />
                                    </div>
                                </div>
                                <div className="div-table-col">
                                    <div className="pane-standard">
                                        <OptionList offered={true} offeredOptionList={props.optionListForOffer} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contract;
