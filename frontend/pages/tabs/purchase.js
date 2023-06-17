import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import ConnectedAccount from "../../components/ConnectedAccount";
import OptionList from "../../components/OptionList";
import { useOfferedOptionContext } from "../../context/offeredOption";
import { useConsoleLogContext } from "../../context/consoleLog";
import { sendCreateOptionRequest } from "../../lib/CreateOptionConnector";
import { sendExerciseRequest } from "../../lib/ExerciseConnector";
import { getERC721MintedOptionList } from "../../lib/ERC721Util";

const Contract = (props) => {

  const [logs, setLogs] = useConsoleLogContext()

  /**
   * TODO: Would ideally be a shared func in central library as all tabs use Console
   * @param {*} textLine 
   */
  function appendLogs(textLine) {
    logs.push(textLine);
    setLogs(logs.slice(-10))
  }


  const [offeredOptDict, setOfferedOptDict] = useOfferedOptionContext(); // [Dictionary] for options offered by seller
  const [mintedOptList, setMintedOptList] = useState([]); // [List] for minted options retrieved from block chain.

  const { isWeb3Enabled } = useMoralis();
  const { account } = useMoralis();
  const NOT_SELECTED = "?";
  var [connectedAccount, setConnectedAccount] = useState(NOT_SELECTED);

  /**
   * Get current list of all minted options from the server and filter for the current buyer account.
   * We filter as the connected account can only exercise the options for which they are the owner.
   * 
   * @param {*} buyerAccount - The buyer Account (currently connected) to filter for.
   */
  async function getMinedOptionListAndUpdate(buyerAccount) {
    if (isWeb3Enabled) {
      appendLogs(`Calling WebServer to update list of minted Options`)
      var res = {};
      if (buyerAccount !== null && buyerAccount !== undefined && buyerAccount !== NOT_SELECTED) {
        console.log(`Filter for [${buyerAccount}]`);
        res = await getERC721MintedOptionList(buyerAccount);
      } else {
        console.log(`Invalid buyer account [${buyerAccount}]`);
      }
      if (res.hasOwnProperty('okCode')) {
        setMintedOptList(res.message.terms.sort((a, b) => parseInt(a.optionId) - parseInt(b.optionId)));
      } else {
        appendLogs(`Failed to get OptionList from WebServer [${res.errorCode}]`);
      }
    } else {
      appendLogs(`Cannot update Minted Option list as we are Not Web3 Connected`);
    }
  }

  /**
 * Handle the event that the in-browser wallet switches (connects) as a different account.
 * @param {*} acct - The account that is now active
 */
  async function handleAccountChange(acct) {
    appendLogs(`Connected account :[${acct}]`);
    setConnectedAccount(acct);
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
    value = Number(value).toFixed(2) * 100; // double to int

    if (value >= 0) {
      sendExerciseRequest(optionId, value, connectedAccount)
        .then((res) => {
          appendLogs(`[${optionId}] has been sent for exercise. !`);
          getMinedOptionListAndUpdate(connectedAccount);
          if (res.hasOwnProperty(`errorCode`)) {
            appendLogs(`Exercise Failed : [${res.message}]`);
          } else {
            appendLogs(`Exercise Ok [${res.message}]`);
          }
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
    if (NOT_SELECTED === connectedAccount) {
      appendLogs(`Please select a buyer account`);
      return;
    }

    if (!(uniqueId in offeredOptDict)) {
      appendLogs(`Option [${uniqueId}] is not found!`);
      return;
    }

    appendLogs(`Request Mint & Transfer of Option [${uniqueId}] for account [${connectedAccount}]`);

    let optionTermsAsJson = offeredOptDict[uniqueId];
    optionTermsAsJson.buyer = connectedAccount;
    sendCreateOptionRequest(optionTermsAsJson)
      .then((res) => {
        if (res.hasOwnProperty(`errorCode`)) {
          appendLogs(`Mint & Transfer Failed : [${res.message}]`);
        } else {
          appendLogs(`[${uniqueId}] minted with NFT Id ${JSON.stringify(res.optionId)}!`);
          if (uniqueId in offeredOptDict) {
            delete offeredOptDict[uniqueId]
            setOfferedOptDict(offeredOptDict);
            appendLogs(`[${uniqueId}] Deleted from offer list as it has been sold`);
          }
          appendLogs(`Mint & Transfer Ok [${res.message}]`);
        }
        getMinedOptionListAndUpdate(connectedAccount);
      })
      .catch((err) => {
        appendLogs(`Failed to Mint & Transfer option due to ${err}!`);
      })
  }

  /**
   * component life cycle hook for construction
   */
  useEffect(() => {
    appendLogs(`Get minted options for connected account [${connectedAccount}]`);
    getMinedOptionListAndUpdate(connectedAccount);
  }, [isWeb3Enabled, account, connectedAccount])

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
                  <div className="pane-standard">
                    <h2 className="header-2">Options Purchased</h2>
                    <OptionList
                      buyerAccount={connectedAccount}
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
