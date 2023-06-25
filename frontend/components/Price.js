import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";
import { getLevelContractABI, getTickerC, getLevelDetailsC, getVerifiedValueC, getDecimalsC } from "../lib/LevelWrapper";
import { ethers } from "ethers";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { formatNumber } from '../lib/Format';

const Contract = (props) => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  let levelAddress = props.contract.address; // Price contract address passed as prop
  let contractType = props.contract.type;

  const [ticker, setTicker] = useState("?");
  const [verifiedValue, setVerifiedValue] = useState("0");
  const [decimals, setDecimals] = useState(0);
  const [description, setDescription] = useState("?");
  const [decimalsForCalc, setDecimalsForCalc] = useState([]);
  const [symbolForCalc, setSymbolForCalc] = useState([]);

  const contractABI = getLevelContractABI(contractType);
  const [getTicker, isFetching, isLoading] = getTickerC(levelAddress, contractABI, true);
  const getLevelDetails = getLevelDetailsC(levelAddress, contractABI);
  const getVerifiedValue = getVerifiedValueC(levelAddress, contractABI);
  const getDecimalsFromContract = getDecimalsC(levelAddress, contractABI);

  const [priceBgColor, setPriceBgColor] = useState("background.paper");

  function formatValue(value, decimals) {
    return Number(value) / 10 ** decimals
  }

  async function updateUI() {
    if (isWeb3Enabled) {
      const _decimals = Number(await getDecimalsFromContract());
      const [_ticker, _description, _live, _value, _lastUpdate] = await getLevelDetails();
      setDescription(_description.toString());
      setTicker(_ticker.toString());
      updateUpdatePriceCell(formatValue(_value, _decimals));
      setDecimals(_decimals);
      decimalsForCalc.push(_decimals);
      setDecimalsForCalc(decimalsForCalc);
      symbolForCalc.push(_ticker);
      setSymbolForCalc(symbolForCalc);
    }
  }

  function updateUpdatePriceCell(formattedValue) {
    setVerifiedValue(prevValue => {
      if (formattedValue > prevValue) {
        setPriceBgColor(prevBgColor => "#2e7d32"); // mui green[800]
      } else if (formattedValue < prevValue) {
        setPriceBgColor(prevBgColor => "#c62828"); // mui red[800]
      } else {
        setPriceBgColor(prevBgColor => "background.paper");
      }
      return formattedValue;
    });
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI(); // update immediately once page is mounted.
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    if (isWeb3Enabled) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(levelAddress, contractABI, provider);
      const handleSecureLevelUpdate = async (
        value,
        event
      ) => {
        let valueFormatted = formatValue(value, decimalsForCalc[0]);
        updateUpdatePriceCell(valueFormatted);
        let info = `Secure ${symbolForCalc[0]} level updated to ${valueFormatted}`;
        setVerifiedValue(valueFormatted);
        props.onAddInfo(info);
      };
      const setSecureLevelEvents = async () => {
        // Subscribe to the "Withdrawal" event
        contract.on("LevelUpdated", handleSecureLevelUpdate, {
          fromBlock: 0,
          toBlock: "latest",
        });
      };

      setSecureLevelEvents();

      return () => {
        contract.off("LevelUpdated", handleSecureLevelUpdate);
      };
    }
  }, [levelAddress, contractABI, isWeb3Enabled]);

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
        <Grid container sx={{ color: 'primary.main', fontWeight: 'bold', pb: '20px' }} borderBottom={1} spacing={1} columns={6}>
          <Grid item xs={2}>
            Description
          </Grid>
          <Grid item xs={1}>
            <Box display="flex" justifyContent="center">
              Ticker
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Box display="flex" justifyContent="center">
              Price
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Box display="flex" justifyContent="center">
              Decimals
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Box display="flex" justifyContent="center">
              Type
            </Box>
          </Grid>
        </Grid>
      ) : null}
      {props.withHeader ? (
        <Grid container spacing={1} columns={6}>
          <Grid item xs={6}><br></br></Grid>
        </Grid>
      ) : null}
      <Grid container spacing={1} columns={6}>
        <Grid item xs={2}>
          {description}
        </Grid>
        <Grid item xs={1}>
          <Box display="flex" justifyContent="center">
            {ticker}
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Box display="flex" justifyContent="flex-end" bgcolor={priceBgColor}>
            {formatNumber(verifiedValue, decimals, true)}
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Box display="flex" justifyContent="center">
            {decimals}
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Box display="flex" justifyContent="center">
            {contractType}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contract;
