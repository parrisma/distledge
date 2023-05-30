import SimpleOption from "../components/SimpleOption";
import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { addressConfig } from "../constants";
import { OptionTypeOneTermsAreValid } from "../lib/ERC721Util";
import OptionList from "../components/OptionList";

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    const sellerAccount = addressConfig.sellerAccount.accountAddress.toString().toUpperCase();
    const [upd, setUpd] = useState(1);// Trigger re-render



    function offerOption(optionTermsAsJson) {
        const [valid, msg] = OptionTypeOneTermsAreValid(optionTermsAsJson);
        if (valid) {
            props.handleLogChange(`Terms valid [${valid}] Offering option`);
            props.optionListForOffer.push(optionTermsAsJson);
            props.setOptionListForOffer(props.optionListForOffer);
        } else {
            props.handleLogChange(`Terms in-valid [${valid}] with message [${msg}]`);
        }
        setUpd(upd + 1);
    }

    /**
     * Remove the option from the list of those for sale.
     * @param {*} optionId - The Option Id to delete from sale list
     */
    function handleDel(uniqueId) {
        // TODO - Implement Delete from Offered Options List - by callback into parent where list is kept
        props.handleLogChange(`Delete [${uniqueId}] from list`);
    }

    useEffect(() => {
        console.log(`Re Render [${props.optionListForOffer.length}]`);
    }, [isWeb3Enabled, props.optionListForOffer]);

    return (
        <div className="resizable">
            <div className="div-table">
                <div className="div-table-row">
                    <div className="div-table-col">
                        <p>Seller Account: [{sellerAccount}]</p>
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col">
                        <div className="div-table">
                            <div className="div-table-row">
                                <div className="div-table-col">
                                    <div className="pane-narrow">
                                        <h2 className="header-2">Print Option for Sale</h2>
                                        <SimpleOption
                                            handleOfferOption={offerOption}
                                            handleLogChange={props.handleLogChange} />
                                    </div>
                                </div>
                                <div className="div-table-col">
                                    <div className="pane-standard">
                                        <h2 className="header-2">Options Offered for Sale</h2>
                                        <OptionList
                                            offered={true}
                                            offeredOptionList={props.optionListForOffer}
                                            asSeller={true}
                                            handleDel={handleDel}
                                            handleLogChange={props.handleLogChange} />
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
