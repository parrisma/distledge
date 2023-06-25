import * as React from "react";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { getOptionById, valueOptionById } from "../lib/ERC721Util";
import { formatNumber } from '../lib/Format';
import OptionDetail from "./OptionDetail";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    var [optionDetail, setOptionDetail] = useState({});
    var [optionValuation, setOptionValuation] = useState({});
    var [showDetail, setShowDetail] = useState(false);

    async function update(optionId) {
        if (isWeb3Enabled) {
            var res = await getOptionById(optionId);
            if (res.hasOwnProperty('okCode')) {
                setOptionDetail(res.message.terms);
                var valRes = await valueOptionById(optionId);
                if (valRes.hasOwnProperty('okCode')) {
                    setOptionValuation(valRes.message);
                } else {
                    props.handleLogChange(`Failed to get OptionList from WebServer [${res.errorCode}]`);
                    setOptionValuation({});
                }
            } else {
                props.handleLogChange(`Failed to get OptionList from WebServer [${res.errorCode}]`);
                setOptionDetail({});
            }
        } else {
            props.handleLogChange(`OptionList: Not Web3 Connected`);
        }
    }

    useEffect(() => {
        update(props.optionId);
    }, [isWeb3Enabled, props.buyerAccount]);

    function detailShow() {
        setShowDetail(true);
        console.log(`Open`);
    }

    function detailHide() {
        setShowDetail(false);
        console.log(`Close`);
    }

    return (
        <Box height="100%" width="100%" sx={{
            border: 0,
            bgcolor: 'background.paper',
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "10px",
            paddingBottom: "10px"
        }}>            {props.rowNum === 0 ? (
            <Grid container sx={{ color: 'primary.main', fontWeight: 'bold' }} rowSpacing={0} spacing={0} columns={14}>
                <Grid item xs={1}>
                    <div />
                </Grid>
                <Grid item xs={1}>
                    Id
                </Grid>
                <Grid item xs={4}>
                    <Box display="flex" justifyContent="center">
                        Option Name
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box display="flex" justifyContent="center">
                        Notional
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box display="flex" justifyContent="center">
                        Strike
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box display="flex" justifyContent="center">
                        Value
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box display="flex" justifyContent="center">
                        Action
                    </Box>
                </Grid>
            </Grid>
        ) :
            <div />
            }
            {optionDetail !== undefined && optionDetail.hasOwnProperty('uniqueId') ? (
                <Grid container spacing={0} columns={14}>
                    <Grid item xs={1}>
                        <IconButton
                            sx={{ p: 0 }}
                            size="small"
                            onClick={() => { detailShow(); }}>
                            <InfoIcon></InfoIcon>
                        </IconButton>
                        <OptionDetail
                            open={showDetail}
                            handleClose={detailHide}
                            detail={optionDetail}
                            valuation={optionValuation}
                            optionId={props.optionId}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        {props.optionId}
                    </Grid>
                    <Grid item xs={4}>
                        {optionDetail.optionName}
                    </Grid>
                    <Grid item xs={2}>
                        <Box display="flex" justifyContent="flex-end">
                            {formatNumber(Number(optionDetail.notional), 0, true)}
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <Box display="flex" justifyContent="flex-end">
                            {formatNumber(Number(optionDetail.strike), 0, true)}
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <Box display="flex" justifyContent="flex-end">
                            {formatNumber(Number(optionValuation.value), 2, true)}
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                sx={{ fontSize: '14px', pt: 0.1, pb: 0.1, whiteSpace: 'nowrap', textTransform: "none" }}
                                onClick={() => {
                                    props.handleExercise(props.optionId, optionValuation.value);
                                }}>
                                <div>Exercise</div>
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            ) :
                <div />
            }
        </Box>
    );
};

export default Contract;
