import SimpleOption from "../../components/SimpleOption";
import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { addressConfig } from "../../constants";
import OptionList from "../../components/OptionList";
import { OptionTypeOneTermsAreValid } from "../../lib/ERC721Util";

import { useMintedOptionContext } from "../../context/mintedOption";
import { useConsoleLogContext } from "../../context/consoleLog";

const Contract = (props) => {

    const [logs,setLogs] = useConsoleLogContext()
    function appendLogs(textLine){
        logs.push(textLine);
        setLogs(logs.slice(-10))
    }

    const { isWeb3Enabled } = useMoralis();
    const sellerAccount = addressConfig.sellerAccount.accountAddress.toString().toUpperCase();
    const [upd, setUpd] = useState(1);
    const [mintedOpt,setMintedOpt] = useMintedOptionContext();

    function offerOption(optionTermsAsJson) {
        const [valid, msg] = OptionTypeOneTermsAreValid(optionTermsAsJson);
        if (valid) {
            appendLogs(`Terms valid [${valid}] Offering option`);
            mintedOpt.push(optionTermsAsJson);
            setMintedOpt(mintedOpt);
        } else {
            appendLogs(`Terms in-valid [${valid}] with message [${msg}]`);
        }
        setUpd(upd + 1);
    }

    /**
     * Remove the option from the list of those for sale.
     * @param {*} optionId - The Option Id to delete from sale list
     */
    function handleDel(uniqueId) {
        // TODO - Implement Delete from Offered Options List - by callback into parent where list is kept
        appendLogs(`Delete [${uniqueId}] from list`);
    }

    useEffect(() => {
        appendLogs(`Re Render [${mintedOpt.length}]`);
    }, [isWeb3Enabled, mintedOpt]);

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
                                            handleLogChange={appendLogs}/>
                                    </div>
                                </div>
                                <div className="div-table-col">
                                    <div className="pane-standard">
                                        <h2 className="header-2">Options Offered for Sale</h2>                                        
                                        <OptionList
                                            offered={true}
                                            offeredOptionList={mintedOpt}
                                            asSeller={true}
                                            handleDel={handleDel}
                                            handleLogChange={appendLogs}/>
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
