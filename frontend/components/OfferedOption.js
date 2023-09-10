import * as React from "react";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { formatNumber } from '../lib/Format';
import { valueOptionByPOSTRequest, emptyValuationResponse } from "../lib/ERC721Util";
import { getOptionById, valueOptionById } from "../lib/ERC721Util";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import OptionDetail from "./OptionDetail";

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    var [optionValuation, setOptionValuation] = useState(emptyValuationResponse());
    var [showDetail, setShowDetail] = useState(false);
    var [optionDetail, setOptionDetail] = useState({});

    async function update(optionDetail) {
        try {
            var res = await getOptionById(optionDetail.uniqueId);
            props.handleLogChange(`optionID is [${optionDetail.uniqueId}]`);
            props.handleLogChange(`own property is [${res.hasOwnProperty('okCode')}]`);

            setOptionDetail(optionDetail);

            var valRes = await valueOptionByPOSTRequest(optionDetail);
            if (valRes.hasOwnProperty('okCode')) {
                setOptionValuation({
                    "value": `${valRes.message.value}`,
                    "parameters": valRes.message.parameters
                });
            } else {
                props.handleLogChange(`Failed to get OptionList from WebServer [${res.errorCode}]`);
                setOptionValuation(emptyValuationResponse());
            }
        } catch (err) {
            props.handleLogChange(`Failed to value offered option by POST with [${err.message}]`);
        }
    }

    useEffect(() => {
        update(props.optionDetail);
    }, [isWeb3Enabled, props.buyerAccount]);

    function showDetail() {
        setShowDetail(false);
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
        }}>
            {props.rowNum === 0 ? (
                <Grid container sx={{ color: 'primary.main', fontWeight: 'bold' }} spacing={1} columns={10}>
                    <Grid item xs={3}>
                        Unique Id
                    </Grid>
                    <Grid item xs={2}>
                        <Box display="flex" justifyContent="center">
                            Option Name
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="center">
                            Premium
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="center">
                            Notional
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="center">
                            Strike
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="center">
                            Value
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="center">
                            Action
                        </Box>
                    </Grid>
                </Grid>
            ) :
                <div />
            }
            {props.optionDetail !== undefined && props.optionDetail.hasOwnProperty('uniqueId') ? (

                <Grid container spacing={1} columns={10}>
                    <Grid item xs={1}>
                        <Button
                            variant="outlined"
                            sx={{ fontSize: '14px', pt: 0, pb: 0, whiteSpace: 'nowrap', textTransform: "none" }}
                            onClick={setShowDetail}
                        >
                            <div>info</div>
                        </Button>
                        <OptionDetail
                            open={showDetail}
                            handleClose={detailHide}
                            detail={optionDetail}
                            valuation={optionValuation}
                            optionId={props.optionId}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        {props.optionDetail.uniqueId}
                    </Grid>
                    <Grid item xs={2}>
                        {props.optionDetail.optionName}
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="flex-end">
                            {formatNumber(Number(props.optionDetail.premium), 0, true)}
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="flex-end">
                            {formatNumber(Number(props.optionDetail.notional), 0, true)}
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="flex-end">
                            {formatNumber(Number(props.optionDetail.strike), 0, true)}
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="flex-end">
                            {formatNumber(Number(optionValuation.value), 2, true)}
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                sx={{ fontSize: '14px', pt: 0.1, pb: 0.1, whiteSpace: 'nowrap', textTransform: "none" }}
                                onClick={() => {
                                    props.handleAction(props.optionDetail.uniqueId);
                                }}>
                                <div>{props.action}</div>
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            ) :
                <div />
            }
        </Box >
    );
};

export default Contract;
