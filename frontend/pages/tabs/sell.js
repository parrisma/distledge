import SimpleOption from "../../components/SimpleOption";
import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { addressConfig } from "../../constants";
import OptionList from "../../components/OptionList";
import ConnectedAccount from "../../components/ConnectedAccount";
import { OptionTypeOneTermsAreValid } from "../../lib/ERC721Util";
import { useOfferedOptionContext } from "../../context/offeredOption";
import { useConsoleLogContext } from "../../context/consoleLog";

const Contract = (props) => {

    const [logs, setLogs] = useConsoleLogContext()
    function appendLogs(textLine) {
        logs.push(textLine);
        setLogs(logs.slice(-10))
    }

    const { isWeb3Enabled } = useMoralis();
    const { account } = useMoralis();
    const NOT_SELECTED = "?";
    var [connectedAccount, setConnectedAccount] = useState(NOT_SELECTED);
    var [connectedAccountIsSeller, setConnectedAccountIsSeller] = useState(false);
    const [upd, setUpd] = useState(1);
    const [offeredOptDict, setOfferedOptDict] = useOfferedOptionContext();

    function offerOption(optionTermsAsJson) {
        optionTermsAsJson.seller = connectedAccount; // Set seller to be current connected account.
        const [valid, msg] = OptionTypeOneTermsAreValid(optionTermsAsJson);
        if (valid) {
            appendLogs(`Terms valid [${valid}] Offering option`);
            if (!(optionTermsAsJson.uniqueId in offeredOptDict)) {
                offeredOptDict[optionTermsAsJson.uniqueId] = optionTermsAsJson
                setOfferedOptDict(offeredOptDict);
                appendLogs(`Add option [${optionTermsAsJson.uniqueId}]`);
                setUpd(upd + 1);
            } else
                appendLogs(`option [${optionTermsAsJson.uniqueId}] exits already.`);
        } else {
            appendLogs(`Terms in-valid [${valid}] with message [${msg}]`);
        }
    }

    /**
     * Remove the option from the list of those for sale.
     * @param {*} optionId - The Option Id to delete from sale list
     */
    function handleDel(uniqueId) {
        // TODO - Implement Delete from Offered Options List - by callback into parent where list is kept
        if ((uniqueId in offeredOptDict)) {
            delete offeredOptDict[uniqueId]
            setOfferedOptDict(offeredOptDict);
            appendLogs(`Delete [${uniqueId}] from list`);
            setUpd(upd - 1);
        }

    }

    /**
     * Return True if given account is the defined 'seller' account.
     * @param {*} account - The account verify (or not) as seller
     * @returns True if given account is the seller.
     */
    function isSellerAccount(account) {
        const acctUpper = `${account}`.toUpperCase();
        return `${account}`.toUpperCase() == addressConfig.sellerAccount.accountAddress.toString().toUpperCase();
    }

    /**
     * Handle the event that the in-browser wallet switches (connects) as a different account.
     * @param {*} acct - The account that is now active
     */
    function handleAccountChange(acct) {
        setConnectedAccount(acct);
        setConnectedAccountIsSeller(isSellerAccount(acct));
        appendLogs(`Connected account :[${acct}] and is seller account [${connectedAccountIsSeller}]`);
    }

    /**
     * Update given change to variables depended on by active UI components.
     */
    useEffect(() => {
    }, [isWeb3Enabled, offeredOptDict, account, connectedAccount]);

    return (
        <div className="resizable">
            <div className="div-table">
                <div className="div-table-row">
                    <div className="div-table-col">
                        <ConnectedAccount
                            handleChange={handleAccountChange}
                        />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col">
                        <div className="div-table">
                            <div className="div-table-row">
                                <div className="div-table-col">
                                    <div className="pane-narrow">
                                        <h2 className="header-2">Print Option for Sale</h2>
                                        <div>
                                            {connectedAccountIsSeller ? (
                                                <SimpleOption
                                                    handleOfferOption={offerOption}
                                                    handleLogChange={appendLogs} />
                                            ) :
                                                (<div className="header-3-red">
                                                    Connect as a Seller account to print options
                                                </div>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="div-table-col">
                                    <div className="pane-standard">
                                        <h2 className="header-2">Options Offered for Sale</h2>
                                        <OptionList
                                            offered={true}
                                            offeredOptionList={Object.values(offeredOptDict)}
                                            asSeller={true}
                                            handleDel={handleDel}
                                            handleLogChange={appendLogs} />
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
