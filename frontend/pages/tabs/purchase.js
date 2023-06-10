import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import AccountDropDown from "../../components/dropdown/AccountsDropDown";
import OptionList from "../../components/OptionList";
import { useOfferedOptionContext } from "../../context/offeredOption";
import { useConsoleLogContext } from "../../context/consoleLog";
import { sendCreateOptionRequest } from "../../lib/CreateOptionConnector";
import { sendExerciseRequest } from "../../lib/ExerciseConnector";
import { getERC721MintedOptionList } from "../../lib/ERC721Util";

const Contract = (props) => {

    const [logs,setLogs] = useConsoleLogContext()
    function appendLogs(textLine){
    logs.push(textLine);
        setLogs(logs.slice(-10))
  }

  //State [Dictionary] for options offered by seller
    const [offeredOptDict,setOfferedOptDict] = useOfferedOptionContext();    
  //State [List] for minted options retrieved from block chain.
    const [mintedOptList,setMintedOptList] = useState([]);

  const { isWeb3Enabled } = useMoralis();
  const NOT_SELECTED = "?";
  var [buyerAccount, setBuyerAccount] = useState(NOT_SELECTED);

  async function getMinedOptionListAndUpt(buyerAccount) {
    if (isWeb3Enabled) {
            appendLogs(`Calling WebServer to update list of minted Options`)
        const res = JSON.parse(await getERC721MintedOptionList());
        if (res.hasOwnProperty('okCode')) {                

            //appendLogs(`res ${JSON.parse(res.message.terms)}`);
            setMintedOptList(res.message.terms.sort((a,b)=> parseInt(a.optionId)-parseInt(b.optionId)));                
        } else {        
            appendLogs(`Failed to get OptionList from WebServer [${res.errorCode}]`);
        }
    } else {
      appendLogs(`OptionList: Not Web3 Connected`);
    }
  }

  async function update(newAccountId) {
    if (isWeb3Enabled) {
            setBuyerAccount(newAccountId)
            appendLogs([`New Buyer Account: [${newAccountId}]`])            
    } else {
            appendLogs([`Buyer Tab: Not Web3 Connected`])            
    }
  }

  /**
   * Exercise the option of the given Id
   * @param {*} optionId - The Option Id to Exercise
   */
  function handleExercise(optionId, value) {
    /**
     *  TODO - Implement the exercise logic on the Web Server and call it from here
     *       - This means assigning the option NFT back to the seller & burning it
     *       - move the option value (if > 0) from seller to buyer
     */

    console.log(`Exercise value is: ${value}`);
    value = Number(value).toFixed(2) * 100; // double to int

    if (value >= 0) {
      sendExerciseRequest(optionId, value, buyerAccount)
      .then((res) => {
        appendLogs(`[${optionId}] has been sent for exercise. !`);
        getMinedOptionListAndUpt(buyerAccount);
      })
      .catch((err) => {
        appendLogs(`Failed to exercise option due to ${err}!`);
      });
    } else {
      alert(`Valuation(${value} is less than zero, can't exercise for this case!)`);
      //TODO: need to clarify value less zero logic
    }
  }

  /**
   * Buy the option of the given Id
   * @param {*} optionId - The Option Id to Exercise
   */
  function handleBuy(uniqueId) {
    /**
     *  TODO - Implement exercise buy logic in Web Server & call it from here.
     *       - This means extending the create logic to assign the option NFT
     *       - to the buyer and move the option premium from buyer to seller.
     */
    if(!(uniqueId in offeredOptDict))
    {
      appendLogs(`Option [${uniqueId}] is not found!`);
      return;
    }

    if(NOT_SELECTED === buyerAccount){
      appendLogs(`Please select a buyer account`);
      return;
    }

    appendLogs(`Request Mint & Transfer of Option [${uniqueId}] for account [${buyerAccount}]`);

      let optionTermsAsJson = offeredOptDict[uniqueId];
      optionTermsAsJson.buyer = buyerAccount;
      sendCreateOptionRequest(optionTermsAsJson)
      .then((res)=>{
        appendLogs(`[${uniqueId}] minted with NFT Id ${JSON.stringify(res.optionId)}!`);
        if(uniqueId in offeredOptDict){
          delete offeredOptDict[uniqueId]
          setOfferedOptDict(offeredOptDict);
          appendLogs(`[${uniqueId}] Deleted from offer list as it has been sold`);
        }
        getMinedOptionListAndUpt(buyerAccount);
      })
      .catch((err)=>{
        appendLogs(`Failed to create option due to ${err}!`);
      })
  }

  /**
   * component life cyble hook for construction
   */
  useEffect(() => {
        appendLogs('Initialization to get minted options');
    getMinedOptionListAndUpt(buyerAccount);
    },[])

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
                    <OptionList
                      buyerAccount={buyerAccount}
                      minted={true}
                      minedOptions={mintedOptList}
                      handleExercise={handleExercise}
                      handleLogChange={appendLogs} />
                  </div>
                </div>
                <div className="div-table-col">
                  <div className="pane-standard">
                    <h2 className="header-2">Options Offered for Sale</h2>
                    <OptionList
                      offered={true}
                      offeredOptionList={Object.values(offeredOptDict)}
                      handleBuy={handleBuy}
                      asSeller={false}
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
