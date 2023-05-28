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

    /**
     * Exercise the option of the given Id
     * @param {*} optionId - The Option Id to Exercise
     */
    function handleExercise(optionId) {
        console.log(`Exercise [${optionId}]`);
    }

    /**
     * Buy the option of the given Id
     * @param {*} optionId - The Option Id to Exercise
     */
    function handleBuy(uniqueId) {
        console.log(`Buy [${uniqueId}] for account [${buyerAccount}]`);
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
                                        <h2 className="header-2">Options Purchased</h2>
                                        <OptionList buyerAccount={buyerAccount} minted={true} handleExercise={handleExercise} />
                                    </div>
                                </div>
                                <div className="div-table-col">
                                    <div className="pane-standard">
                                        <h2 className="header-2">Options Offered for Sale</h2>
                                        <OptionList offered={true} offeredOptionList={props.optionListForOffer} handleBuy={handleBuy} asSeller={false} />
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
