import SimpleOption from "../components/SimpleOption";
import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { addressConfig } from "../constants";
import OptionList from "../components/OptionList";

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    const sellerAccount = addressConfig.sellerAccount.accountAddress.toString().toUpperCase();
    const [upd, setUpd] = useState(1);



    function offerOption(optionTermsAsJson) {
        console.log(`Option Offered: [${optionTermsAsJson.optionName}]`);
        props.optionListForOffer.push(optionTermsAsJson);
        console.log(`Len :[${props.optionListForOffer.length}]`);
        props.setOptionListForOffer(props.optionListForOffer);
        setUpd(upd + 1);
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
                                    <div className="pane-standard">
                                        <SimpleOption handleOfferOption={offerOption} />
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
