import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { addressConfig } from "../../constants";
import ConnectedAccount from "../../components/ConnectedAccount";
import OptionList from "../../components/OptionList";
import { useOfferedOptionContext } from "../../context/offeredOption";
import { useConsoleLogContext } from "../../context/consoleLog";
import { sendCreateOptionRequest } from "../../lib/CreateOptionConnector";
import { sendExerciseRequest } from "../../lib/ExerciseConnector";
import { getERC721MintedOptionList } from "../../lib/ERC721Util";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const Contract = (props) => {

  const [logs, setLogs] = useConsoleLogContext()
  function appendLogs(textLine) {
    logs.push(textLine);
    setLogs(logs.slice(-250))
  }

  const [offeredOptDict, setOfferedOptDict] = useOfferedOptionContext(); // [Dictionary] for options offered by seller
  const [mintedOptList, setMintedOptList] = useState([]); // [List] for minted options retrieved from block chain.

  const { isWeb3Enabled } = useMoralis();
  const { account } = useMoralis();
  const NOT_SELECTED = "?";
  var [connectedAccount, setConnectedAccount] = useState(NOT_SELECTED);
  var [connectedAccountIsSeller, setConnectedAccountIsSeller] = useState(false);

  /**
   * Get current list of all minted options from the server and filter for the current buyer account.
   * We filter as the connected account can only exercise the options for which they are the owner.
   * 
   * @param {*} buyerAccount - The buyer Account (currently connected) to filter for.
   */
  async function getMinedOptionListAndUpdate(buyerAccount) {
    if (isWeb3Enabled) {
      appendLogs(`Calling WebServer to update list of minted Options for [${buyerAccount}]`);
      var res = {};
      if (buyerAccount !== null && buyerAccount !== undefined && buyerAccount !== NOT_SELECTED) {
        res = await getERC721MintedOptionList(buyerAccount);
        if (res.hasOwnProperty('okCode')) {
          setMintedOptList(res.message.terms.sort((a, b) => parseInt(a.optionId) - parseInt(b.optionId)));
        } else {
          appendLogs(`Failed to get OptionList from WebServer [${res.errorCode}]`);
        }
      } else {
        console.log(`Invalid buyer account [${buyerAccount}]`);
      }
    } else {
      appendLogs(`Error, cannot update Minted Option list as we are Not Web3 Connected`);
    }
  }

  /**
 * Handle the event that the in-browser wallet switches (connects) as a different account.
 * @param {*} acct - The account that is now active
 */
  async function handleAccountChange(acct) {
    appendLogs(`Connected account :[${acct}]`);
    await setConnectedAccount(acct);
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
          appendLogs(`Option with NFT Id [${optionId}] has been sent for exercise.`);
          getMinedOptionListAndUpdate(connectedAccount);
          if (res.hasOwnProperty(`errorCode`)) {
            appendLogs(`Exercise Failed : [${res.message}]`);
          } else {
            appendLogs(`${res.message} for Option NFT Id [${optionId}]`);
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
      appendLogs(`Error, please select a buyer account`);
      return;
    }

    if (!(uniqueId in offeredOptDict)) {
      appendLogs(`Error, Option [${uniqueId}] is not found!`);
      return;
    }

    appendLogs(`Request Mint & Transfer of Option [${uniqueId}] for account [${connectedAccount}]`);

    let optionTermsAsJson = offeredOptDict[uniqueId];
    sendCreateOptionRequest(optionTermsAsJson, connectedAccount)
      .then((res) => {
        if (res.hasOwnProperty(`errorCode`)) {
          appendLogs(`Mint & Transfer Failed : [${res.message}]`);
        } else {
          appendLogs(`[${uniqueId}] minted with NFT Id ${JSON.stringify(res.optionId)}!`);
          if (uniqueId in offeredOptDict) {
            delete offeredOptDict[uniqueId]
            setOfferedOptDict(offeredOptDict);
            appendLogs(`[${uniqueId}] deleted from offer list as it has been sold`);
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
   * component life cycle hook for construction
   */
  useEffect(() => {
    appendLogs(`Get minted options for connected account [${connectedAccount}]`);
    getMinedOptionListAndUpdate(connectedAccount);
  }, [isWeb3Enabled, account, connectedAccount])

  return (
    <Box height="100%" width="100%" sx={{
      border: 0,
      bgcolor: 'background.paper',
      paddingLeft: "10px",
      paddingRight: "10px",
      paddingTop: "10px",
      paddingBottom: "10px"
    }}>
      {connectedAccountIsSeller ? (
        <Box sx={{ overflow: 'auto' }}>
          <Grid container spacing={1} columns={1}>
            <Grid item xs={1}>
              <ConnectedAccount
                handleChange={handleAccountChange}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography variant="h7" color="error.main">Connect as a Buyer account to trade Options</Typography>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box sx={{ width: '1800px', overflow: 'auto' }}>
          <Grid container spacing={1} columns={2}>
            <Grid item xs={2}>
              <ConnectedAccount
                handleChange={handleAccountChange}
              />
            </Grid>
            <Grid item xs={1}>
              <Box display="flex"  >
                <Typography height="100%" width="100%" borderBottom={1} variant="h7" sx={{ pb: '5px' }} >Options Purchased</Typography>
              </Box>
              <Box>
                <OptionList
                  buyerAccount={connectedAccount}
                  minted={true}
                  minedOptions={mintedOptList}
                  handleExercise={handleExercise}
                  handleLogChange={appendLogs} />
              </Box>
            </Grid>
            <Grid item xs={1}>
              <Box display="flex"  >
                <Typography height="100%" width="100%" borderBottom={1} variant="h7" sx={{ pb: '5px' }}>Options Offered for Sale</Typography>
              </Box>
              <Box>
                <OptionList
                  offered={true}
                  offeredOptionList={Object.values(offeredOptDict)}
                  handleBuy={handleBuy}
                  asSeller={false}
                  handleLogChange={appendLogs} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Contract;
