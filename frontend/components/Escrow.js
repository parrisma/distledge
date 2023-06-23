import * as React from 'react';
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";
import { getEscrowContractABI, getManagedTokenNameC, getBalanceOnHandC, getIsBalancedC, getEscrowDecimalsC } from "@/lib/EscrowWrapper";
import { ethers } from "ethers";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { formatNumber } from '../lib/Format';
import Button from "@mui/material/Button";

export default function Contract(props) {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    let escrowAddress = props.contract.address; // Price contract address passed as prop
    let contractType = props.contract.type;

    const [managed_token_name, setManagedTokenName] = useState("?");
    const [balance_on_hand, setBalanceOnHand] = useState("0");
    const [isBalanced, setIsBalanced] = useState("?");
    const [decimals, setDecimals] = useState("0");
    const dispatch = useNotification();

    const contractABI = getEscrowContractABI(contractType);
    const [getManagedTokenName, isFetching, isLoading] = getManagedTokenNameC(escrowAddress, contractABI, true);
    const getBalanceOnHand = getBalanceOnHandC(escrowAddress, contractABI);
    const getIsBalanced = getIsBalancedC(escrowAddress, contractABI);
    const getEscrowDecimals = getEscrowDecimalsC(escrowAddress, contractABI);

    async function updateUI() {
        if (isWeb3Enabled) {
            const _managed_token_name = (await getManagedTokenName());
            const _balance_on_hand = Number(await getBalanceOnHand());
            const _isBalanced = Boolean(await getIsBalanced());
            const _decimals = Number(await getEscrowDecimals());
            setManagedTokenName(_managed_token_name);
            setBalanceOnHand(_balance_on_hand / (10 ** _decimals));
            setIsBalanced(_isBalanced.toString());
        }
    }

    useEffect(() => {
        updateUI(); // update immediately after render
        const interval = setInterval(() => { if (isWeb3Enabled) { updateUI(); } }, 2500);
        return () => {
            clearInterval(interval); // Stop update after unmounted
        };
    }, [isWeb3Enabled]);

    const handleSuccess = async (tx) => {
        handleButtonClick(`Request Escrow update ${tx}`);
        handleNewNotification();
        updateUI();
    };

    const handleError = async (err) => {
        console.log(err);
    };

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Escrow Account Received!",
            title: "Escrow Notification",
            position: "topR",
            icon: "bell",
        });
    };

    const handleButtonClick = (info) => {
        props.onAddInfo(info);
    };

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(escrowAddress, contractABI, provider);
        const handleDeposit = async (
            assetCode,
            from,
            quantity,
            transactionId,
            balance,
            event
        ) => {
            let info =
                quantity +
                " " +
                assetCode +
                " deposited from " +
                from +
                ", balance " +
                balance;
            props.onAddInfo(info);
        };
        const handleWithdrawal = async (
            assetCode,
            to,
            quantity,
            transactionId,
            balance,
            event
        ) => {
            let info =
                quantity +
                " " +
                assetCode +
                " withdrawn to " +
                to +
                ", balance " +
                balance;
            props.onAddInfo(info);
        };
        const setEscrowEvents = async () => {
            // Subscribe to the "Deposit" event
            contract.on("Deposit", handleDeposit, {
                fromBlock: 0,
                toBlock: "latest",
            });

            // Subscribe to the "Withdrawal" event
            contract.on("Withdrawal", handleWithdrawal, {
                fromBlock: 0,
                toBlock: "latest",
            });
        };

        setEscrowEvents();

        return () => {
            contract.off("Deposit", handleDeposit);
            contract.off("Withdrawal", handleWithdrawal);
        };
    }, [escrowAddress, contractABI]);

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
                <Grid container sx={{ minWidth: 500, color: 'primary.main', fontWeight: 'bold', pb: '20px' }} borderBottom={1} spacing={1} columns={4}>
                    <Grid item xs={1}>
                        Escrow For
                    </Grid>
                    <Grid item xs={1}>
                        Supply
                    </Grid>
                    <Grid item xs={1}>
                        Balanced
                    </Grid>
                    <Grid item xs={1}>
                        <div />
                    </Grid>
                </Grid>
            ) : null}
            {props.withHeader ? (
                <Grid container sx={{ minWidth: 500 }} spacing={1} columns={4}>
                    <Grid item xs={4}><br></br></Grid>
                </Grid>
            ) : null}
            <Grid container sx={{ minWidth: 500 }} spacing={1} columns={4}>
                <Grid item xs={1}>
                    {managed_token_name}
                </Grid>
                <Grid item xs={1}>
                    <Box display="flex" justifyContent="flex-end">
                        {formatNumber(Number(balance_on_hand), 2, true)}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    {isBalanced}
                </Grid>
                <Grid item xs={1}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            getManagedTokenName({
                                onSuccess: handleSuccess,
                                onError: handleError,
                            });
                        }}
                    >
                        Update
                    </Button>
                </Grid>
            </Grid>
        </Box >
    );
}
