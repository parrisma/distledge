import * as React from 'react';
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";
import { getTokenContractABI, getSymbolC, getTokenNameC, getDecimalsC, getTokenSupplyC } from "../lib/StableTokenWrapper";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { formatNumber } from '../lib/Format';
import Button from "@mui/material/Button";

export default function Contract(props) {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const addressOfDeployedToken = props.contract.address; // Price contract address passed as prop
  const contractType = props.contract.type;

  const [symbol, setTicker] = useState("?");
  const [decimals, setDecimals] = useState("0");
  const [token_name, setTokenName] = useState("?");
  const [token_supply, setTokenSupply] = useState("?");

  const dispatch = useNotification();

  // Get ABI & Token Methods
  const contractABI = getTokenContractABI(contractType);
  const [getSymbol, isFetching, isLoading] = getSymbolC(addressOfDeployedToken, contractABI, true);
  const getTokenName = getTokenNameC(addressOfDeployedToken, contractABI);
  const getDecimals = getDecimalsC(addressOfDeployedToken, contractABI);
  const getTokenSupply = getTokenSupplyC(addressOfDeployedToken, contractABI)

  async function updateUI() {
    if (isWeb3Enabled) {
      const _decimals = Number((await getDecimals()));
      const _symbol = (await getSymbol());
      const _token_name = (await getTokenName());
      const _token_supply = Number(await getTokenSupply());
      setTicker(_symbol);
      setDecimals(_decimals);
      setTokenName(_token_name);
      setTokenSupply(_token_supply / (10 ** _decimals));
    }
  }

  useEffect(() => {
    updateUI(); // update immediately after render
    const interval = setInterval(() => { updateUI(); }, 2500);
    return () => {
      clearInterval(interval); // Stop update after unmounted
    };
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx) => {
    handleButtonClick(`Request Token update ${tx}`);
    handleNewNotification();
    updateUI();
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Stable Token Received!",
      title: "Token Notification",
      position: "topR",
      icon: "bell",
    });
  };

  const handleButtonClick = (info) => {
    props.onAddInfo(info);
  };

  return (
    <Box height="100%" width="100%" sx={{
      border: 0,
      bgcolor: 'background.paper',
      paddingLeft: "10px",
      paddingRight: "10px",
      paddingTop: "10px",
      paddingBottom: "10px"
    }}>
      {props.withHeader ? (
        <Grid container sx={{ minWidth: 500, color: 'primary.main', fontWeight: 'bold', pb: '20px' }} borderBottom={1} spacing={1} columns={6}>
          <Grid item xs={1}>
            Symbol
          </Grid>
          <Grid item xs={1}>
            Decimals
          </Grid>
          <Grid item xs={1}>
            Supply
          </Grid>
          <Grid item xs={1}>
            Type
          </Grid>
          <Grid item xs={1}>
            <div />
          </Grid>
        </Grid>
      ) : null}
      {props.withHeader ? (
        <Grid container sx={{ minWidth: 500 }} spacing={1} columns={6}>
          <Grid item xs={6}><br></br></Grid>
        </Grid>
      ) : null}
      <Grid container sx={{ minWidth: 500 }} spacing={1} columns={6}>
        <Grid item xs={1}>
          {symbol}
        </Grid>
        <Grid item xs={1}>
          {decimals}
        </Grid>
        <Grid item xs={1}>
          <Box display="flex" justifyContent="flex-end">
            {formatNumber(Number(token_supply), 0, true)}
          </Box>
        </Grid>
        <Grid item xs={1}>
          {contractType}
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="outlined"
            sx={{ whiteSpace: 'nowrap' }}
            onClick={() => {
              getSymbol({
                onSuccess: handleSuccess
              });
            }}
          >
            <div>Update Supply</div>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
