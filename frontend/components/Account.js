import * as React from 'react';
import { useMoralis } from "react-moralis";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { formatNumber } from '../lib/Format';
import { useState, useEffect } from "react";
import { addressConfig } from "../constants";
import { getTokenContractABI, getBalanceOfC, getDecimalsC } from "../lib/StableTokenWrapper";
import { StableCoinType, StableShareType } from "../constants";

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();

    const [usdTokenBalance, setUsdTokenBalance] = useState("0");
    const [eurTokenBalance, setEurTokenBalance] = useState("0");
    const [cnyTokenBalance, setCnyTokenBalance] = useState("0");
    const [appleTokenBalance, setAppleTokenBalance] = useState("0");
    const [teslaTokenBalance, setTeslaTokenBalance] = useState("0");

    const [usdTokenDecimals, setUsdTokenDecimals] = useState("0");
    const [eurTokenDecimals, setEurTokenDecimals] = useState("0");
    const [cnyTokenDecimals, setCnyTokenDecimals] = useState("0");
    const [appleTokenDecimals, setAppleTokenDecimals] = useState("0");
    const [teslaTokenDecimals, setTeslaTokenDecimals] = useState("0");

    const [usdCashBalance, setUsdCashBalance] = useState("0");
    const [eurCashBalance, setEurCashBalance] = useState("0");
    const [cnyCashBalance, setCnyCashBalance] = useState("0");

    const coinTokenABI = getTokenContractABI(StableCoinType);
    const getEURTokenBalanceOfAccount = getBalanceOfC(addressConfig.eurStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getUSDTokenBalanceOfAccount = getBalanceOfC(addressConfig.usdStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getCNYTokenBalanceOfAccount = getBalanceOfC(addressConfig.cnyStableCoin, coinTokenABI, props.accountDetail.accountAddress);

    const getEURTokenDecimalsOfAccount = getDecimalsC(addressConfig.eurStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getUSDTokenDecimalsOfAccount = getDecimalsC(addressConfig.usdStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getCNYTokenDecimalsOfAccount = getDecimalsC(addressConfig.cnyStableCoin, coinTokenABI, props.accountDetail.accountAddress);

    const shareTokenABI = getTokenContractABI(StableShareType);
    const getAppleTokenBalanceOfAccount = getBalanceOfC(addressConfig.appleStableShare, shareTokenABI, props.accountDetail.accountAddress);
    const getTeslaTokenBalanceOfAccount = getBalanceOfC(addressConfig.teslaStableShare, shareTokenABI, props.accountDetail.accountAddress);

    const getAppleTokenDecimalsOfAccount = getDecimalsC(addressConfig.appleStableShare, shareTokenABI, props.accountDetail.accountAddress);
    const getTeslaTokenDecimalsOfAccount = getDecimalsC(addressConfig.teslaStableShare, shareTokenABI, props.accountDetail.accountAddress);


    async function updateAllTokenBalances() {
        if (isWeb3Enabled) {
            const _usdTokenBalance = Number(await getUSDTokenBalanceOfAccount());
            const _eurTokenBalance = Number(await getEURTokenBalanceOfAccount());
            const _cnyTokenBalance = Number(await getCNYTokenBalanceOfAccount());
            const _usdTokenDecimal = Number(await getUSDTokenDecimalsOfAccount());
            const _eurTokenDecimal = Number(await getEURTokenDecimalsOfAccount());
            const _cnyTokenDecimal = Number(await getCNYTokenDecimalsOfAccount());
            const _appleTokenBalance = Number(await getAppleTokenBalanceOfAccount());
            const _teslaTokenBalance = Number(await getTeslaTokenBalanceOfAccount());
            const _appleTokenDecimals = Number(await getAppleTokenDecimalsOfAccount());
            const _teslaTokenDecimals = Number(await getTeslaTokenDecimalsOfAccount());

            setUsdTokenDecimals(_usdTokenDecimal);
            setEurTokenDecimals(_eurTokenDecimal);
            setCnyTokenDecimals(_cnyTokenDecimal);
            setAppleTokenDecimals(_appleTokenDecimals);
            setTeslaTokenDecimals(_teslaTokenDecimals);
            setUsdTokenBalance(_usdTokenBalance / (10 ** _usdTokenDecimal));
            setEurTokenBalance(_eurTokenBalance / (10 ** _eurTokenDecimal));
            setCnyTokenBalance(_cnyTokenBalance / (10 ** _cnyTokenDecimal));
            setAppleTokenBalance(_appleTokenBalance / (10 ** _appleTokenDecimals));
            setTeslaTokenBalance(_teslaTokenBalance / (10 ** _teslaTokenDecimals));

            setUsdCashBalance(props.accountDetail.usd);
            setEurCashBalance(props.accountDetail.eur);
            setCnyCashBalance(props.accountDetail.cny);
        }
    }

    // Update every 2.5 seconds.
    useEffect(() => {
        console.log(`isWeb3Enabled : [${isWeb3Enabled}]`);
        updateAllTokenBalances(); // update immediately after render
        const interval = setInterval(() => { updateAllTokenBalances(); }, 2500);
        return () => {
            clearInterval(interval); // Stop update after unmounted
        };
    }, [isWeb3Enabled]);

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
                <Grid container sx={{ color: 'primary.main', fontWeight: 'bold', pb: '20px' }} borderBottom={1} spacing={0} columns={12}>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="center">
                            Name
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Box display="flex" justifyContent="center">
                            Wallet Address
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="flex-end">
                            EUR Cash
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="flex-end">
                            EUR Token
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="flex-end">
                            USD Cash
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="flex-end">
                            USD Token
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="flex-end">
                            CNY Cash
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="flex-end">
                            CNY Token
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="flex-end">
                            Apple Token
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="flex-end">
                            Tesla Token
                        </Box>
                    </Grid>
                </Grid>
            ) : null}
            {props.withHeader ? (
                <Grid container spacing={0} columns={12}>
                    <Grid item xs={12}><br></br></Grid>
                </Grid>
            ) : null}
            <Grid container spacing={1} columns={12}>
                <Grid item xs={1}>
                    {props.displayName}
                </Grid>
                <Grid item xs={3}>
                    {props.accountDetail.accountAddress}
                </Grid>
                <Grid item xs={1}>
                    <Box display="flex" justifyContent="flex-end">
                        {formatNumber(Number(eurCashBalance), eurTokenDecimals, true)}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    <Box display="flex" justifyContent="flex-end">
                        {formatNumber(Number(eurTokenBalance), eurTokenDecimals, true)}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    <Box display="flex" justifyContent="flex-end">
                        {formatNumber(Number(usdCashBalance), usdTokenDecimals, true)}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    <Box display="flex" justifyContent="flex-end">
                        {formatNumber(Number(usdTokenBalance), usdTokenDecimals, true)}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    <Box display="flex" justifyContent="flex-end">
                        {formatNumber(Number(cnyCashBalance), cnyTokenDecimals, true)}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    <Box display="flex" justifyContent="flex-end">
                        {formatNumber(Number(cnyTokenBalance), cnyTokenDecimals, true)}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    <Box display="flex" justifyContent="flex-end">
                        {formatNumber(Number(appleTokenBalance), appleTokenDecimals, true)}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    <Box display="flex" justifyContent="flex-end">
                        {formatNumber(Number(teslaTokenBalance), teslaTokenDecimals, true)}
                    </Box>
                </Grid>
            </Grid>
        </Box >
    );
};

export default Contract;