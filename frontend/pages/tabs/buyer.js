import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import AccountDropDown from "../../components/dropdown/AccountsDropDown";
import OptionList from "../../components/OptionList";
import { useMintedOptionContext } from "../../context/mintedOption";
import { useConsoleLogContext } from "../../context/consoleLog";





const Contract = (props) => {    

    const [logs,setLogs] = useConsoleLogContext()
    function appendLogs(textLine){
        logs.push(textLine);
        setLogs(logs.slice(-10))
    }
        
    const [mintedOpt] = useMintedOptionContext();    
    const { isWeb3Enabled } = useMoralis();
    var [buyerAccount, setBuyerAccount] = useState("?");

    async function update(newAccountId) {
        if (isWeb3Enabled) {
            setBuyerAccount(newAccountId)
            appendLogs([`New Buyer Account: [${buyerAccount}]`])            
        } else {
            appendLogs([`Buyer Tab: Not Web3 Connected`])            
        }
    }

    /**
     * Exercise the option of the given Id
     * @param {*} optionId - The Option Id to Exercise
     */
    function handleExercise(optionId) {
        appendLogs(`Exercise [${optionId}]`);
    }

    /**
     * Buy the option of the given Id
     * @param {*} optionId - The Option Id to Exercise
     */
    function handleBuy(uniqueId) {        
        appendLogs(`Buy [${uniqueId}] for account [${buyerAccount}]`);
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
                                        <OptionList offered={true} offeredOptionList={mintedOpt} handleBuy={handleBuy} asSeller={false} />
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
