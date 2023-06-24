import SimpleOption from "../../components/SimpleOption";
import OptionList from "../../components/OptionList";
import ConnectedAccount from "../../components/ConnectedAccount";
import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { addressConfig } from "../../constants";
import { OptionTypeOneTermsAreValid } from "../../lib/ERC721Util";
import { useOfferedOptionContext } from "../../context/offeredOption";
import { useConsoleLogContext } from "../../context/consoleLog";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

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
        <Box height="100%" width="100%" sx={{
            border: 0,
            bgcolor: 'background.paper',
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "10px",
            paddingBottom: "10px"
        }}>
            {connectedAccountIsSeller ? (
                <Box sx={{ width: '1800px', overflow: 'auto' }}>
                    <Grid container spacing={1} columns={3}>
                        <Grid item xs={3}>
                            <ConnectedAccount
                                handleChange={handleAccountChange}
                            />
                        </Grid>
                        <Grid item xs={1} >
                            <Grid container spacing={1} columns={1} >
                                <Grid item xs={1} sx={{ pb: '5px' }}>
                                    <Box display="flex">
                                        <Typography height="100%" width="100%" borderBottom={1} variant="h7" sx={{ pb: '5px' }} >Print Option for Sale</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={1}>
                                    <SimpleOption
                                        handleOfferOption={offerOption}
                                        handleLogChange={appendLogs} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={2}>
                            <Grid container spacing={1} columns={1}>
                                <Grid item xs={1} sx={{ pb: '5px' }}>
                                    <Box display="flex">
                                        <Typography height="100%" width="100%" borderBottom={1} variant="h7" sx={{ pb: '5px' }} >Options Offered for Sale</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={1}>
                                    <OptionList
                                        offered={true}
                                        offeredOptionList={Object.values(offeredOptDict)}
                                        asSeller={true}
                                        handleDel={handleDel}
                                        handleLogChange={appendLogs} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <Box sx={{ overflow: 'auto' }}>
                    <Grid container spacing={1} columns={1}>
                        <Grid item xs={1}>
                            <ConnectedAccount
                                handleChange={handleAccountChange}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Typography variant="h7" color="error.main">Connect as a Seller account to offer options</Typography>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default Contract;
